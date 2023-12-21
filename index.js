const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

app.use(express.json());
app.use(cors());

// mongoDB configuration

const uri = process.env.MONGO_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const database = client.db("todoHub");
    const tasks = database.collection("tasks");

    // get user wise todo tasks
    app.get("/todoTasks/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const query = {
          user_email: email,
          task_status: "To-do",
        };
        const option = {
          sort: { _id: -1 },
        };
        const result = await tasks.find(query, option).toArray();
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });

    // get user wise ongoing tasks
    app.get("/ongoingTasks/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const query = {
          user_email: email,
          task_status: "Ongoing",
        };
        const option = {
          sort: { _id: -1 },
        };
        const result = await tasks.find(query, option).toArray();
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });
    // get user wise completed tasks
    app.get("/completedTasks/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const query = {
          user_email: email,
          task_status: "Completed",
        };
        const option = {
          sort: { _id: -1 },
        };
        const result = await tasks.find(query, option).toArray();
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });

    // add tasks into database
    app.post("/tasks", async (req, res) => {
      try {
        const task = req.body;
        const result = await tasks.insertOne(task);
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });

    // make todo Task  by drag
    app.patch("/makeTodoTask/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: {
            task_status: "To-do",
          },
        };
        const result = await tasks.updateOne(query, updateDoc);
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });


    // make ongoing Task  by drag
    app.patch("/makeOngoingTask/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: {
            task_status: "Ongoing",
          },
        };
        const result = await tasks.updateOne(query, updateDoc);
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });


    // make complete Task  by drag
    app.patch("/makeCompletedTask/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: {
            task_status: "Ongoing",
          },
        };
        const result = await tasks.updateOne(query, updateDoc);
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to Todo Hub");
});

app.all("*", (req, res, next) => {
  const error = new Error(`The Requested URL is invalid: ${req.url}`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
