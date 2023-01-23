const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const md5 = require('md5');
const { v4: uuidv4 } = require('uuid');
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const dbName = "library";
app.use(express.static("Front_end"));
app.use(express.json());


async function run() {
  await client.connect();
  try {
    const db = client.db(dbName);
    const booksCollection = db.collection("books");
    const usersCollection = db.collection("users");
    // ------------------------------ Books Routes ------------------------------ //
    // SHOW ALL BOOKS ROUTE
    app.get("/books", async (req, res) => {
      try {
        let responseBody = {
          success: true,
          error: "",
          data: null,
        };
        responseBody.data = await booksCollection.find({}).toArray();
        res.send(responseBody);
      } catch (e) {
        console.log(e);
      }
    });
    // SHOW BOOK ROUTE
    app.get("/books/:id", async (req, res) => {
      try {
        let responseBody = {
          success: true,
          error: "",
          data: null,
        };
        responseBody.data = await booksCollection.findOne({ _id: ObjectId(req.params.id) })
        if (responseBody.data == null) {
          responseBody.success = false;
          responseBody.error = "BOOK ISN'T FOUND ,TRY AGAIN!!";
        }
        res.send(responseBody);
      } catch (e) {
        console.log(e);
      }
    });
    // ADD NEW BOOK ROUTE
    app.post("/books", async (req, res) => {
      try {
        let responseBody = {
          success: true,
          error: "",
          data: null,
        };
        if (req.headers.sessionid != 'undefined') {
          let user = await usersCollection.findOne({ sessionId: req.headers.sessionid })
          if (user) {
            let validatedData = await validateData(req.body, responseBody);
            if (
              (await booksCollection.findOne({ title: req.body.title })) !== null
            ) {
              responseBody.success = false;
              responseBody.error = "Book's Title is already exists";
              responseBody.data = null;
            }
            if (validatedData) {
              await booksCollection.insertOne(req.body);
              responseBody.data = await booksCollection.findOne({
                _id: ObjectId(req.body._id),
              });
            }
          } else {
            responseBody.success = false;
            responseBody.error = "Please makesure you logged in first or signedup!!!";
            responseBody.data = null;
          }
        } else {
          responseBody.success = false;
          responseBody.error = "Unauthorized to add a book!!";
          responseBody.data = null;
        }
        res.send(responseBody);
      } catch (e) {
        console.log(e);
      }
    });
    // UPDATE BOOK ROUTE
    app.put("/books/:id", async (req, res) => {
      try {
        let responseBody = {
          success: true,
          error: "",
          data: null,
        };
        if (req.headers.sessionid != 'undefined') {
          let user = await usersCollection.findOne({ sessionId: req.headers.sessionid });
          if (user) {
            let book = await booksCollection.findOne({
              _id: ObjectId(req.params.id),
            });
            let body = req.body;
            if (book === null) {
              responseBody.success = false;
              responseBody.error = "BOOK ISN'T FOUND ,TRY AGAIN!!";
              responseBody.data = null;
            } else {
              let validatedData = await validateData(body, responseBody);
              if (validatedData) {
                await booksCollection.updateOne(
                  { _id: ObjectId(req.params.id) },
                  {
                    $set: {
                      title: body.title,
                      thumbnailUrl: body.thumbnailUrl,
                      shortDescription: body.shortDescription,
                      categories: body.categories,
                      authors: body.authors,
                    },
                  }
                );
                book = await booksCollection.findOne({
                  _id: ObjectId(req.params.id),
                });
                responseBody.data = book;
              }
            }
          } else {
            responseBody.success = false;
            responseBody.error = "Please makesure you logged in first or signedup!!!";
            responseBody.data = null;
          }
        } else {
          responseBody.success = false;
          responseBody.error = "Unauthorized to edit a book!!";
          responseBody.data = null;
        }
        res.send(responseBody);
      } catch (e) {
        console.log(e);
      }
    });

    //   DELETE BOOK ROUTE
    app.delete("/books/:id", async (req, res) => {
      try {
        let responseBody = {
          success: true,
          error: "",
          data: null,
        };
        let book = await booksCollection.findOne({
          _id: ObjectId(req.params.id),
        });
        if (book === null) {
          responseBody.success = false;
          responseBody.error = "BOOK ISN'T FOUND ,TRY AGAIN!!";
        } else {
          await booksCollection.deleteOne({
            _id: ObjectId(req.params.id),
          });
        }
        res.send(responseBody);
      } catch (e) {
        console.log(e);
      }

    });

    // Validation Function
    async function validateData(request, responseBody) {
      if (!request.title || request.title.length <= 2) {
        responseBody.success = false;
        responseBody.error =
          "Book's Title should be added and it's length should be equal or bigger than 3 characters";
        responseBody.data = null;
        return false;
      } else if (!request.authors || request.authors.length <= 2) {
        responseBody.success = false;
        responseBody.error =
          "Book's Author should be added and it's length should be equal or bigger than 3 characters";
        responseBody.data = null;
        return false;
      } else {
        return true;
      }
    }

    // ------------------------------ users Routes ------------------------------ //
    // SHOW ALL USER ROUTE
    app.get("/users", async (req, res) => {
      try {
        let responseBody = {
          success: true,
          error: "",
          data: null,
        };
        responseBody.data = await usersCollection.find({}).toArray();
        res.send(responseBody);
      } catch (e) {
        console.log(e);
      }
    });
    // SHOW USER ROUTE
    app.get("/users/:id", async (req, res) => {
      try {
        let responseBody = {
          success: true,
          error: "",
          data: null,
        };
        responseBody.data = await usersCollection.findOne({ _id: ObjectId(req.params.id) })
        if (responseBody.data == null) {
          responseBody.success = false;
          responseBody.error = "USER ISN'T FOUND ,TRY AGAIN!!";
        }
        res.send(responseBody);
      } catch (e) {
        console.log(e);
      }
    });
    // ADD NEW USER ROUTE
    app.post("/users", async (req, res) => {
      try {
        let responseBody = {
          success: true,
          error: "",
          data: null,
        };
        let validatedData = await validateUserData(req.body, responseBody);
        let foundUser = await usersCollection.findOne({ username: req.body.username });
        if (
          foundUser != null && foundUser.username === req.body.username
        ) {
          responseBody.success = false;
          responseBody.error = "Username is already exists";
          responseBody.data = null;
        } else {
          if (validatedData) {
            req.body.password = md5(req.body.password);
            await usersCollection.insertOne(req.body);
            let sessionId = uuidv4();
            await usersCollection.updateOne({ _id: ObjectId(req.body._id) }, { $set: { sessionId: sessionId } });
            responseBody.data = { sessionId };
            responseBody.data = await usersCollection.findOne({
              _id: ObjectId(req.body._id),
            });
          }
        }
        res.send(responseBody);
      } catch (e) {
        console.log(e);
      }
    });
    // UPDATE USER ROUTE
    app.put("/users/:id", async (req, res) => {
      try {
        let responseBody = {
          success: true,
          error: "",
          data: null,
        };
        let user = await usersCollection.findOne({
          _id: ObjectId(req.params.id),
        });
        let foundUser = await usersCollection.findOne({ username: req.body.username });
        let body = req.body;
        let params = req.params;
        let validatedUserData = await validateUserData(body, responseBody);
        if (
          foundUser != null && foundUser._id.equals(params.id) === false && foundUser.username === req.body.username
        ) {
          responseBody.success = false;
          responseBody.error = "Username is already exists";
          responseBody.data = null;
        }
        else if (user === null) {
          responseBody.success = false;
          responseBody.error = "USER ISN'T FOUND ,TRY AGAIN!!";
          responseBody.data = null;
        } else {
          if (validatedUserData) {
            await usersCollection.updateOne(
              { _id: ObjectId(req.params.id) },
              {
                $set: {
                  username: body.username,
                  password: body.password,
                },
              }
            );
            user = await usersCollection.findOne({
              _id: ObjectId(req.params.id),
            });
            responseBody.data = user;
          } else {
            responseBody.data = null;
          }
        }
        res.send(responseBody);
      } catch (e) {
        console.log(e);
      }
    });

    //   DELETE USER ROUTE
    app.delete("/users/:id", async (req, res) => {
      try {
        let responseBody = {
          success: true,
          error: "",
          data: null,
        };
        let user = await usersCollection.findOne({
          _id: ObjectId(req.params.id),
        });
        if (user === null) {
          responseBody.success = false;
          responseBody.error = "USER ISN'T FOUND ,TRY AGAIN!!";
        } else {
          await usersCollection.deleteOne({
            _id: ObjectId(req.params.id),
          });
        }
        res.send(responseBody);
      } catch (e) {
        console.log(e);
      }

    });

    //   LOGIN USER ROUTE
    app.post("/users/login", async (req, res) => {
      try {
        let responseBody = {
          success: true,
          error: "",
          data: null,
        };
        let user = await usersCollection.findOne({
          username: req.body.username, password: md5(req.body.password)
        });
        if (!user) {
          responseBody.success = false;
          responseBody.error = "USERNAME OR PASSWORD MAY BE WRONG ,TRY AGAIN!!";
        } else {
          let sessionId = uuidv4();
          await usersCollection.updateOne({ _id: ObjectId(user._id) }, { $set: { sessionId: sessionId } });
          responseBody.data = { sessionId };
        }
        res.send(responseBody);
      } catch (e) {
        console.log(e);
      }

    });

    // Validation USER Function
    async function validateUserData(request, responseBody) {
      if (!request.username || request.username.length <= 2) {
        responseBody.success = false;
        responseBody.error =
          "Username should be added and it's length should be equal or bigger than 3 characters";
        responseBody.data = null;
        return false;
      } else if (!request.password || request.password.length < 8) {
        responseBody.success = false;
        responseBody.error =
          "Password should be added and it's length should be equal or bigger than 8 characters";
        responseBody.data = null;
        return false;
      } else {
        return true;
      }
    }
  }
  catch {
    console.log("err");
  }
}
app.listen("8080", () => {
  console.log("hello");
});

run().catch(console.dir);
