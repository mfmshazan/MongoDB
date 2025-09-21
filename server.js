import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';    
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());  

//Defiene a modedl

//Test API 
app.get("/test", (req, res) => {
    res.send("Hello");
})

//Connect to mongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch((err) => {
    console.error(`MongoDB connection error: ${err.message}`)
    process.exit(1);
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})