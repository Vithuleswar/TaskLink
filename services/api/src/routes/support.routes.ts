import { Router, Request, Response } from 'express';
import { store, SupportTicketEntity } from '../data/store.js';
import { bhashiniService } from '../services/bhashini.adapter.js';

const router = Router();

/**
 * POST /api/support/tickets
 * Raises a support ticket with society helpdesk (multilingual auto-translation).
 */
router.post('/tickets', async (req: Request, res: Response) => {
  try {
    const { userId, category, subject, description, language = 'ta', priority = 'medium' } = req.body;

    if (!userId || !subject || !description) {
      return res.status(400).json({ error: 'userId, subject, and description are required' });
    }

    const user = store.users.get(userId);
    let translatedSubjectEn: string | undefined;
    let translatedDescriptionEn: string | undefined;

    // If submitted in an Indic language, translate to English for administrative review
    if (language !== 'en') {
      try {
        const transSub = await bhashiniService.translate(subject, language, 'en');
        translatedSubjectEn = transSub.translatedText;
        const transDesc = await bhashiniService.translate(description, language, 'en');
        translatedDescriptionEn = transDesc.translatedText;
      } catch (err: any) {
        console.warn(`[Support] Auto-translation to English fallback: ${err.message}`);
      }
    }

    const ticket: SupportTicketEntity = store.createSupportTicket({
      userId,
      userRole: user?.role || 'customer',
      userName: user?.fullName || 'User',
      societyId: user?.societyId,
      federationId: user?.federationId,
      category: category || 'general_inquiry',
      subject,
      description,
      language,
      translatedSubjectEn,
      translatedDescriptionEn,
      status: 'open',
      priority,
    });

    return res.status(201).json({
      success: true,
      ticket,
      message: 'Support ticket submitted to cooperative society helpdesk.',
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to create support ticket' });
  }
});

/**
 * GET /api/support/tickets
 * Society or federation admin views tickets queue.
 */
router.get('/tickets', (req: Request, res: Response) => {
  const { societyId, federationId } = req.query;
  const tickets = store.getSupportTickets(societyId as string, federationId as string);
  return res.json({ success: true, count: tickets.length, tickets });
});

/**
 * GET /api/support/tickets/:id
 * Fetches ticket details and reply thread.
 */
router.get('/tickets/:id', (req: Request, res: Response) => {
  const ticket = store.getSupportTicketById(req.params.id);
  if (!ticket) {
    return res.status(404).json({ error: 'Support ticket not found' });
  }
  return res.json({ success: true, ticket });
});

/**
 * POST /api/support/tickets/:id/reply
 * Adds a response to a support ticket with auto-translation to user language.
 */
router.post('/tickets/:id/reply', async (req: Request, res: Response) => {
  try {
    const { senderId, text, language = 'en' } = req.body;
    if (!senderId || !text) {
      return res.status(400).json({ error: 'senderId and text are required' });
    }

    const ticket = store.getSupportTicketById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Support ticket not found' });
    }

    const sender = store.users.get(senderId);

    // If admin replies in English, translate to user's ticket language
    let translatedText: string | undefined;
    if (language !== ticket.language) {
      try {
        const trans = await bhashiniService.translate(text, language, ticket.language);
        translatedText = trans.translatedText;
      } catch {
        translatedText = text;
      }
    }

    const updated = store.addSupportReply(ticket.id, {
      senderId,
      senderRole: sender?.role || 'society_admin',
      senderName: sender?.fullName || 'Cooperative Support Desk',
      text,
      language,
      translatedText,
    });

    return res.json({ success: true, ticket: updated });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to add reply' });
  }
});

/**
 * POST /api/support/tickets/:id/escalate
 * Escalates ticket from society helpdesk to district federation admin (PPT F16).
 */
router.post('/tickets/:id/escalate', (req: Request, res: Response) => {
  const ticket = store.escalateSupportTicket(req.params.id);
  if (!ticket) {
    return res.status(404).json({ error: 'Support ticket not found' });
  }
  return res.json({
    success: true,
    message: 'Ticket successfully escalated to Federation Administrative Desk.',
    ticket,
  });
});

export default router;
