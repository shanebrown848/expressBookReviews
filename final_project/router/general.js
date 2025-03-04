const express = require("express");
let books = require("./booksdb.js");
const public_users = express.Router();
const axios = require("axios");

// 📝 Task 1: Get the book list available in the shop
public_users.get("/", function (req, res) {
    return res.status(200).json(books);
});

// 📝 Task 2: Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// 📝 Task 3: Get book details based on author
public_users.get("/author/:author", function (req, res) {
    const author = req.params.author.toLowerCase();
    const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase() === author);

    if (booksByAuthor.length > 0) {
        return res.status(200).json(booksByAuthor);
    } else {
        return res.status(404).json({ message: "No books found by this author" });
    }
});

// 📝 Task 4: Get all books based on title
public_users.get("/title/:title", function (req, res) {
    const title = req.params.title.toLowerCase();
    const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase() === title);

    if (booksByTitle.length > 0) {
        return res.status(200).json(booksByTitle);
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});

// 📝 Task 5: Get book review
public_users.get("/review/:isbn", function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book && book.reviews) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "No reviews found" });
    }
});

// 📝 Task 6: Register a new user
// User database (temporary storage for registered users)
let users = [];

// Route to register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    // Check if the username already exists
    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ message: "Username already exists" });
    }

    // Add the new user to the database
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});

// 📝 Task 10: Get Book List Using Promises (Axios)
public_users.get("/async-books", (req, res) => {
    axios.get("http://localhost:5000/")
        .then(response => res.status(200).json(response.data))
        .catch(error => res.status(500).json({ message: "Error fetching books", error: error.message }));
});

// 📝 Task 10: Get Book List Using Async-Await (Axios)
public_users.get("/await-books", async (req, res) => {
    try {
        const response = await axios.get("http://localhost:5000/");
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

// 📝 Task 11: Get Book by ISBN Using Promises
public_users.get("/async-isbn/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => res.status(200).json(response.data))
        .catch(error => res.status(404).json({ message: "Book not found", error: error.message }));
});

// 📝 Task 11: Get Book by ISBN Using Async-Await
public_users.get("/await-isbn/:isbn", async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: "Book not found", error: error.message });
    }
});

// 📝 Task 12: Get Books by Author Using Promises
public_users.get("/async-author/:author", (req, res) => {
    const author = req.params.author.toLowerCase();
    axios.get(`http://localhost:5000/author/${author}`)
        .then(response => res.status(200).json(response.data))
        .catch(error => res.status(404).json({ message: "No books found by this author", error: error.message }));
});

// 📝 Task 12: Get Books by Author Using Async-Await
public_users.get("/await-author/:author", async (req, res) => {
    try {
        const author = req.params.author.toLowerCase();
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: "No books found by this author", error: error.message });
    }
});

// 📝 Task 13: Get Books by Title Using Promises
public_users.get("/async-title/:title", (req, res) => {
    const title = req.params.title.toLowerCase();
    axios.get(`http://localhost:5000/title/${title}`)
        .then(response => res.status(200).json(response.data))
        .catch(error => res.status(404).json({ message: "No books found with this title", error: error.message }));
});

// 📝 Task 13: Get Books by Title Using Async-Await
public_users.get("/await-title/:title", async (req, res) => {
    try {
        const title = req.params.title.toLowerCase();
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: "No books found with this title", error: error.message });
    }
});




module.exports.general = public_users;
