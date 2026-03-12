declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    NODE_ENV?: "development" | "production";
    PASSPORT_SECRET: string;
    APP_PASS: string;
    SECRET_KEY: string;
    MONGODB_URI: string;
    DEV_EMAIL: string;
  }
}
