import { z } from 'zod';
import type { StringValue } from 'ms'


const envSchema = z.object({
  // JWT Config
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32),
  ACCESS_TOKEN_EXPIRY: z.string().default('30m'),
  REFRESH_TOKEN_EXPIRY: z.string().transform(Number).pipe(z.number().int().positive()).default(30),
  // Crypto
  CRYPTO_HASH_ROUNDS: z.string().transform(Number).pipe(z.number().int().positive()).default(11),

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

// type extraction
type ParsedEnv = z.infer<typeof envSchema>

type Config = {
  jwt: {
    accessSecret: ParsedEnv['JWT_ACCESS_SECRET'],
    refreshSecret: ParsedEnv['JWT_REFRESH_SECRET'],
    accessExpiry: StringValue,
    refreshExpiry: ParsedEnv['REFRESH_TOKEN_EXPIRY'],
  },
  crypto: {
    cryptoHashSalt: ParsedEnv['CRYPTO_HASH_ROUNDS'],
  },
  database: {
    url: ParsedEnv['DATABASE_URL'],
    shadowUrl: ParsedEnv['SHADOW_DATABASE_URL'],
  },
  server: {
    nodeEnv: ParsedEnv['NODE_ENV'],
    port: ParsedEnv['PORT'],
    host: ParsedEnv['HOST'],
  },
}

// Export typed config
export const config: Config = {
  jwt: {
    accessSecret: parsedEnv.data.JWT_ACCESS_SECRET,
    refreshSecret: parsedEnv.data.JWT_REFRESH_SECRET,
    accessExpiry: parsedEnv.data.ACCESS_TOKEN_EXPIRY as StringValue,
    refreshExpiry: parsedEnv.data.REFRESH_TOKEN_EXPIRY,
  },
  crypto: {
    cryptoHashSalt: parsedEnv.data.CRYPTO_HASH_ROUNDS,
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
}
