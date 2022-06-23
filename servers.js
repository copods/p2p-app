const cors = require("cors")
const express = require("express")
const http = require("http")
const app = express()
app.use(cors())
const server = http.createServer(app)
const io = require("socket.io")(server, {
	cors: {
		origin: "*",
	},
	handlePreflightRequest: (req, res) => {
		res.writeHead(200,{
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST",
			"Access-Control-Allow-Headers": "*",
		});
		res.end();
	}
})

io.on("connection", (socket) => {
	socket.emit("me", socket.id)

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	})

	socket.on("callUser", (data) => {
		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
	})

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	})
})

server.listen(5001, () => console.log("server is running on port 5001"))
