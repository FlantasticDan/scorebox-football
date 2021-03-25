const status = document.getElementById('status')

const homeTouchdownBtn = document.getElementById('home-touchdown-btn')
const visitorTouchdownBtn = document.getElementById('visitor-touchdown-btn')

const socket = io()

socket.on('connect', () => {
    status.innerText = 'CONNECTED'
    status.classList.remove('error')
})

socket.on('disconnect', () => {
    status.innerText = 'DISCONNECTED'
    status.classList.add('error')
})

homeTouchdownBtn.onclick = () => {
    socket.emit('touchdown', 'home')
}

visitorTouchdownBtn.onclick = () => {
    socket.emit('touchdown', 'visitor')
}