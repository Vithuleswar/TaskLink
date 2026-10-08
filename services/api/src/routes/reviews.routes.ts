import { Router, Request, Response } from 'express';
import { store, ReviewEntity } from '../data/store.js';
import { bhashiniService } from '../services/bhashini.adapter.js';

const router = Router();

/**
 * POST /api/reviews
 * Submits a rating & review for a completed booking (PPT F12).
 * Strictly requires completed booking status. Auto-translates via Bhashini.
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { bookingId, rating, tags = [], comment, language = 'en' } = req.body;

    if (!bookingId || rating === undefined) {
      return res.status(400).json({ error: 'bookingId and rating (1-5) are required' });
    }

    const numRating = Number(rating);
    if (numRating < 1 || numRating > 5) {
      return res.status(400).json({ error: 'Rating must be an integer between 1 and 5' });
    }

    const booking = store.getBooking(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({
        error: 'Only completed bookings can submit a review (PPT F12). Current status: ' + booking.status,
      });
    }

    // Auto-translate review comment using Bhashini (PPT F4 & F12)
    let translatedComment: string | undefined;
    if (comment && language !== 'en') {
      try {
        const trans = await bhashiniService.translate(comment, language, 'en');
        translatedComment = trans.translatedText;
      } catch {
        translatedComment = comment;
      }
    }

    // Create review entity and update worker's Bayesian smoothed rating
    const review: ReviewEntity = store.createReview({
      bookingId: booking.id,
      workerId: booking.workerId || '',
      customerId: booking.customerId,
      customerName: booking.customerName || 'Customer',
      rating: numRating,
      tags,
      comment,
      translatedComment,
    });

    const updatedWorker = store.getWorkerById(review.workerId);

    return res.status(201).json({
      success: true,
      review,
      workerUpdatedStats: {
        workerId: updatedWorker?.id,
        newRatingAverage: updatedWorker?.ratingAverage,
        totalRatingCount: updatedWorker?.ratingCount,
        jobsCompleted: updatedWorker?.jobsCompleted,
      },
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to submit review' });
  }
});

/**
 * GET /api/reviews/worker/:workerId
 * Fetches all reviews and average rating for a worker profile.
 */
router.get('/worker/:workerId', (req: Request, res: Response) => {
  const reviews = store.getReviewsByWorker(req.params.workerId);
  const worker = store.getWorkerById(req.params.workerId);

  return res.json({
    success: true,
    workerId: req.params.workerId,
    ratingAverage: worker?.ratingAverage || 0,
    ratingCount: worker?.ratingCount || 0,
    count: reviews.length,
    reviews,
  });
});

/**
 * POST /api/reviews/:id/reply
 * Worker replies once to a customer review (PPT F12).
 */
router.post('/:id/reply', (req: Request, res: Response) => {
  try {
    const { reply } = req.body;
    if (!reply || reply.trim() === '') {
      return res.status(400).json({ error: 'Reply text is required' });
    }

    const updated = store.addReviewReply(req.params.id, reply.trim());
    if (!updated) {
      return res.status(404).json({ error: 'Review not found' });
    }

    return res.json({
      success: true,
      message: 'Worker reply recorded successfully.',
      review: updated,
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to record worker reply' });
  }
});

export default router;
