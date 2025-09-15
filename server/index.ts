import 'dotenv/config'
import express, {Response, Request, Express} from 'express'
import {MongoClient} from 'mongodb'
import {callAgent} from './agent'
import cors from 'cors'

const app: Express = express()

app.use(cors())
app.use(express.json())

const client = new MongoClient(process.env.MONGODB_ATLAS_URI as string)

function getEmojiForCategory(category: string): string {
  const emojiMap: { [key: string]: string } = {
    'Sofa': '🛋️',
    'Living Room': '🛋️',
    'Dining Table': '🍽️',
    'Dining Room': '🍽️',
    'Bed Frame': '🛏️',
    'Bedroom': '🛏️',
    'TV Stand': '📺',
    'Electronics': '📺',
    'Coffee Table': '☕',
    'Kitchen': '🔪',
    'Kitchen Tools': '🔪',
    'Appliances': '☕',
    'Dining': '🍽️',
    'Office': '💼',
    'Gaming': '🎮',
    'Audio': '🔊',
    'Smart Home': '🏠',
    'Clothing': '👕',
    'Outerwear': '🧥',
    'Footwear': '👟',
    'Formal': '👔',
    'Women\'s': '👗',
    'Beauty': '✨',
    'Skincare': '✨',
    'Makeup': '💄',
    'Hair Care': '💨',
    'Fragrance': '🌸',
    'Sports': '🏃',
    'Fitness': '🧘',
    'Athletic': '🏃',
    'Strength': '🏋️',
    'Team Sports': '🏀',
    'General': '📦'
  }
  return emojiMap[category] || '📦'
}

function mapToNavigationCategory(dbCategory: string): string {
  const categoryMap: { [key: string]: string } = {
    'Sofa': 'Home',
    'Living Room': 'Home',
    'Dining Table': 'Home',
    'Dining Room': 'Home',
    'Bed Frame': 'Home',
    'Bedroom': 'Home',
    'TV Stand': 'Home',
    'Coffee Table': 'Home',
    'Electronics': 'Electronics',
    'Gaming': 'Electronics',
    'Audio': 'Electronics',
    'Smart Home': 'Electronics',
    'Office': 'Electronics',
    'Clothing': 'Clothing',
    'Outerwear': 'Clothing',
    'Footwear': 'Clothing',
    'Formal': 'Clothing',
    'Women\'s': 'Clothing',
    'Kitchen': 'Home & Kitchen',
    'Kitchen Tools': 'Home & Kitchen',
    'Appliances': 'Home & Kitchen',
    'Dining': 'Home & Kitchen',
    'Beauty': 'Beauty',
    'Skincare': 'Beauty',
    'Makeup': 'Beauty',
    'Hair Care': 'Beauty',
    'Fragrance': 'Beauty',
    'Sports': 'Sports',
    'Fitness': 'Sports',
    'Athletic': 'Sports',
    'Strength': 'Sports',
    'Team Sports': 'Sports',
    'General': 'Home'
  }
  return categoryMap[dbCategory] || 'Home'
}

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

    app.post('/chat/:threadId', async (req: Request, res: Response) => {
      const { threadId } = req.params
      const { message } = req.body
      try {
        const response = await callAgent(client, message, threadId)
        res.json({response})
      } catch (error) {
        console.error('Error in chat', error)
        res.status(500).json({error: 'Internal server error'})
      }
    })

    app.get('/products', async (req: Request, res: Response) => {
      try {
        const db = client.db("inventory_database")
        const collection = db.collection("items")
        
        const items = await collection.find({}).toArray()
        
        const categorizedProducts: { [key: string]: any[] } = {
          Home: [],
          Electronics: [],
          Clothing: [],
          "Home & Kitchen": [],
          Beauty: [],
          Sports: [],
          Deals: []
        }

        items.forEach((item, index) => {
          const product = {
            id: item.item_id || `item_${index}`,
            name: item.item_name || "Unknown Product",
            description: item.item_description || "No description available",
            price: item.prices?.sale_price || 0,
            originalPrice: item.prices?.full_price || 0,
            emoji: getEmojiForCategory(item.categories?.[0] || "General"),
            category: item.categories?.[0] || "General"
          }

          const category = mapToNavigationCategory(item.categories?.[0] || "General")
          if (categorizedProducts[category]) {
            categorizedProducts[category].push(product)
          } else {
            categorizedProducts.Home.push(product)
          }
        })

        res.json(categorizedProducts)
      } catch (error) {
        console.error('Error fetching products:', error)
        res.status(500).json({error: 'Internal server error'})
      }
    })

    const PORT = process.env.PORT || 8000
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })

  } catch (error) {
    console.error('Error connecting to MongoDB: ', error)
    process.exit(1)
  }
}

startServer()