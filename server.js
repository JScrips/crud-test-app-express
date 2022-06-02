const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const connectionString =
  "mongodb+srv://TerranceB:Fe10of93isme@cluster0.hszdq.mongodb.net/?retryWrites=true&w=majority";
const app = express();

MongoClient.connect(connectionString, { useUnifiedTopology: true }).then(
  (client) => {
    console.log("connected to db");
    const db = client.db("CRUD-TEST-APP");
    const quoteCollection = db.collection("quotes");

    app.set("view engine", "ejs");
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(express.static("public"));

    app.post("/quotes", (req, res) => {
      quoteCollection
        .insertOne(req.body)
        .then((result) => {
          res.redirect("/");
        })
        .catch((error) => console.error(error));
    });

    app.get("/", (req, res) => {
      const cursor = db
        .collection("quotes")
        .find()
        .toArray()
        .then((results) => {
          res.render("index.ejs", { quotes: results });
        })
        .catch((error) => console.log(error));
      console.log(cursor);
    });

    app.put("/quotes", (req, res) => {
      quoteCollection
        .findOneAndUpdate(
          { name: "Terrance" },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          { upsert: true }
        )
        .then((result) => {
          res.json("Successfully updated");
        })
        .catch((error) => console.log(error));
    });

    app.delete("/quotes", (req, res) => {
      quoteCollection
        .deleteOne({ name: req.body.name })
        .then((result) => {
          if (result.deletedCount === 0) {
            return res.json("No quote to delete");
          }
          res.json("Successfully deleted");
        })
        .catch((error) => console.log(error));
    });

    app.listen(8000, function () {
      console.log("listening on port 8000");
    });
  }
);

/*
NOTES

__dirname is the current directory you're in. Try logging it in and see what it is.



*/
