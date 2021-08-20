const scorebox = document.getElementById('scorebox')

const homeScore = document.getElementById('home-score')
const visitorScore = document.getElementById('visitor-score')
const gameClock = document.getElementById('game-clock')
const shotClock = document.getElementById('shot-clock')
const period = document.getElementById('period')
const downs = document.getElementById('downs')

const homePossesion = document.getElementById('home-possesion')
const visitorPossesion = document.getElementById('visitor-possesion')

const homeTimeout1 = document.getElementById('home-timeout-1')
const homeTimeout2 = document.getElementById('home-timeout-2')
const homeTimeout3 = document.getElementById('home-timeout-3')

const visitorTimeout1 = document.getElementById('visitor-timeout-1')
const visitorTimeout2 = document.getElementById('visitor-timeout-2')
const visitorTimeout3 = document.getElementById('visitor-timeout-3')


const homeSummaryScore = document.getElementById('home-summary-score')
const visitorSummaryScore = document.getElementById('visitor-summary-score')
const summaryTag = document.getElementById('summary-tag')

const scorestate = document.getElementById('scorestate')

const flagOverlay = document.getElementById('flag-overlay')

const homeTouchdown = document.getElementById('home-touchdown')
const visitorTouchdown = document.getElementById('visitor-touchdown')

const homeFlag = document.getElementById('home-flag')
const visitorFlag = document.getElementById('visitor-flag')

const homeAlert = document.getElementById('home-alert')
const visitorAlert = document.getElementById('visitor-alert')
const neutralAlert = document.getElementById('neutral-alert')

let statusObject = undefined

const socket = io()

socket.on('connect', () => {
    socket.emit('status-request', 'status')
})

socket.on('status', payload => {
    statusObject = payload
    StatusUpdate()
})

function HomeTouchdown() {
    homeTouchdown.classList.add('animate')
    setTimeout(() => {homeTouchdown.classList.remove('animate')}, 5500)
}

function VisitorTouchdown() {
    visitorTouchdown.classList.add('animate')
    setTimeout(() => {visitorTouchdown.classList.remove('animate')}, 5500)
}

socket.on('touchdown', data => {
    if (data == 'home') {
        HomeTouchdown()
    }
    else {
        if (data == 'visitor') {
            VisitorTouchdown()
        }
    }
})

function StatusUpdate() {
    if (statusObject.flag == "on")
    {
        scorebox.classList.add('flag')
        flagOverlay.classList.remove('hidden')
    }
    else
    {
        if (statusObject.flag == "off")
        {
            scorebox.classList.remove('flag')
            flagOverlay.classList.add('hidden')
        }
    }

    if (statusObject.alert_visibility == 'off')
    {
        HideAlerts()
    }
    else {
        if (statusObject.alert_visibility == 'on')
        {
            ProcessAlert()
        }
    }
    
    ProcessDisplayMode()
    ProcessPlayVisibility()
}

function HomeFlag(offense) {
    homeFlag.innerText = offense
    homeFlag.classList.add('animate')
    setTimeout(() => {homeFlag.classList.remove('animate')}, 5500)
}

function VisitorFlag(offense) {
    visitorFlag.innerText = offense
    visitorFlag.classList.add('animate')
    setTimeout(() => {visitorFlag.classList.remove('animate')}, 5500)
}

socket.on('flag-alert', payload => {
    if (payload.team == 'home')
    {
        HideAlerts()
        HomeFlag(payload.offense)
    }
    else
    {
        if (payload.team == 'visitor')
        {
            HideAlerts()
            VisitorFlag(payload.offense)
        }
    }
})

function HideAlerts() {
    visitorAlert.classList.add('hidden')
    homeAlert.classList.add('hidden')
    neutralAlert.classList.add('hidden')
}

function ProcessAlert() {
    HideAlerts()
    switch (statusObject.alert_mode)
    {
        case 'home':
            homeAlert.innerText = statusObject.alert_text
            homeAlert.classList.remove('hidden')
            break
        case 'visitor':
            visitorAlert.innerText = statusObject.alert_text
            visitorAlert.classList.remove('hidden')
            break
        case 'neutral':
            neutralAlert.innerText = statusObject.alert_text
            neutralAlert.classList.remove('hidden')
            break
        default:
            break
    }
}

function ScoreBoxOut() {
    scorebox.classList.add('out')
    homeFlag.classList.add('out')
    visitorFlag.classList.add('out')
    neutralAlert.classList.add('out')
    homeAlert.classList.add('out')
    visitorAlert.classList.add('out')
    flagOverlay.classList.add('out')
    homeTouchdown.classList.add('out')
    visitorTouchdown.classList.add('out')

    scorestate.classList.remove('out')
}

function ScoreBoxIn() {
    scorebox.classList.remove('out')
    homeFlag.classList.remove('out')
    visitorFlag.classList.remove('out')
    neutralAlert.classList.remove('out')
    homeAlert.classList.remove('out')
    visitorAlert.classList.remove('out')
    flagOverlay.classList.remove('out')
    homeTouchdown.classList.remove('out')
    visitorTouchdown.classList.remove('out')

    scorestate.classList.add('out')
}

function ProcessDisplayMode() {
    homeSummaryScore.innerText = homeScore.innerText
    visitorSummaryScore.innerText = visitorScore.innerText

    if (statusObject.display_mode == 'live')
    {
        ScoreBoxIn()
    }
    else
    {
        switch (statusObject.display_mode)
        {
            case 'start':
                summaryTag.innerText = 'Starting Soon'
                break
            case 'first':
                summaryTag.innerText = 'End of 1st'
                break
            case 'half':
                summaryTag.innerText = 'Halftime'
                break
            case 'third':
                summaryTag.innerText = 'End of 3rd'
                break
            case 'final':
                summaryTag.innerText = 'Final'
                break
            default:
                break
        }
        ScoreBoxOut()
    }
}

function ProcessPlayVisibility() {
    switch (statusObject.play_visibility)
    {
        case "on":
            shotClock.classList.remove('hide')
            break
        case "off":
            shotClock.classList.add('hide')
            break
        default:
            break
    }
}