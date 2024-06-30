// src/env.d.ts
declare namespace NodeJS {
    interface ProcessEnv {
        DATABASE_URL: string;
        PRIMARY_TOKEN: string;
        SECONDARY_TOKEN: string;
        THIRD_TOKEN: string;
        FOUR_TOKEN: string;
    }
}
  