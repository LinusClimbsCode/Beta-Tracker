import { comparePassword, createUser, findUserByEmail, generateAccessToken, generateRefreshToken } from "#services";
import { config } from "#config";
import ms from "ms";

import type { Request, Response } from 'express'

type TokenEssentials = {
  refreshTokenExpiresAt: Date,
  accessTokenExpiresAt: Date,
  secureCookie: boolean
}

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
    .cookie('access_token', accessToken, {
      expires: accessTokenExpiresAt,
      secure: secureCookie,
      httpOnly: true
    })
    .cookie('refresh_token', refreshToken, {
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
    .cookie('access_token', accessToken, {
      expires: accessTokenExpiresAt,
      secure: secureCookie,
      httpOnly: true
    })
    .cookie('refresh_token', refreshToken, {
      expires: refreshTokenExpiresAt,
      secure: secureCookie,
      httpOnly: true
    })
    .json({
      success: true,
      userId: user.id
    })
}

//   2. POST /login
// 
//   Input: req.body { email, password }Output: { success: true, userId }Cookies: accessToken, refreshToken (httpOnly)
// 
//   Stichworte:
//   - findUserByEmail() aus user.service
//   - comparePassword() aus user.service
//   - Check: User exists? Password correct?
//   - generateAccessToken() und generateRefreshToken()
//   - res.cookie() + res.json()
// 
//   ---
//   3. POST /refresh
// 
//   Input: req.cookies.refreshTokenOutput: { success: true }Cookies: neuer accessToken (httpOnly)
// 
//   Stichworte:
//   - Token aus Cookie holen
//   - Refresh Token in DB finden (Prisma)
//   - Token abgelaufen? Validieren
//   - generateAccessToken() neu generieren
//   - res.cookie() nur für accessToken
// 
//   ---
//   4. POST /logout
// 
//   Input: req.cookies.refreshTokenOutput: { success: true }Cookies: beide löschen
// 
//   Stichworte:
//   - deleteRefreshToken() aus auth.service
//   - res.clearCookie() für beide Tokens
//   - res.json()
// 
//   ---
