declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      HOST: string;
      MONGO_URI: string;
      SALT_WORK_FACTOR: number;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
