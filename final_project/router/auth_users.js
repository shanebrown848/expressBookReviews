const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs");
let books = require("./booksdb.js");
const regd_users = express.Router();

const USERS_FILE = "./users.json";  // JSON file to store users

// Function to load users from JSON file
const loadUsers = () => {
    try {
        return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
    } catch (err) {
        return [];
    }
};

// Function to save users to JSON file
const saveUsers = (users) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// 📝 Task 6: Register a New User
regd_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    let users = loadUsers(); // Load users from JSON file

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    if (users.some(user => user.username === username)) {
        return res.status(400).json({ message: "Username already exists" });
    }

    users.push({ username, password });
    saveUsers(users); // Save the updated user list

    return res.status(201).json({ message: "User registered successfully" });
});

// 📝 Task 7: User Login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    let users = loadUsers(); // Load users from JSON file

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    if (!users.some(user => user.username === username && user.password === password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ username }, "secretKey", { expiresIn: "1h" });

    return res.status(200).json({ message: "Login successful", token });
});


// Middleware to verify JWT authentication
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(403).json({ message: "Access Denied. No token provided." });
    }

    jwt.verify(token.split(" ")[1], "secretKey", (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.user = decoded.username;
        next();
    });
};

// 📝 Task 8: Add or Modify a Book Review
regd_users.put("/auth/review/:isbn", verifyToken, (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const username = req.user; // Retrieved from JWT token

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Ensure reviews exist
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Add or modify review
    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review added/updated successfully",
        reviews: books[isbn].reviews,
    });
});

// 📝 Task 9: Delete a Book Review
regd_users.delete("/auth/review/:isbn", verifyToken, (req, res) => {
  const { isbn } = req.params;
  const username = req.user; // Retrieved from JWT token

  // Check if the book exists
  if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
  }

  // Ensure the book has reviews
  if (!books[isbn].reviews || !books[isbn].reviews[username]) {
      return res.status(404).json({ message: "No review found for this user" });
  }

  // Delete the user's review
  delete books[isbn].reviews[username];

  return res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
});



module.exports.authenticated = regd_users;
