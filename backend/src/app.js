const express = require("express")
const cors = require("cors")
const songRoutes = require("./routes/song.routes") 

const app = express()

// Enable CORS
app.use(cors({
  origin: "http://localhost:5173",  
  credentials: true
}))

app.use(express.json()) 

// Routes
app.use("/", songRoutes)

module.exports = app




