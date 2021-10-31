const express = require('express')
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;
const app = express()

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ed7sj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
        await client.connect()
        const porijanDb = client.db("porijanDb");
        const pakageCollection = porijanDb.collection("pakages");
        const OrderCollection = porijanDb.collection("orders");
        const galleryData = porijanDb.collection("galleryData");

        // Get ALl Fallery Data
        app.get("/gallerydata",async(req,res)=>{
          const result = await galleryData.find({}).toArray();
          res.send(result)
          console.log("All Booking Send Successfully");
        })
        // Add Order
        app.post('/addorder',async(req,res)=>{
          const result = await OrderCollection.insertOne(req.body);
            res.send(result);
            console.log("One Order added Successfully"); 
        }) 
        
        // Insert a myBookings
        app.post('/myBooking',async(req,res)=>{
          const result = await OrderCollection.insertOne(req.body);
            res.send(result);
            console.log("One myBooking added Successfully"); 
        }) 

        // Get My myBookings
        app.get("/myBooking/:email", async (req, res) => {
          const result = await OrderCollection.find({
            email: req.params.email,
          }).toArray();
          res.send(result);
          console.log("My myBookings Send Successfully",result);
        });

        // Delete myBookings
        app.delete("/myBooking/:id", async (req, res) => {
          const result = await OrderCollection.deleteOne({_id:ObjectId(req.params.id)})
          res.send(result);
          console.log("My myBookings Delete Successfully",result);
        });

        // Update Order Status
        app.put("/bookingUpdate/:id",async(req,res)=>{
          const query = {_id:ObjectId(req.params.id)}
          const options = { upsert: true };
          const updateStatus = {
            $set: {
              status: "Approved"
            },
          };
          const result = await OrderCollection.updateOne(query, updateStatus, options);
          res.send(result);
          console.log("Status Update Successfull",result);
          
        })

        // Get All Bookings
        app.get("/allBookings",async(req,res)=>{
          const result = await OrderCollection.find({}).toArray();
          res.send(result)
          console.log("All Booking Send Successfully");
        })
        
        // Add Packeges
        app.post('/pakages',async(req,res)=>{
            const result = await pakageCollection.insertOne(req.body);
            res.send(result);
            console.log("One Pakage added Successfully");
        })

        // Get All Packeges
        app.get('/allpakages',async(req,res)=>{
          const result = await pakageCollection.find({}).toArray();
          res.send(result)
          console.log("All Packages Send Successfully");
        })

        // Get One Package
        app.get('/package/:id',async(req,res)=>{
          const query = {_id:ObjectId(req.params.id)}
          console.log(query);
          const result = await pakageCollection.findOne(query);
            res.send(result);
            console.log("One Package send Successfully",result); 
        }) 

        // get search Pakage
        app.get("/searchPakage", async (req, res) => {
          const result = await pakageCollection.find({
            title: { $regex: req.query.search },
          }).toArray();
          res.send(result);
          console.log("Searched Package send Successfully");
        });


        
    }finally{
        // await client.close()
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Porijan Sarver Site Working Proparly')
})

app.listen(port, () => {
  console.log(`App Listen at http://localhost:${port}`)
})