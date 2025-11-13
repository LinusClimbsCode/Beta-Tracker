import express from 'express'
import { config } from '#config'

const app = express();
const PORT = config.server.port;
const HOST = config.server.host;

app.get('/', (_req, res) => res.send('hello world!'))
app.listen(PORT, HOST, () => {
  console.log(`Server is running on ${HOST}:${PORT}`)
})
