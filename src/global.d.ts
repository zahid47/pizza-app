declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      PORT: number;
      HOST: string;
      MONGO_URI: string;
      ACCESS_SECRET: string;
      ACCESS_TTL: string;
      REFRESH_SECRET: string;
      REFRESH_TTL: string;
      TOKEN_SECRET: string;
      TOKEN_TTL: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
