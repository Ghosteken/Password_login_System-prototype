require("dotenv").config();
const express = require("express");
const app = exoress();
const cors = require("cors");

// middlewares
app.use(express.json())
app.use(cors())