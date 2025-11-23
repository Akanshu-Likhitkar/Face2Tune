require('dotenv').config();
const app = require("./src/app")
const connectdb  = require("./src/db/db.js")

connectdb()


app.listen(3000 , ()=>{
    console.log("On Port 3000")
})