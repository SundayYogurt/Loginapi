const cors = require("cors");
const express = require("express");
const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:8888"],
  })
);

const port = 8000;
const secret = "mysecret";

let conn = null;

// function init connection mysql
const initMySQL = async () => {
  conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "book",
  });
};

app.post("/api/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const userData = {
      email,
      password: passwordHash,
    };
    const [results] = await conn.query("INSERT INTO users  SET ?", userData);
    res.json({
      message: "Insert Success",
      results,
    });
  } catch (error) {
    console.log("error", error);
    res.json({
      message: "Insert Error !!",
      error,
    });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [results] = await conn.query(
      "SELECT * from users where email = ?",
      email
    );
    const userData = results[0];
    const match = await bcrypt.compare(password, userData.password);
    if (!match) {
      res.status(400).json({
        message: "login fail (wrong email or password)",
      });
      return false;
    }
    //Token JWT Token
    const token = jwt.sign({ email, password, role: "admin" }, secret, {
      expiresIn: "15s",
    });
    res.json({ message: "Login Success", token });
    
  } catch (error) {
    console.log("error", error);
    res.json({
      message: "Insert fail !!",
      error,
    });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    let authToken = "";
    if (authHeader) {
      authToken = authHeader.split(" ")[1];
    }
    console.log("authToken", authToken);
    const user = jwt.verify(authToken, secret);
    console.log("user", user.email);

    const [Checkresults] = await conn.query(
      "SELECT * from users where email = ?",
      user.email
    );
    if (!Checkresults[0]) {
      throw { message: "user not found" };
    }

    const [results] = await conn.query("SELECT * from users");
    res.json({
      users: results,
    });
  } catch (error) {
    console.log("error", error);
    if (error.name === "TokenExpiredError") {
      res.status(401).json({
        message: "Token expired. Please log in again.",
      });
    } else {
      res.status(403).json({
        message: "Authentication failed",
        error,
      });
    }
  }
});
// Listen
app.listen(port, async () => {
  await initMySQL();
  console.log("Server started at port 8000");
});
