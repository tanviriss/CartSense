import {ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai"
import { StructuredOutputParser } from "langchain/output_parsers"
import {MongoClient} from "mongodb"
import {MongoDBAtlasVectorSearch} from "@langchain/mongodb"
import {z} from "zod"
import 'dotenv/config'
import { resolve } from "path"
import { create } from "domain"

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

type Item = z.infer<typeof itemSchema>
const parser = StructuredOutputParser.fromZodSchema(z.array(itemSchema));

async function setupDatabaseAndCollection(): Promise<void> {
  console.log("Setting up database and collection")

  const db = client.db("inventory_database")
  const collections = await db.listCollections({name: "items"}).toArray()

  if(collections.length === 0) {
    await db.createCollection('items')
    console.log("created 'items' collection in 'inventory_database' database")

  } else {
    console.log("'items' collections already exists in the 'inventory_database' database")
  }
}

async function createVectorSearchIndex(): Promise<void> {
  try {
    const db = client.db("inventory_database")
    const collection = db.collection('items')
    await collection.dropIndexes()

    const vectorSearchIdx = {
      name: "vector_index",
      type: "vectorSearch",
      definition: {
        fields: [
          {
            "type": "vector",
            "path": "embedding",
            "numDimensions": 768,
            "similarity": "cosine"
          }
        ]
      }
    }
    console.log("Creating vector search index")
    await collection.createSearchIndex(vectorSearchIdx)
    console.log("successfully created vector search index")
  } catch(error) {
    console.log('Failed to create vector search index:', error)
  }
}

async function generateSyntheticData(): Promise<Item[]> {
  const prompt = `You are a helpful assistant that generates furniture store item data. 
  Generate 10 furniture store items. Each record should include the following 
  fields: item_id, item_name, item_description, brand, manufacturer_address, prices, categories, user_reviews, notes.
  Ensure variety in the data and realistic values.
  
  ${parser.getFormatInstructions()}`

  console.log("Generating synthetic data...")

  const response = await llm.invoke(prompt)
  return parser.parse(response.content as string)
}

async function createItemSummary(item: Item): Promise<string> {
  return new Promise((resolve) => {
    const manufacturerDetails = `Made in ${item.manufacturer_address.country}`
    const categories = item.categories.join(", ")
    const userReviews = item.user_reviews.map((review) => {
      `Rated ${review.rating} on ${review.review_date}: ${review.comment}`
    }).join(" ")

    const basicInfo = `${item.item_name} ${item.item_description} from brand ${item.brand}`
    const price = `At full price it costs: ${item.prices.full_price} USD, 
    On sale it costs: ${item.prices.sale_price} USD`
    const notes = item.notes

    const summary = `${basicInfo}. Manufacturer: ${manufacturerDetails}. 
    Categories: ${categories}. Reviews: ${userReviews}. Price: ${price}. 
    Notes: ${notes}`

    resolve(summary)
  })
}

async function seedDatabase(): Promise<void> {
  try {
    await client.connect
    await client.db('admin').command({ping: 1})
    console.log("successfully connected to MongoDB")

    await setupDatabaseAndCollection()
    await createVectorSearchIndex()

    const db = client.db("inventory_database")
    const collection = db.collection('items')

    await collection.deleteMany({})
    console.log("cleared existing data from items collection")

    const syntheticData = await generateSyntheticData()

    const recordsWithSummaries = await Promise.all(
      syntheticData.map(async (record) => ({
        pageContent: await createItemSummary(record),
        metadata: {...record}
      }))
    )

    for (const record of recordsWithSummaries) {
      await MongoDBAtlasVectorSearch.fromDocuments(
        [record],
        new GoogleGenerativeAIEmbeddings({
          apiKey: process.env.GOOGLE_API_KEY,
          modelName: "text-embedding-004"
        }),
        {
          collection,
          indexName: "vector_index",
          textKey: "embedding_text",
          embeddingKey: "embedding"
        }
      )
      console.log("Successfully processed & saved record:", record.metadata.item_id)
    }
    console.log("Database seeding completed")


  } catch(error) {
    console.error("error seeding the database: ", error)
  } finally {
    await client.close()
  }
}