/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly DEV_API_URL: string;
  VITE_SITE_KEY: string; // must always start with VITE
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}