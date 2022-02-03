const { app, BrowserWindow } = require("electron");

const express = require("express");
const server = express();
const port = 3000;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
  });

  win.loadFile("index.html");
}

app.whenReady().then(() => {
  startServer();
  createWindow();
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

const startServer = () => {
  server.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  });
  server.get("/isdeleted", (req, res) => {
    const Nightmare = require("nightmare");
    const nightmare = Nightmare({
      show: false,
      electronPath: require("./node_modules/nightmare/node_modules/electron"),
    });
    const url = req.query.url;
    console.log(url);
    // res.send(url);

    nightmare
      .goto(url)
      .wait("#BodyContenCon h1")
      .evaluate(() => document.querySelector("#BodyContenCon h1").textContent)
      .end()
      .then((resp) => {
        console.log(resp === "Oups!");
        res.send(resp === "Oups!");
      })
      .catch((error) => {
        res.send(error);
        console.error("Search failed:", error);
      });
  });

  server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};
