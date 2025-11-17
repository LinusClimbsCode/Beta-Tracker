import { comparePassword, createUser, deleteRefreshToken, findUserByEmail, generateAccessToken, generateRefreshToken } from "#services";
import { config } from "#config";
import ms from "ms";
import { prisma } from "#db";

import type { Request, Response } from 'express'

type TokenEssentials = {
  refreshTokenExpiresAt: Date,
  accessTokenExpiresAt: Date,
  secureCookie: boolean
}

// random variable names for cookies 
const refreshCookie = 'ohe1inw2v'
const accessCookie = '2wce98'

// helper function
const getTokenExpiry = (): TokenEssentials => {
  const refreshTokenExpiresIn = ms(config.jwt.refreshExpiry)
  const refreshTokenExpiresAt = new Date(Date.now() + refreshTokenExpiresIn)
  const accessTokenExpiresIn = ms(config.jwt.accessExpiry)
  const accessTokenExpiresAt = new Date(Date.now() + accessTokenExpiresIn)
  const secureCookie = (config.server.nodeEnv === "development") ? false : true;

  return { refreshTokenExpiresAt, accessTokenExpiresAt, secureCookie }
}

// bussiness logic
export const registerController = async (req: Request, res: Response) => {
  const { email, password, username, name, city } = req.body
  const { refreshTokenExpiresAt, accessTokenExpiresAt, secureCookie } = getTokenExpiry()

  const user = await createUser(email, password, username, name, city)
  const accessToken = generateAccessToken(user.id, user.role, user.emailVerified)
  const refreshToken = await generateRefreshToken(user.id)

  res
    .status(201)
    .cookie(accessCookie, accessToken, {
      expires: accessTokenExpiresAt,
      secure: secureCookie,
      httpOnly: true
    })
    .cookie(refreshCookie, refreshToken, {
      expires: refreshTokenExpiresAt,
      secure: secureCookie,
      httpOnly: true
    })
    .json({
      success: true,
      userId: user.id
    })
}

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body
  const { refreshTokenExpiresAt, accessTokenExpiresAt, secureCookie } = getTokenExpiry()

  const user = await findUserByEmail(email)
  if (!user) {
    res
      .status(401)
      .json({
        success: false,
      })
    return
  }

  const isMatch = await comparePassword(password, user.passwordHash)
  if (!isMatch) {
    res
      .status(401)
      .json({
        success: false,
      })
    return
  }

  const accessToken = generateAccessToken(user.id, user.role, user.emailVerified)
  const refreshToken = await generateRefreshToken(user.id)

  res
    .status(200)
    .cookie(accessCookie, accessToken, {
      expires: accessTokenExpiresAt,
      secure: secureCookie,
      httpOnly: true
    })
    .cookie(refreshCookie, refreshToken, {
      expires: refreshTokenExpiresAt,
      secure: secureCookie,
      httpOnly: true
    })
    .json({
      success: true,
      userId: user.id
    })
}

export const refreshAccessTokenController = async (req: Request, res: Response) => {
  const { accessTokenExpiresAt, secureCookie } = getTokenExpiry()

  const refreshToken = req.cookies[refreshCookie]
  if (!refreshToken) {
    res.status(401)
      .json({
        success: false
      })
    return
  }

  const isMatch = await prisma.refreshToken.findUnique({
    where: {
      token: refreshToken,
      expiresAt: {
        gt: new Date()
      }
    },
    include: {
      user: true
    }
  })
  if (!isMatch) {
    res.status(401)
      .json({
        success: false
      })
    return
  }

  const user = isMatch.user
  const accessToken = generateAccessToken(user.id, user.role, user.emailVerified)

  res
    .status(200)
    .cookie(accessCookie, accessToken, {
      expires: accessTokenExpiresAt,
      secure: secureCookie,
      httpOnly: true
    })
    .json({
      success: true,
    })
}

export const logoutController = async (req: Request, res: Response) => {
  const refreshToken = req.cookies[refreshCookie]

  if (refreshToken) {
    await deleteRefreshToken(refreshToken)
  }

  res.status(200)
    .clearCookie(refreshCookie)
    .clearCookie(accessCookie)
    .json({
      success: true,
    })
}
