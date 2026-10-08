import { Router, Request, Response } from 'express';
import { store } from '../data/store.js';

const router = Router();

const LANDMARK_CENTROIDS: Record<string, { lat: number; lng: number; canonical: string; radius_m: number }> = {
  gandhipuram: { lat: 11.0185, lng: 76.9634, canonical: 'Gandhipuram Crosscut Road, Coimbatore', radius_m: 800 },
  peelamedu: { lat: 11.0250, lng: 77.0120, canonical: 'Peelamedu Avinashi Road, Coimbatore', radius_m: 1200 },
  singanallur: { lat: 10.9980, lng: 77.0250, canonical: 'Singanallur Trichy Road, Coimbatore', radius_m: 1000 },
  sulur: { lat: 11.0254, lng: 77.1265, canonical: 'Sulur Rural Hub, Coimbatore District', radius_m: 2500 },
  avinashi: { lat: 11.1920, lng: 77.2690, canonical: 'Avinashi New Bus Stand, Tirupur District', radius_m: 1800 },
  kumarnagar: { lat: 11.1250, lng: 77.3480, canonical: 'Kumar Nagar, Tirupur City', radius_m: 900 },
  palladam: { lat: 10.9980, lng: 77.2950, canonical: 'Palladam High Road, Tirupur District', radius_m: 2200 },
  thudiyalur: { lat: 11.0820, lng: 76.9410, canonical: 'Thudiyalur Mettupalayam Road, Coimbatore', radius_m: 1500 },
};

/**
 * POST /api/location/resolve
 * Resolves approximate location per PPT F15.
 * Strictly enforces DPDP Act 2023 opt-in consent before any cell-tower lookup.
 */
router.post('/resolve', (req: Request, res: Response) => {
  try {
    const { userId, phoneNumber, landmarkText, providerType = 'landmark', consentId } = req.body;

    // 1. Telecom Cell-ID Lookup (Requires Opt-In Consent - PPT F15 & F20)
    if (providerType === 'telecom') {
      let hasActiveConsent = false;
      if (userId) {
        const consents = store.getUserConsents(userId);
        hasActiveConsent = consents.some(
          (c) => c.purpose === 'approximate_location' && c.status === 'granted'
        );
      } else if (consentId) {
        const consent = store.consents.get(consentId);
        hasActiveConsent = consent?.status === 'granted';
      }

      if (!hasActiveConsent) {
        return res.status(403).json({
          error: 'DPDP Privacy Enforcement: Cell-tower location lookup rejected. Valid opt-in consent for purpose \'approximate_location\' is required per DPDP Act 2023.',
        });
      }

      // Return approximate cell-tower sector fix with ~2500m accuracy radius
      return res.json({
        success: true,
        fix: {
          lat: 11.0185,
          lng: 76.9634,
          accuracy_m: 2500,
          source: 'telecom_cell_id',
          sectorId: 'CBE-CELL-402',
          consentVerified: true,
          timestamp: new Date().toISOString(),
        },
      });
    }

    // 2. Landmark Fallback Provider (Works live today - PPT F15)
    const raw = (landmarkText || 'gandhipuram').toLowerCase().trim();
    let match = LANDMARK_CENTROIDS['gandhipuram'];

    for (const [key, value] of Object.entries(LANDMARK_CENTROIDS)) {
      if (raw.includes(key)) {
        match = value;
        break;
      }
    }

    return res.json({
      success: true,
      fix: {
        lat: match.lat,
        lng: match.lng,
        accuracy_m: match.radius_m,
        source: 'landmark_fallback',
        canonicalName: match.canonical,
        spokenConfirmationPrompt: `Is your location near ${match.canonical}? Press 1 to confirm, 2 to change.`,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to resolve location' });
  }
});

export default router;
