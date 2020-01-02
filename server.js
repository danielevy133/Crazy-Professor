const app = require("./backend/app");
const debug = require("debug")("node-angular");
const http = require("http");

const normalization = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port > 0) {
    return port;
  }

  return false;

};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "pipe" + port : "port" + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe" + port : "port" + port;
  debug("Listening" + bind);
};

const port = normalization(process.env.port || "3000");
app.set("port", port);
const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
const serverListen=server.listen(port,()=>{
console.log("listen on port "+port)
});

const io = require('socket.io').listen(serverListen);
const clients = [];

io.on('connection', client => {

  client.on('userConnection', data => {
    client.userName = data;
    clients.push(client);
  });

  client.on('disconected', () => {
    if (client.userName)
      clients.splice(clients.indexOf(client), 1);
  });
  /*
  client.on('get_massage', data => {
    const c = clients.filter(client => client.userName == data.patient);
    if (c.length > 0)
      c[0].emit('newMassage', { massage: 'your turn', doctor: data.professor, username: data.patient });
  });

  client.on('get_new_wait', data => {
    const c = clients.filter(client => client.userName == data.username);
    if (c.length > 0) {
      console.log(data);
      c[0].emit('newWait', { massage: data.newWait });
    }
  });
  */
  client.on('send_massage', data => {
    const c = clients.filter(client => client.userName == data.username);
    if (c.length > 0)
      c[0].emit('newMassage', { massage: data.massage });
  });

  client.on('get_new_wait', data => {
    client.broadcast.emit('newWait', data);
  });

  client.on('get_massage', data => {
    client.broadcast.emit('getMassage', data);
  });

  client.on('delete_appointment', data => {
    client.broadcast.emit('deleteAppointment', data);
  });});
