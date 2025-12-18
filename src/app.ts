import express from 'express'
import sendRoute from './routes/send'

export const app = express()

app.use(express.json())
app.use(sendRoute)