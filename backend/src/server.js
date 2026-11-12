require('dotenv').config();

const app = require('./app');
const http = require("http");
const initializeSocket = require("./config/socket");

const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

const server = http.createServer(app);
const io = initializeSocket(server);
app.set("io" ,io);


server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});