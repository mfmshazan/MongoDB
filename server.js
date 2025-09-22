import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Define a model
const quoteSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
    },
  },
  { timestamps: true }
);
const Quote = mongoose.model("Quote", quoteSchema);

// Test API
app.get("/test", (req, res) => {
  res.send("Hello");
});

// Get all quotes
app.get("/api/quotes", async (_req, res) => {
  try {
    const quotes = await Quote.find();
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch" });
  }
});


//Post a new quote
app.post("/api/quotes",  async(req,res) => {

  try{
    const {text} = req.body;

    if(!text || !text.trim()){
      res.status(400).json({error:"There is no quote"});
    }

    const created = await Quote.create({text:text.trim()})

    res.status(400).json(created)
  }

  catch(err){
    res.status(500).json("There is no quote to post")
  }
})

//Put(update) a quote 
app.put("/api/quotes/:id", async (req, res) => {
  
  console.log(req.params);

  const { text } = req.body;
  const { id } = req.params;

  if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(400).json({error: "There is no valid ID"})
  }
  
  if(!text || !text.trim()){
    return res.status(400).json({error: "There is no text"})
  }

  const updated = await Quote.findByIdAndUpdate(id,
    {text: text.trim()},
    {new: true}
  );       

  if(!updated){
    return res.status(404).json({error: "Quote not found"})
  }
  res.json(updated);
})


// Connect to mongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
