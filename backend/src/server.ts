import express from 'express'

const app = express();
const port = "127.0.0.1:3000";

app.get('/', (_req, res) => res.send('hello world!'))
app.listen(port, () => { console.log(`Server is running on ${port}`) })
