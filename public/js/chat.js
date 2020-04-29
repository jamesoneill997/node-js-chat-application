const socket = io()

const $messageForm = document.querySelector('#sendMessage')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#location')


socket.on('message', (message)=>{
    console.log(message)
})

socket.on('sendToAll',(message)=>{
    console.log(message)
})

document.querySelector('#sendMessage').addEventListener('submit', (message)=>{
    message.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const msg = message.target.elements.message.value
    
    socket.emit('sendMessage', msg,(error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if(error){
            return console.log(error)
        }

        console.log('Message delivered')
    })
})

document.querySelector('#location').addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('geolocation not supported by your browser')
    }
    $locationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation', position.coords.latitude, position.coords.longitude, (error)=>{
            $locationButton.removeAttribute('disabled')
            if(error){
                return console.log(error)
            }
        })
    })
})
