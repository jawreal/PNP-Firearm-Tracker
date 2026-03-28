declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    NODE_ENV?: "development" | "production";
    PASSPORT_SECRET: string;
    BREVO_API_KEY: string;
    SECRET_KEY: string;
    SMTP_LOGIN: string; 
    DEV_EMAIL: string;
    MONGODB_URI: string;
    BASE_URL: string;
  }
}
