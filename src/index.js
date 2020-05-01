const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')


const app = express()
const server = http.createServer(app)
const io = socketio(server)
const Filter = require('bad-words')

const {generateMessage, locationMessage} = require('./utils/messages')


const port = process.env.PORT || 3000
const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath))

io.on('connection',(socket)=>{
    io.on('connection',(socket)=>{
        console.log('New connection')
    })

    socket.on('join', ({username, room})=>{
        socket.join(room)
        
        socket.emit('message',generateMessage('Welcome!'))
        socket.broadcast.to(room).emit('message', generateMessage(username+' has joined!'))

    })
    
    socket.on('sendMessage', (message, callback)=>{
        const filter = new Filter()

        if(filter.isProfane(message)){
            return callback('Bad language not allowed')
        }
        io.emit('message', generateMessage(message))
        callback('Delivered')
    })

    socket.on('disconnect', ()=>{
        io.emit('message', generateMessage('A user has left the chat'))
    })

    socket.on('sendLocation', (lat,long, callback) =>{
        io.emit('locationMessage', locationMessage(`https://www.google.com/maps/place/?q=${lat},${long}`))
       callback('Location Shared!')
    })
})

server.listen(port, ()=>{
    console.log('Server running on port',port)
})