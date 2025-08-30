import 'dotenv/config'
import express, {Response, Request, Express} from 'express'
import {MongoClient} from 'mongodb'
import {callAgent} from './agent'
import cors from 'cors'
import { threadCpuUsage } from 'process'

const app: Express = express()

app.use(cors())
app.use(express.json())

const client = new MongoClient(process.env.MONGODB_ATLAS_URI as string)

async function startServer() {
  try {
    await client.connect()
    await client.db("admin").command({ping: 1})
    console.log("Connected to MongoDB")

    app.get('/', (req: Request, res: Response) => {
      res.send("LangGraph Agent Server")
    })

    app.post('/chat', async (req: Request, res: Response) => {
      const initialMessage = req.body.message
      const threadId = Date.now().toString()
      console.log(initialMessage)

      try {
        const response = await callAgent(client, initialMessage, threadId)
        res.json({threadId, response})
      } catch (error) {
        console.error('Error starting conversation: ', error)
        res.status(500).json({error: 'Internal server error'})
      }
    })

  } catch (error) {
    console.error(error)
  }
}