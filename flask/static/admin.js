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

const toggleFlagOff = document.getElementById("toggle-flag-off")
const toggleFlagOn = document.getElementById("toggle-flag-on")
const toggleFlagConsole = document.getElementById("toggle-flag-console")

const flagInput = document.getElementById('flag-input')
const homePenalty = document.getElementById('home-penalty')
const visitorPenalty = document.getElementById('visitor-penalty')

let statusObject = undefined

const socket = io()

socket.on('connect', () => {
    socket.emit('status-request', 'status')
})

socket.on('status', payload => {
    status.innerText = 'CONNECTED'
    status.classList.remove('error')
    statusObject = payload
    StatusUpdate()
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

function ClearFlagToggles() {
    toggleFlagConsole.classList.remove('toggled')
    toggleFlagOff.classList.remove('toggled')
    toggleFlagOn.classList.remove('toggled')
}

function SetFlagToggle(newState) {
    ClearFlagToggles()
    switch (newState)
    {
        case "on":
            toggleFlagOn.classList.add('toggled')
            break
        case "off":
            toggleFlagOff.classList.add('toggled')
            break
        case "console":
            toggleFlagConsole.classList.add('toggled')
            break
        default:
            break
    }
}

function FlagStatusChange(newState) {
    socket.emit('flag-status', newState)
}

toggleFlagConsole.onclick = () => {FlagStatusChange('console')}
toggleFlagOff.onclick = () => {FlagStatusChange('off')}
toggleFlagOn.onclick = () => {FlagStatusChange('on')}

function StatusUpdate() {
    SetFlagToggle(statusObject.flag)
}

function AssignPenalty(team) {
    let offense = flagInput.value
    if (offense.length > 0)
    {
        let payload = {
            team: team,
            offense: offense
        }
        socket.emit('flag-alert', payload)
    }
    flagInput.value = ""
}

homePenalty.onclick = () => {AssignPenalty('home')}
visitorPenalty.onclick = () => {AssignPenalty('visitor')}