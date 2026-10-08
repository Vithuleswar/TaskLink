import { Router, Response } from 'express';
import { store, RosterImportRow } from '../data/store.js';
import { authenticate, requireRole, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/admin/verification-queue
 * Queue for society admin to review pending onboarding submissions (PPT Requirement F3)
 */
router.get(
  '/verification-queue',
  authenticate,
  requireRole(['society_admin', 'federation_admin', 'platform_ops']),
  (req: AuthenticatedRequest, res: Response) => {
    const societyId = req.user?.societyId;
    const pendingWorkers = store.getPendingWorkers(societyId);

    return res.json({
      success: true,
      pendingCount: pendingWorkers.length,
      workers: pendingWorkers,
    });
  }
);

/**
 * POST /api/admin/workers/:id/approve
 * Approve worker, assign skill certification badges, making them visible to customers (F3)
 */
router.post(
  '/workers/:id/approve',
  authenticate,
  requireRole(['society_admin', 'federation_admin', 'platform_ops']),
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { badges = ['Verified Cooperative Member'], certificateName } = req.body;

    const worker = store.approveWorker(id, req.user!.userId, badges);
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found in verification queue' });
    }

    if (certificateName && worker.serviceSkills[0]) {
      worker.serviceSkills[0].isCertified = true;
      worker.serviceSkills[0].certificateName = certificateName;
    }

    console.log(`✅ [Admin] Worker ${worker.id} approved by ${req.user!.fullName || req.user!.userId}`);

    return res.json({
      success: true,
      message: 'Worker verified and approved for customer discovery.',
      worker,
    });
  }
);

/**
 * POST /api/admin/workers/:id/reject
 * Reject worker with documented reason
 */
router.post(
  '/workers/:id/reject',
  authenticate,
  requireRole(['society_admin', 'federation_admin', 'platform_ops']),
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ error: 'Rejection reason is required' });
    }

    const worker = store.rejectWorker(id, reason);
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    return res.json({
      success: true,
      message: 'Worker onboarding rejected.',
      worker,
    });
  }
);

/**
 * POST /api/admin/roster/import
 * Bulk roster import from CSV (PPT Requirement F3)
 * Accepts either JSON array of rows or raw CSV string
 */
router.post(
  '/roster/import',
  authenticate,
  requireRole(['society_admin', 'federation_admin', 'platform_ops']),
  (req: AuthenticatedRequest, res: Response) => {
    const { csvContent, rows: jsonRows, societyId: targetSocietyId } = req.body;
    const societyId = targetSocietyId || req.user?.societyId || store.societies[0].id;

    let parsedRows: RosterImportRow[] = [];

    if (Array.isArray(jsonRows)) {
      parsedRows = jsonRows;
    } else if (typeof csvContent === 'string') {
      // Parse CSV lines
      const lines = csvContent.trim().split(/\r?\n/);
      if (lines.length <= 1) {
        return res.status(400).json({ error: 'CSV file contains no data rows' });
      }

      // Expected CSV headers: fullName,phone,phoneType,serviceCode,experienceYears,membershipId,upiId
      const headers = lines[0].split(',').map((h: string) => h.trim().toLowerCase());

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map((v: string) => v.trim());
        if (values.length < 2) continue;

        const row: any = {};
        headers.forEach((h: string, idx: number) => {
          row[h] = values[idx] || '';
        });

        parsedRows.push({
          fullName: row.fullname || row.name || values[0],
          phone: row.phone || values[1],
          phoneType: (row.phonetype === 'keypad' ? 'keypad' : 'smartphone'),
          serviceCode: row.servicecode || values[3] || 'ELEC',
          experienceYears: Number(row.experienceyears || values[4]) || 2,
          societyMembershipId: row.membershipid || values[5] || `ROSTER-${i}`,
          upiId: row.upiid || values[6],
          languages: row.languages,
        });
      }
    } else {
      return res.status(400).json({ error: 'Invalid input: provide either rows array or csvContent string' });
    }

    try {
      const report = store.importRoster(parsedRows, societyId, req.user!.userId);

      return res.json({
        success: true,
        message: `Bulk roster import completed. ${report.importedCount} workers queued for verification.`,
        report,
      });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Roster import failed' });
    }
  }
);

/**
 * GET /api/admin/analytics
 * High-level Federation KPI metrics, 0% commission proof, welfare, and language usage (PPT Requirement F18)
 */
router.get(
  '/analytics',
  (req: AuthenticatedRequest, res: Response) => {
    try {
      const federationId = (req.query.federationId as string) || req.user?.federationId || store.federations[0]?.id;
      const analytics = store.getAdminAnalytics(federationId);

      return res.json({
        success: true,
        analytics,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to retrieve analytics' });
    }
  }
);

/**
 * GET /api/admin/live-map
 * Live dispatch feed with workers lat/long, DIGIPIN, availability, and active bookings (PPT F18)
 */
router.get(
  '/live-map',
  (req: AuthenticatedRequest, res: Response) => {
    try {
      const federationId = (req.query.federationId as string) || store.federations[0]?.id;

      const workers = Array.from(store.workers.values())
        .filter((w) => w.federationId === federationId && w.verificationStatus === 'verified')
        .map((w) => {
          const user = store.users.get(w.userId);
          return {
            id: w.id,
            name: user?.fullName || 'Worker',
            phone: user?.phone,
            phoneType: w.phoneType,
            latitude: w.latitude,
            longitude: w.longitude,
            digipin: w.digipin,
            isOnline: w.isOnline,
            rating: w.ratingAverage,
            jobsCompleted: w.jobsCompleted,
            badges: w.badges,
            primarySkill: w.serviceSkills[0]?.serviceName || 'Labour',
          };
        });

      const activeBookings = Array.from(store.bookings.values())
        .filter((b) => ['requested', 'offered', 'accepted', 'on_the_way', 'in_progress'].includes(b.status))
        .map((b) => ({
          id: b.id,
          bookingNumber: b.bookingNumber,
          customerName: b.customerName,
          serviceName: b.serviceName,
          bookingType: b.bookingType,
          status: b.status,
          latitude: b.latitude,
          longitude: b.longitude,
          digipin: b.digipin,
          workerId: b.workerId,
          totalPayable: b.totalPayable,
        }));

      return res.json({
        success: true,
        federationId,
        totalOnlineWorkers: workers.filter((w) => w.isOnline).length,
        totalActiveBookings: activeBookings.length,
        workers,
        activeBookings,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch live map feed' });
    }
  }
);

/**
 * GET /api/admin/support/tickets
 * Federation support ticket queue with categorization and priority (PPT F18)
 */
router.get(
  '/support/tickets',
  (req: AuthenticatedRequest, res: Response) => {
    try {
      const { status, category } = req.query;
      let tickets = Array.from(store.supportTickets.values());

      if (status) {
        tickets = tickets.filter((t) => t.status === status);
      }
      if (category) {
        tickets = tickets.filter((t) => t.category === category);
      }

      return res.json({
        success: true,
        count: tickets.length,
        tickets,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to list support tickets' });
    }
  }
);

/**
 * POST /api/admin/support/tickets/:id/reply
 * Respond to customer or worker support ticket
 */
router.post(
  '/support/tickets/:id/reply',
  authenticate,
  requireRole(['society_admin', 'federation_admin', 'platform_ops']),
  (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { text, language = 'en' } = req.body;

      if (!text) {
        return res.status(400).json({ error: 'Reply text required' });
      }

      const ticket = store.addSupportReply(id, {
        senderId: req.user!.userId,
        senderRole: req.user!.role,
        senderName: req.user!.fullName || 'Admin Support',
        text,
        language,
      });

      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      return res.json({
        success: true,
        message: 'Reply posted to ticket.',
        ticket,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to reply to ticket' });
    }
  }
);

/**
 * POST /api/admin/support/tickets/:id/escalate
 * Escalate ticket from society to federation
 */
router.post(
  '/support/tickets/:id/escalate',
  authenticate,
  (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const ticket = store.escalateSupportTicket(id);
      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      return res.json({
        success: true,
        message: 'Ticket escalated to Federation Secretariat.',
        ticket,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to escalate ticket' });
    }
  }
);

/**
 * GET /api/admin/groups/pending
 * List worker crews with member shares
 */
router.get(
  '/groups/pending',
  (req: AuthenticatedRequest, res: Response) => {
    try {
      const groups = Array.from(store.groups.values());
      return res.json({
        success: true,
        groups,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to list groups' });
    }
  }
);

export default router;
