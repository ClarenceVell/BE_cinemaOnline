const express = require('express')

const router = express.Router()

// ---------------------- MIDDLEWARES ----------------------

const { admin } = require('../middlewares/admin')
const { auth } = require('../middlewares/auth')
const { uploadFile } = require('../middlewares/uploadFile')

// ---------------------- USER ----------------------

// ===== AUTH ======

const { register, login, authUser } = require('../controllers/auth')

router.post("/register", register);
router.post("/login", login);
router.get("/authuser", auth, authUser);

// ===== PROFILE ======

const { getPersons, getPerson, updatePerson, deletePerson } = require('../controllers/person')

router.get("/profile/:id", auth, getPerson)
router.patch("/profile/:id", auth, uploadFile("avatar"), updatePerson)

// ===== FILM ======

const { getFilm, createFilm, updateFilm, deleteFilm} = require('../controllers/film')

router.get("/film/:id", auth, getFilm)

// ===== TRANSACTION ======

const { createTransaction, updateTransaction, deleteTransaction, getTransactions, getTransactionsByUser } = require ('../controllers/transaction')

router.post("/transaction", auth, uploadFile("transferProof"), createTransaction)
router.get("/my-films", auth, getTransactionsByUser)
router.patch("/transaction/:id", auth, updateTransaction)



// ---------------------- ADMIN ----------------------

// ===== CATEGORY ======

const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/category')

router.get("/category", admin, getCategories);
router.post("/category", admin, createCategory);
router.patch("/category/:id", admin, updateCategory);
router.delete("/category/:id", admin, deleteCategory);

// ===== PROFILE ======

router.get("/profile", admin, getPersons)
router.delete("/profile/:id", admin, deletePerson)

// ===== FILM ======

router.post("/film", admin, uploadFile("thumbnail"), createFilm)
router.patch("/film/:id", admin, uploadFile("thumbnail"), updateFilm)
router.delete("/film/:id", admin, deleteFilm)

// ===== TRANSACTION ======

router.get("/transactions", admin, getTransactions)
router.delete("/transaction/:id", admin, deleteTransaction)

module.exports = router