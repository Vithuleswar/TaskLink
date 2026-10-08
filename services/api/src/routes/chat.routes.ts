import { Router, Request, Response } from 'express';
import { store, ChatMessageEntity } from '../data/store.js';
import { bhashiniService } from '../services/bhashini.adapter.js';
import { io } from '../index.js';

const router = Router();

/**
 * GET /api/chat/:bookingId/messages
 * Retrieves chat history for a booking with translations tailored to the caller's language.
 */
router.get('/:bookingId/messages', async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const userLang = (req.query.lang as string) || 'en';

  const booking = store.getBooking(bookingId);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  const rawMessages = store.getChatMessages(bookingId);

  // Auto-translate any message not yet translated to the requesting user's language
  const preparedMessages = await Promise.all(
    rawMessages.map(async (msg) => {
      let displayText = msg.originalText;
      if (msg.originalLanguage !== userLang) {
        if (!msg.translations[userLang]) {
          try {
            const trans = await bhashiniService.translate(
              msg.originalText,
              msg.originalLanguage,
              userLang
            );
            msg.translations[userLang] = trans.translatedText;
          } catch {
            msg.translations[userLang] = msg.originalText;
          }
        }
        displayText = msg.translations[userLang];
      }

      return {
        id: msg.id,
        bookingId: msg.bookingId,
        senderId: msg.senderId,
        senderRole: msg.senderRole,
        senderName: msg.senderName,
        displayText,
        originalText: msg.originalText,
        originalLanguage: msg.originalLanguage,
        isTranslated: msg.originalLanguage !== userLang,
        createdAt: msg.createdAt,
      };
    })
  );

  return res.json({ success: true, bookingId, messages: preparedMessages });
});

/**
 * POST /api/chat/:bookingId/messages
 * Sends a message in the sender's language.
 * Dynamically translates using Bhashini for the recipient and broadcasts via Socket.IO.
 */
router.post('/:bookingId/messages', async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const { senderId, senderRole, senderName, text, language = 'ta', recipientLanguage = 'en' } = req.body;

    if (!senderId || !text) {
      return res.status(400).json({ error: 'senderId and text are required' });
    }

    const booking = store.getBooking(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Dynamic translation via Bhashini adapter (PPT F4 & F16)
    const translations: Record<string, string> = {
      [language]: text,
    };

    if (recipientLanguage && recipientLanguage !== language) {
      try {
        const trans = await bhashiniService.translate(text, language, recipientLanguage);
        translations[recipientLanguage] = trans.translatedText;
      } catch (err: any) {
        console.warn(`[Chat] Translation failed: ${err.message}`);
        translations[recipientLanguage] = text;
      }
    }

    const message: ChatMessageEntity = store.addChatMessage({
      bookingId,
      senderId,
      senderRole: senderRole || 'customer',
      senderName: senderName || 'User',
      originalText: text,
      originalLanguage: language,
      translations,
    });

    // Broadcast over Socket.IO to booking room (PPT F16)
    io.to(`booking:${bookingId}`).emit('chat:message', {
      bookingId,
      messageId: message.id,
      senderId: message.senderId,
      senderRole: message.senderRole,
      senderName: message.senderName,
      originalText: message.originalText,
      originalLanguage: message.originalLanguage,
      translations: message.translations,
      createdAt: message.createdAt,
    });

    return res.status(201).json({
      success: true,
      message,
      recipientTranslatedPreview: translations[recipientLanguage],
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to send chat message' });
  }
});

export default router;
