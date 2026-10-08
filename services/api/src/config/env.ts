import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '4000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'tasklink_super_secret_jwt_key_sih2026_mumbai',

  DEFAULT_FEDERATION_ID: process.env.DEFAULT_FEDERATION_ID || 'f1111111-1111-1111-1111-111111111101',
  DEFAULT_DISTRICT: process.env.DEFAULT_DISTRICT || 'Coimbatore',

  // Bhashini (Govt. of India)
  BHASHINI_USER_ID: process.env.BHASHINI_USER_ID || '',
  BHASHINI_API_KEY: process.env.BHASHINI_API_KEY || '',
  BHASHINI_PIPELINE_ID: process.env.BHASHINI_PIPELINE_ID || '',

  // Exotel Telephony
  EXOTEL_ACCOUNT_SID: process.env.EXOTEL_ACCOUNT_SID || '',
  EXOTEL_API_KEY: process.env.EXOTEL_API_KEY || '',
  EXOTEL_API_TOKEN: process.env.EXOTEL_API_TOKEN || '',
  EXOTEL_CALLER_ID: process.env.EXOTEL_CALLER_ID || '',

  // Payments
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',
  CASHFREE_APP_ID: process.env.CASHFREE_APP_ID || '',
  CASHFREE_SECRET_KEY: process.env.CASHFREE_SECRET_KEY || '',

  // Maps
  MAPPLS_CLIENT_ID: process.env.MAPPLS_CLIENT_ID || '',
  MAPPLS_CLIENT_SECRET: process.env.MAPPLS_CLIENT_SECRET || '',

  // AWS
  AWS_REGION: process.env.AWS_REGION || 'ap-south-1',
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME || 'tasklink-portfolios-ap-south-1',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
};
