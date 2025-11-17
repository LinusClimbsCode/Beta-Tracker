import jwt from 'jsonwebtoken'
import crypto from 'node:crypto'
import { config } from '#config'
import { prisma } from '#db'
import type { Role } from '#db'

type AccessTokenPayload = {
  userId: string
  role: Role
  verified: boolean
}

export const generateAccessToken = (userId: string, role: Role, verified: boolean) => {
  const payload = { userId, role, verified }
  const secret = config.jwt.accessSecret
  const expiresIn = config.jwt.accessExpiry

  const token = jwt.sign(payload, secret, { expiresIn })
  return token
}

export const generateRefreshToken = async (userId: string) => {
  const expiresIn = config.jwt.refreshExpiry
  const expiresAt = new Date(Date.now() + (expiresIn * 86400000)) // 1day = 86400000ms
  const token = crypto.randomBytes(32).toString('hex')

  await prisma.refreshToken.deleteMany({
    where: {
      userId
    },
  })
  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt
    }
  })

  return token
}

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  const secret = config.jwt.accessSecret
  const decoded = jwt.verify(token, secret)

  return decoded as AccessTokenPayload
}

export const deleteRefreshToken = async (token: string) => {
  await prisma.refreshToken.deleteMany({
    where: {
      token
    }
  })
}
