const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const server = app.listen(port);
console.log(`Running server on ${port}`);

app.use(express.static(__dirname + "/public"));
