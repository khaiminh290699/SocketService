const server = require("http").createServer();
const { Server } = require("socket.io");
const { authorize } = require("./src/utilities.js");

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
    credentials: true,
  }
});

const users = io.of("users").use(authorize);

users.on("connection", async (socket) => {
  socket.on("get_community", (data, callback) => {
    console.log(data)
    const { responseKey, communities, selectedForums } = data;
    users.emit(`get_community_${responseKey}`, { communities, selectedForums });
    if (callback) {
      callback();
    }
  })

  socket.on("progressing", (data, callback) => {
    const { id, type } = data;
    console.log(data)
    if (type === "posting") {
      users.emit(`progressing_${id}`, data);
      if (callback) {
        callback();
      }
    }
  })

  socket.on("timer_posting", (data, callback) => {
    console.log(data);
    const { keyDate } = data
    users.emit(`timer_posting_${keyDate}`, data);
    if (callback) {
      callback();
    }
  })
})

server.listen(process.env.SOCKET_PORT || 3002);