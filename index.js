const PORT = 8000;

const express = require("express");
const app = express();
const cheerio = require("cheerio");
const axios = require("axios");

const { newspapers } = require("./newspapers");

const articles = [];

newspapers.forEach((newspaper) => {
  axios
    .get(newspaper.address)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      $('a:contains("climate")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        articles.push({ title, url, source: newspaper.base + newspaper.name });
      });
    })
    .catch((error) => {
      console.error(error);
      res.json(error.message);
    });
});

app.get("/", (req, res) => {
  res.json("Welcome");
});

app.get("/news", (req, res) => {
  res.json([...new Set(articles)]);
});

app.get("/news/:newspaperId", async (req, res) => {
  const newspaperId = req.params.newspaperId;
  //  const regex = new RegExp(newspaperIdRaw, "i")
  //   const newspaperId = newspaperIdRaw.replace();

  const newspaper = newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  );
  const newspaperAddress = newspaper[0].address;
  const newspaperBase = newspaper[0].base;

  axios
    .get(newspaperAddress)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      const specifcAddress = [];
      $('a:contains("climate")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        specifcAddress.push({
          title,
          url: newspaperBase + url,
          source: newspaperId,
        });
      });

      res.json(specifcAddress);
    })
    .catch((error) => {
      console.error(error);
      res.json(error.message);
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
