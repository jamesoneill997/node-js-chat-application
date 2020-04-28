const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')


const app = express()
const server = http.createServer(app)
const io = socketio(server)


const port = process.env.PORT || 3000
const publicPath = path.join(__dirname, './public')


app.use(express.static(publicPath))
app.set('views', __dirname + '/views');
app.set('view engine', 'html');


io.on('connection',()=>{
    console.log('New socket connection')
})


app.get('/', (req, res) => {
    res.render('index.html')
})


server.listen(port, ()=>{
    console.log('Server running on port',port)
})