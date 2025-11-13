import * as jwt from 'jsonwebtoken'
import crypto from 'node:crypto'
import { config } from '#config'
import { prisma } from '#db'
import type { Role } from '#db'


console.log('Config JWT:', config.jwt)
console.log('accessExpiry value:', JSON.stringify(config.jwt.accessExpiry))
console.log('accessExpiry type:', typeof config.jwt.accessExpiry)

export const generateAccessToken = (userId: string, role: Role, verified: boolean) => {
  const payload = { userId, role, verified }
  const secret = config.jwt.accessSecret
  const expiresIn = config.jwt.accessExpiry as string
  //const expiresIn = '30m'

  if (!secret) {
    throw new Error('No jwt secret available')
  }

  const token = jwt.sign(payload, secret, { expiresIn: expiresIn })
  return token
}





//  auth.service.ts - 4 Functions
//
//  1. generateAccessToken
//
//  Input: userId, role, emailVerifiedOutput: JWT stringStichworte:
//  - jwt.sign()
//  - config.jwt.accessSecret
//  - config.jwt.accessExpiry
//  - payload object
//
//  ---
//  2. generateRefreshToken
//
//  Input: userIdOutput: Token stringStichworte:
//  - crypto.randomBytes(32).toString('hex')
//  - Date berechnen (jetzt + 30 Tage in ms)
//  - prisma.refreshToken.deleteMany() (alte tokens löschen)
//  - prisma.refreshToken.create()
//  - return token string
//
//  ---
//  3. verifyAccessToken
//
//  Input: token stringOutput: decoded payload { userId, role, emailVerified }Stichworte:
//  - jwt.verify()
//  - config.jwt.accessSecret
//  - return payload (wirft automatisch Error wenn invalid)
//
//  ---
//  4. deleteRefreshToken
//
//  Input: token stringOutput: void (nichts)Stichworte:
//  - prisma.refreshToken.delete()
//  - where: { token }
