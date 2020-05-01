const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')


const app = express()
const server = http.createServer(app)
const io = socketio(server)
const Filter = require('bad-words')

const {generateMessage, locationMessage} = require('./utils/messages')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')


const port = process.env.PORT || 3000
const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath))

io.on('connection',(socket)=>{
    io.on('connection',(socket)=>{
        console.log('New connection')
    })

    socket.on('join', ({username, room}, callback)=>{
        const {error, user} = addUser({id:socket.id, username, room})

        if(error){
            return callback(error)
        }


        socket.join(user.room)
        
        socket.emit('message',generateMessage('Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage(user.username+' has joined!'))

        callback()

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
        const user = removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message', generateMessage(`${user.username} has left the chat`))

        }

    })

    socket.on('sendLocation', (lat,long, callback) =>{
        io.emit('locationMessage', locationMessage(`https://www.google.com/maps/place/?q=${lat},${long}`))
       callback('Location Shared!')
    })
})

server.listen(port, ()=>{
    console.log('Server running on port',port)
})