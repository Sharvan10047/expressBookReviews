const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ username: "user12", password: "user12" }];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  const checkUser = users.filter((l) => l.username === username);
  return checkUser.length > 0;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  const checkUser = users.filter(
    (l) => l.username === username && l.password === password
  );
  return checkUser.length > 0;
};

regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    console.log(isValid(username));
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = { accessToken, username };
    return res
      .status(200)
      .send({
        message: `User successfully logged in and token is`,
        accessToken,
      });
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const user = req.user;
  console.log(user);
  const { isbn } = req.params;
  const { comment } = req.body;
  const getBook = books[isbn];
  console.log(getBook);
  if (getBook) {
    const isExist = Object.keys(getBook.reviews).filter(
      (l) => getBook.reviews[l].username === user.data
    );
    console.log(
      isExist,
      Object.keys(getBook.reviews).length,
      typeof getBook.reviews
    );
    if (isExist && isExist.length > 0) {
      Object.keys(getBook.reviews).map((l) => {
        if (getBook.reviews[l].username === user.data) {
          getBook.reviews[l] = { username: user.data, comment: comment };
        }
      });
    } else {
      const k =
        Object.keys(getBook.reviews).length === 0
          ? 0
          : Object.keys(getBook.reviews).length + 1;
      getBook.reviews[k] = { username: user.data, comment: comment };
      console.log(getBook.reviews, k);
    }
    console.log("getBook---", getBook);
    books[isbn] = getBook;
    return res.status(200).json({ message: "Book review added successfully." });
  } else {
    return res.status(208).json({ message: "Book Not Found." });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const user = req.user;
  console.log(user);
  const { isbn } = req.params;
  const getBook = books[isbn];
  console.log(getBook);
  if (getBook) {
    const newList = Object.keys(getBook.reviews).filter(
      (l) => getBook.reviews[l].username !== user.data
    );
    console.log(newList);
    getBook.reviews = { ...newList };
    books[isbn] = getBook;
    return res
      .status(200)
      .json({ message: "Book review deleted successfully." });
  } else {
    return res.status(208).json({ message: "Book Not Found." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
