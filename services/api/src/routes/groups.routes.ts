import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { store, GroupEntity, GroupMemberEntity, BookingEntity } from '../data/store.js';
import { pricingService } from '../services/pricing.service.js';

const router = Router();

/**
 * GET /api/groups
 * Lists available worker crews with discovery cards (headcount, group rating, daily rate per person).
 */
router.get('/', (req: Request, res: Response) => {
  const { crewType, federationId } = req.query;
  const groups = store.listGroups(crewType as string, federationId as string);

  return res.json({
    success: true,
    count: groups.length,
    groups: groups.map((g) => ({
      id: g.id,
      name: g.name,
      crewType: g.crewType,
      leadWorkerName: g.leadWorkerName,
      headcount: g.headcount,
      dailyRatePerPerson: g.dailyRatePerPerson,
      totalDailyRate: g.headcount * g.dailyRatePerPerson,
      ratingAverage: g.ratingAverage,
      ratingCount: g.ratingCount,
      members: g.members,
      zeroCommissionStatement: '0% Platform Commission: 100% of crew booking payment is split directly among artisans.',
    })),
  });
});

/**
 * GET /api/groups/:id
 * Gets crew profile and member breakdown.
 */
router.get('/:id', (req: Request, res: Response) => {
  const group = store.getGroup(req.params.id);
  if (!group) {
    return res.status(404).json({ error: 'Crew group not found' });
  }
  return res.json({ success: true, group });
});

/**
 * POST /api/groups
 * Creates a new worker group / crew (PPT F10).
 * Validates that member payout shares sum to exactly 100%.
 */
router.post('/', (req: Request, res: Response) => {
  try {
    const {
      name,
      crewType = 'construction',
      leadWorkerId,
      societyId,
      headcount,
      dailyRatePerPerson,
      members = [],
    } = req.body;

    if (!name || !leadWorkerId || !headcount || !dailyRatePerPerson) {
      return res.status(400).json({
        error: 'name, leadWorkerId, headcount, and dailyRatePerPerson are required',
      });
    }

    const leadWorker = store.getWorkerById(leadWorkerId);
    if (!leadWorker) {
      return res.status(404).json({ error: 'Lead worker not found' });
    }
    const leadUser = store.users.get(leadWorker.userId);

    // If members not provided, initialize with lead worker at 100%
    const formattedMembers: GroupMemberEntity[] = members.length > 0
      ? members.map((m: any) => ({
          workerId: m.workerId,
          workerName: m.workerName || store.users.get(store.getWorkerById(m.workerId)?.userId || '')?.fullName || 'Artisan',
          phoneType: m.phoneType || store.getWorkerById(m.workerId)?.phoneType || 'smartphone',
          payoutSharePercent: Number(m.payoutSharePercent),
          confirmedAttendance: m.confirmedAttendance !== undefined ? !!m.confirmedAttendance : true,
        }))
      : [
          {
            workerId: leadWorker.id,
            workerName: leadUser?.fullName || 'Lead Artisan',
            phoneType: leadWorker.phoneType,
            payoutSharePercent: 100.0,
            confirmedAttendance: true,
          },
        ];

    const group: GroupEntity = store.createGroup({
      name,
      crewType,
      leadWorkerId,
      leadWorkerName: leadUser?.fullName || 'Lead Artisan',
      societyId: societyId || leadWorker.societyId,
      federationId: leadWorker.federationId,
      headcount: Number(headcount),
      dailyRatePerPerson: Number(dailyRatePerPerson),
      ratingAverage: 4.8,
      ratingCount: 0,
      active: true,
      members: formattedMembers,
    });

    return res.status(201).json({
      success: true,
      group,
      message: 'Worker group created successfully with configured member payout shares.',
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to create group' });
  }
});

/**
 * POST /api/groups/:id/book
 * Books a worker group for N days (PPT F10).
 * Computes multi-day total, creates booking, and splits payout shares among members.
 */
router.post('/:id/book', (req: Request, res: Response) => {
  try {
    const { customerId, days = 1, addressText, scheduledStartDate, notes } = req.body;

    const group = store.getGroup(req.params.id);
    if (!group) {
      return res.status(404).json({ error: 'Crew group not found' });
    }

    const numDays = Number(days);
    if (numDays <= 0) {
      return res.status(400).json({ error: 'days must be greater than 0' });
    }

    const customer = store.users.get(customerId);
    const totalDailyWage = group.headcount * group.dailyRatePerPerson;
    const baseTotal = totalDailyWage * numDays;
    const workerReceives = baseTotal; // 100% of gig price to crew!
    const platformCommission = 0.0; // STRICT 0% COMMISSION!
    const totalPayable = workerReceives;

    // Calculate itemized member payout splits (must sum to total)
    const memberPayouts = group.members.map((m) => {
      const shareAmount = Number(((workerReceives * m.payoutSharePercent) / 100.0).toFixed(2));
      return {
        workerId: m.workerId,
        workerName: m.workerName,
        phoneType: m.phoneType,
        sharePercent: m.payoutSharePercent,
        shareAmountRupees: shareAmount,
        attendanceConfirmed: m.confirmedAttendance,
      };
    });

    const bookingCount = store.bookings.size + 1;
    const bookingNumber = `CREW-${new Date().getFullYear()}-${String(bookingCount).padStart(5, '0')}`;

    // Create booking entity for crew job
    const booking: BookingEntity = store.createBooking({
      bookingNumber,
      customerId,
      customerName: customer?.fullName || 'Customer',
      customerPhone: customer?.phone,
      workerId: group.leadWorkerId,
      workerName: `${group.name} (Lead: ${group.leadWorkerName})`,
      serviceCode: 'GROUP_LABOUR',
      serviceName: `${group.name} (${group.headcount} Workers - ${group.crewType})`,
      bookingType: 'scheduled',
      status: 'accepted',
      scheduledStartTime: scheduledStartDate || new Date().toISOString(),
      addressText: addressText || 'Project Site',
      latitude: 11.0185,
      longitude: 76.9634,
      baseRate: baseTotal,
      surgeMultiplier: 1.0,
      surgeAmount: 0.0,
      isNightTime: false,
      nightPremiumAmount: 0.0,
      isHoliday: false,
      holidayPremiumAmount: 0.0,
      workerReceives,
      platformCommission,
      paymentGatewayFee: 0.0,
      totalPayable,
      notes: `${numDays}-day crew booking for ${group.headcount} artisans. ${notes || ''}`,
      fundsEscrowStatus: 'held',
    });

    return res.status(201).json({
      success: true,
      booking,
      crewDetails: {
        groupId: group.id,
        groupName: group.name,
        daysBooked: numDays,
        headcount: group.headcount,
        dailyRatePerPerson: group.dailyRatePerPerson,
        memberPayoutSplits: memberPayouts,
      },
      zeroCommissionStatement: '0% Platform Commission: 100% of ₹' + workerReceives + ' is distributed to the artisans.',
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to book crew' });
  }
});

/**
 * POST /api/groups/:id/attendance
 * Confirms or updates member attendance for a job (app or voice call path).
 */
router.post('/:id/attendance', (req: Request, res: Response) => {
  try {
    const { workerId, confirmed } = req.body;
    if (!workerId || confirmed === undefined) {
      return res.status(400).json({ error: 'workerId and confirmed (boolean) are required' });
    }

    const updated = store.updateGroupMemberAttendance(req.params.id, workerId, !!confirmed);
    if (!updated) {
      return res.status(404).json({ error: 'Crew group not found' });
    }

    return res.json({
      success: true,
      message: 'Member attendance updated.',
      group: updated,
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to update attendance' });
  }
});

export default router;
