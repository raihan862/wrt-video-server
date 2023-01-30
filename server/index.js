const express = require("express");
const app = express();
const { createServer } = require("http");
const server = createServer(app);
const cors = require("cors");
const { Server } = require("socket.io");
const fs = require("fs");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Running");
});

io.on("connection", (socket) => {
  socket.on("getid", () => {
    socket.emit("me", socket.id);
  });

  socket.on("videoChunk", (chunk, fileName) => {
    fs.appendFile(
      `${__dirname}/public/videos/${fileName}.webm`,
      chunk,
      (error) => {
        if (error) {
          console.error(error);
        }
      }
    );
  });
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
