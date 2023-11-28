import express from 'express'
import mongoose from 'mongoose'
import route from './routes/route.js'
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

mongoose.connect("mongodb+srv://sana:sana@cluster0.jacirmv.mongodb.net/", {
    
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/',route)

app.listen(3000 || process.env.PORT ,() =>{
    console.log('Express app running on port ' + (process.env.PORT || 3000))
})