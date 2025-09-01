import {ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai"
import { StructuredOutputParser } from "langchain/output_parsers"
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

// Separate schemas to reduce complexity
const addressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  postal_code: z.string(),
  country: z.string()
});

const pricesSchema = z.object({
  full_price: z.number(),
  sale_price: z.number(),
});

const reviewSchema = z.object({
  review_date: z.string(),
  rating: z.number(),
  comment: z.string(),
});

const itemSchema = z.object({
  item_id: z.string(),
  item_name: z.string(),
  item_description: z.string(),
  brand: z.string(),
  manufacturer_address: addressSchema,
  prices: pricesSchema,
  categories: z.array(z.string()),
  user_reviews: z.array(reviewSchema),
  notes: z.string()
});

const parser = StructuredOutputParser.fromZodSchema(itemSchema);

