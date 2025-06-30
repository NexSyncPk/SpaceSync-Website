const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// const routes = require("./router/routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    cors({
        origin: ["http://localhost:5173"],
        credentials: true,
    })
);

app.use(morgan("dev"));

// app.use("/api", routes);

app.use(errorMiddleware);

module.exports = app;