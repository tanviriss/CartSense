import {ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai"
import {StructuredOutputParser} from "@langchain/core/output_parsers"
import {MongoClient} from "mongodb"
import {MongoDBAtlasVectorSearch} from "@langchain/mongodb"
import {z} from "zod"
import 'dotenv/config'

const client = new MongoClient(process.env.MONGODB_ATLAS_URI as string)

const llm = new ChatGoogleGenerativeAI({
  model: 'gemini-1.5-flash',
  temperature: 0.7,
  apiKey: process.env.GOOGLE_API_KEY
})