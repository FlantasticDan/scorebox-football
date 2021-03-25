const status = document.getElementById('status')

const homeTouchdownBtn = document.getElementById('home-touchdown-btn')
const visitorTouchdownBtn = document.getElementById('visitor-touchdown-btn')

const rawHomeScore = document.getElementById('raw-home-score')
const rawVisitorScore = document.getElementById('raw-visitor-score')
const rawHomeTimeouts = document.getElementById('raw-home-timeouts')
const rawVisitorTimeouts = document.getElementById('raw-visitor-timeouts')
const rawHomePossesion = document.getElementById('raw-home-possesion')
const rawVisitorPossesion = document.getElementById('raw-visitor-possesion')
const rawClock = document.getElementById('raw-clock')
const rawPlay = document.getElementById('raw-play')
const rawQuarter = document.getElementById('raw-quarter')
const rawDown = document.getElementById('raw-down')
const rawToGo = document.getElementById('raw-to-go')
const rawBallOn = document.getElementById('raw-ball-on')
const rawFlag = document.getElementById('raw-flag')

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

 socket.on('update', payload => {
    rawHomeScore.innerText = payload.home_score
    rawVisitorScore.innerText = payload.visitor_score
    rawHomeTimeouts.innerText = payload.home_timeouts
    rawVisitorTimeouts.innerText = payload.visitor_timeouts
    rawHomePossesion.innerText = payload.home_possesion
    rawVisitorPossesion.innerText = payload.visitor_possesion
    rawClock.innerText = payload.clock
    rawPlay.innerText = payload.play
    rawQuarter.innerText = payload.quarter
    rawDown.innerText = payload.down
    rawToGo.innerText = payload.to_go
    rawBallOn.innerText = payload.ball_on
    rawFlag.innerText = payload.flag
 })