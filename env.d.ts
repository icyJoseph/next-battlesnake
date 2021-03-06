declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
      SUPABASE_ROLE_KEY: string;
      STATS_SECRET_KEY: string;
    }
  }
}

export {};
