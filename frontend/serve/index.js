const express = require("express");
const proxy = require("http-proxy-middleware");

const app = express();

app.use(express.static("build"));

app.use("/api", proxy({target: "http://backend:3000", changeOrigin: true}));

app.listen(3000);