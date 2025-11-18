import express from 'express'
import { config } from '#config'
import 'services'
import { authRouter, gymRouter, wallRouter, colorRouter, gradeRouter } from '#routes';
import cookieParser from 'cookie-parser';
import { requireAuth } from '#middleware/auth.middleware';
import { errorHandler } from '#middleware/error.middleware';

const app = express();
const PORT = config.server.port;
const HOST = config.server.host;

// middleware
app.use(express.json())
app.use(cookieParser())

// home
app.get('/', (_req, res) => res.send('hello world!'))

// routes
app.use('/auth', authRouter)
app.use('/gym', gymRouter)
app.use('/wall', wallRouter)
app.use('/color', colorRouter)
app.use('/grade', gradeRouter)

app.get('/protected', requireAuth, (req, res) => {
  res.json({ success: true, user: req.user })
})

app.use(errorHandler)

app.listen(PORT, HOST, () => {
  console.log(`Server is running on ${HOST}:${PORT}`)
})
