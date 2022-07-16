declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      HOST: string;
      MONGO_URI: string;
      ACCESS_SECRET: string;
      ACCESS_TTL: string;
      REFRESH_SECRET: string;
      REFRESH_TTL: string;
      TOKEN_SECRET: string;
      TOKEN_TTL: string;
      CLOUDINARY_CLOUD_NAME: string;
      CLOUDINARY_API_KEY: string;
      CLOUDINARY_API_SECRET: string;
      STRIPE_SECRET_KEY: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
