import { z } from 'zod';

const envSchema = z.object({
  // JWT Config
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32),
  ACCESS_TOKEN_EXPIRY: z.string().default('30m'),
  REFRESH_TOKEN_EXPIRY: z.string().default('30d'),

  // Database
  DATABASE_URL: z.url(),
  SHADOW_DATABASE_URL: z.url(),
  // Server
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.string().transform(Number).pipe(z.number().int().positive()).default(5432),
  HOST: z.string().default("127.0.0.1"),
});

// Parse and validate
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  if (process.env.NODE_ENV === 'development') {
    console.error('ENV Validation Error:', parsedEnv.error.issues)
  }
  throw new Error('Invalid environment variables');
}

// Export typed config
export const config = {
  jwt: {
    accessSecret: parsedEnv.data.JWT_ACCESS_SECRET,
    refreshSecret: parsedEnv.data.JWT_REFRESH_SECRET,
    accessExpiry: parsedEnv.data.ACCESS_TOKEN_EXPIRY,
    refreshExpiry: parsedEnv.data.REFRESH_TOKEN_EXPIRY,
  },
  database: {
    url: parsedEnv.data.DATABASE_URL,
    shadowUrl: parsedEnv.data.SHADOW_DATABASE_URL,
  },
  server: {
    nodeEnv: parsedEnv.data.NODE_ENV,
    port: parsedEnv.data.PORT,
    host: parsedEnv.data.HOST,
  },
} //as const;
