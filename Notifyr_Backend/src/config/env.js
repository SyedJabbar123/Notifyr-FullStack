import "dotenv/config";
import { z } from "zod";

// Fail fast at boot if config is missing/malformed — not three weeks into the pilot.
const envSchema = z.object({
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().default(3306),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_NAME: z.string().min(1),
  DB_CA_PATH: z.string().min(1),

  JWT_SECRET: z.string().min(16, "JWT_SECRET should be a long random string"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  VERIFY_EMAIL_TOKEN_EXP_MIN: z.coerce.number().default(30),
  VERIFY_TOKEN_EXP_MIN: z.coerce.number().default(10),

  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),

  FIREBASE_SERVICE_ACCOUNT_JSON: z.string().min(1),

  PORT: z.coerce.number().default(4000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
  RATE_LIMIT_MAX: z.coerce.number().default(30),
  FINDER_PORTAL_DOMAIN: z.string().url().default("https://notifyr.app"),

  GMAIL_USER: z.string().email(),
  GMAIL_APP_PASSWORD: z.string().min(1),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export default parsed.data;
