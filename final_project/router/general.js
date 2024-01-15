const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({
    message: "All books are Headers.",
    books: JSON.stringify({ message: "Get all book list", books }),
  });
});

// Get the book list available in the shop
public_users.get("/", async (req, res) => {
  //Write your code here
  const list = await books
  return res.status(300).json({ message: "Get all book list", list });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
  //Write your code here
  const { isbn } = req.params;
  const list = await new Promise ((resolve, reject) => {
    const getBook = books[isbn]
    if (getBook) {
      resolve(getBook)
    } else{
      reject()
    }
  })
  return res.status(300).json(list);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const { author } = req.params;
  const getBook = Object.keys(books).filter((l) => books[l].author === author);

  return res.status(300).json(books[getBook]);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const { title } = req.params;
  const getBook = Object.keys(books).filter((l) => books[l].title === title);
  return res.status(300).json(books[getBook]);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const { isbn } = req.params;
  return res.status(300).json(books[isbn].reviews);
});

module.exports.general = public_users;
