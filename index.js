const PORT = 8000;

const express = require("express");
const app = express();
const cheerio = require("cheerio");

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
