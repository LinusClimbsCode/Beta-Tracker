import { createUser, generateAccessToken, generateRefreshToken } from "#services";
import { config } from "#config";
import ms from "ms";

export const registerController = async (req, res) => {
  const { email, password, username, name, city } = req.body
  const refreshTokenExpiresIn = ms(config.jwt.refreshExpiry)
  const refreshTokenExpiresAt = new Date(Date.now() + refreshTokenExpiresIn)
  const accessTokenExpiresIn = ms(config.jwt.accessExpiry)
  const accessTokenExpiresAt = new Date(Date.now() + accessTokenExpiresIn)
  const secureCookie = (config.server.nodeEnv === "development") ? false : true;

  let user
  let accessToken
  let refreshToken

  user = await createUser(email, password, username, name, city)
  accessToken = generateAccessToken(user.id, user.role, user.emailVerified)
  refreshToken = await generateRefreshToken(user.id)

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

//   1. POST /register
// 
//   Input: req.body { email, password, username, name, city }Output: { success: true, userId }Cookies: accessToken,
//   refreshToken (httpOnly)
// 
//   Stichworte:
//   - createUser() aus user.service
//   - generateAccessToken() aus auth.service
//   - generateRefreshToken() aus auth.service
//   - res.cookie() für beide Tokens
//   - res.status(201).json()
// 
//   ---
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
