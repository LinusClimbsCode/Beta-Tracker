import express from 'express'
import { config } from '#config'
import 'services'
import { authRouter } from '#routes';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = config.server.port;
const HOST = config.server.host;

// middleware
app.use(express.json())
app.use(cookieParser())

// home
app.get('/', (_req, res) => res.send('hello world!'))

// register
app.use('/auth', authRouter)

app.listen(PORT, HOST, () => {
  console.log(`Server is running on ${HOST}:${PORT}`)
})
