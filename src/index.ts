import express from 'express'
import {resolve} from 'path'
const app = express()

app.use(express.static(resolve(__dirname, '..', 'scripts')))

app.get('/', (req, res) =>
  res.sendFile(resolve(__dirname, '..', 'views', 'index.html'))
)


app.listen(4040, () => console.log('Server started'))