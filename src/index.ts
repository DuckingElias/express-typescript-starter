import express from "express";
import * as http from "http";
import * as https from "https";
import * as fs from "fs";

const credentials = {
    key: fs.readFileSync("cert.key", "utf-8"),
    cert: fs.readFileSync("cert.crt", "utf-8")
}

const app: express.Express = express();
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

app.use((request, response, next) => {
    if(!request.secure) {
        return response.redirect(['https://', request.get('Host'), request.url].join(''));
    }
    next();
});

app.use("/assets", express.static("html/assets"));

app.get("/", (req, res) => {
    getPage("index.html", (content: any) => {
        res.send(content)
    });
});

app.get("*", (req, res) => {
    getPage("404.html", (content: any) => {
        res.send(content)
    });
});

const getPage = (name: string, callback: any) => {
    fs.readFile(__dirname + "/../html/" + name, (err, data) => {
        callback(data.toString())
    })
}

httpServer.listen(80, () => {
    console.info("HTTP SERVER STARTED");
});
httpsServer.listen(443, () => {
    console.info("HTTPS SERVER STARTED");
});
