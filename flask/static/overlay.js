const homeScore = document.getElementById('home-score')
const visitorScore = document.getElementById('visitor-score')
const gameClock = document.getElementById('game-clock')
const shotClock = document.getElementById('shot-clock')
const period = document.getElementById('period')
const downs = document.getElementById('downs')

const homePossesion = document.getElementById('home-possesion')
const visitorPossesion = document.getElementById('visitor-possesion')

const socket = io()

socket.on('update', payload => {
    homeScore.innerText = payload.home_score
    visitorScore.innerText = payload.visitor_score
    gameClock.innerText = payload.clock
    shotClock.innerText = payload.play
    period.innerText = payload.quarter
    downs.innerText = `${payload.down} & ${payload.to_go}`

    if (payload.home_possesion){
        homePossesion.classList.remove('hide')
        visitorPossesion.classList.add('hide')
    }

    if (payload.visitor_possesion){
        homePossesion.classList.add('hide')
        visitorPossesion.classList.remove('hide')
    }

})

