import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

// initialize important variables
const app = express();
const port = 3000;
const client = new pg.Client({
  user: "postgres",
  password: "Jalapeno.70",
  host: "localhost",
  port: 5432,
  database: "secrets",
});
client.connect();

// initialize middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// initialzie route-handlers/additional middleware
app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  try {
    const result = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      await client.query(
        "INSERT INTO users (email, password) VALUES ($1, $2)",
        [email, password]
      );
      res.render("index.ejs");
    } else {
      console.log("Email is already registered");
      res.render("register.ejs");
    }
  } catch (err) {
    console.error("Error executing the query \n", err.stack);
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  try {
    const result = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      if (result.rows[0].password === password) {
        res.render("secrets.ejs");
      } else {
        console.log("Incorrect password");
        res.render("login.ejs");
      }
    } else {
      console.log("Email is not registered");
      res.render("login.ejs");
    }
  } catch (err) {
    console.error("Error executing the query \n", err.stack);
  }
});

// start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
