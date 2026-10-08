-- Migration 002: Add Aadhaar e-KYC Verification & Masked Storage to Workers
-- Smart India Hackathon 2026 (SIH26089) - Ministry of Cooperation
--
-- Compliance with UIDAI Regulations & DPDP Act 2023:
-- 1. Raw 12-digit Aadhaar numbers are NEVER persisted in plaintext.
-- 2. Only masked Aadhaar (e.g. 'XXXXXXXX9012') and cryptographic UIDAI e-KYC
--    reference tokens are stored.
-- 3. Enables cooperative society admins to verify identity alongside society membership IDs.

ALTER TABLE workers
    ADD COLUMN IF NOT EXISTS aadhaar_kyc_verified BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS aadhaar_masked VARCHAR(20),
    ADD COLUMN IF NOT EXISTS aadhaar_kyc_ref VARCHAR(100),
    ADD COLUMN IF NOT EXISTS aadhaar_verified_name VARCHAR(150),
    ADD COLUMN IF NOT EXISTS aadhaar_kyc_verified_at TIMESTAMP WITH TIME ZONE;

-- Spatial & verification index
CREATE INDEX IF NOT EXISTS idx_workers_aadhaar_kyc ON workers (aadhaar_kyc_verified);

COMMENT ON COLUMN workers.aadhaar_masked IS 'UIDAI compliant masked Aadhaar (XXXXXXXX1234 format). Raw 12 digits strictly discarded.';
COMMENT ON COLUMN workers.aadhaar_kyc_ref IS 'Cryptographic e-KYC transaction identifier issued by UIDAI ASA / DigiLocker gateway.';

-- Rollback instructions:
-- ALTER TABLE workers DROP COLUMN IF EXISTS aadhaar_kyc_verified;
-- ALTER TABLE workers DROP COLUMN IF EXISTS aadhaar_masked;
-- ALTER TABLE workers DROP COLUMN IF EXISTS aadhaar_kyc_ref;
-- ALTER TABLE workers DROP COLUMN IF EXISTS aadhaar_verified_name;
-- ALTER TABLE workers DROP COLUMN IF EXISTS aadhaar_kyc_verified_at;
-- DROP INDEX IF EXISTS idx_workers_aadhaar_kyc;
