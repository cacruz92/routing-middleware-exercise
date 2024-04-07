const express = require("express");
const app  = express();
const ExpressError = require("./epressError");
const listRoutes = require(".routes/list")

app.use(express.json());
app.use("/list", listRoutes)

app.use(function (req, res, next) {
    return new ExpressError("Not Found", 404);
  });

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    return res.json({
        error: err.message
    });
});

module.exports = app;