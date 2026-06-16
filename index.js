// express server create
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express()
const port = process.env.PORT;

// middleware
app.use(cors())
app.use(express.json())

// MongoDB Client
const client = new MongoClient(process.env.MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        // collection create
        const database = client.db("hireloop-database");
        const jobCollection = database.collection("jobs");
        const companyCollection = database.collection("companies");

        // route create 
        // NO: 01 - POST route
        app.post('/api/jobs', async (req, res) => {

            try {
                const jobData = req.body;

                const newJob = {
                    ...jobData,
                    createdAt: new Date()
                }

                const result = await jobCollection.insertOne(newJob)

                res.status(201).send({
                    success: true,
                    message: "Job Created Successfully",
                    insertedId: result.insertedId
                })

            } catch (error) {

                console.log('Post Api error', error);

                res.status(500).send({
                    success: false,
                    message: "Failed to create new job"
                })
            }
        })

        // get route
        app.get('/api/jobs', async (req, res) => {

            const query = {};

            if (req.query.companyId) {
                query.companyId = req.query.companyId;
            }
            if (req.query.status) {
                query.status = req.query.status;
            }

            const cursor = jobCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);

        })

        // company api
        app.post('/api/companies', async (req, res) => {
            try {
                const companyData = req.body

                const newCompany = {
                    ...companyData,
                    createdAt: new Date()
                }

                const result = await companyCollection.insertOne(newCompany)

                res.status(201).send({
                    success: true,
                    message: "Company Created Successfully",
                    insertedId: result.insertedId
                })

            } catch (error) {
                console.error('Company POST api error', error);

                res.status(500).send({
                    success: false,
                    message: "Internal Server Error"
                })
            }
        })

        app.get('/api/my/companies', async (req, res) => {
            try {
                const { recruiterId } = req.query;

                // recruiterId not exist then return
                if (!recruiterId) {
                    return res.status(200).send({
                        success: false,
                        message: "No recruiterId provided",
                        data: null
                    });
                }

                const query = { recruiterId: recruiterId };
                const result = await companyCollection.findOne(query);

                // if company not exist
                if (!result) {
                    return res.status(200).send({
                        success: false,
                        isNewUser: true,
                        data: null
                    });
                }

                // company is exist then json data send
                res.status(200).send(result);

            } catch (error) {
                console.error("Error fetching recruiter company:", error);
                res.status(500).send({
                    success: false,
                    message: "Internal Server Error"
                });
            }
        });




        
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.log('database error:', error)
    }
}
run().catch(console.dir);

// route create 
app.get('/', (req, res) => {
    res.send('HireLoop - Backend Server is runing Good')
})

// server start
app.listen(port, () => {
    console.log(`Server is runing on ${port} Port`);
})