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

const socket = io()

socket.on('update', payload => {
    homeScore.innerText = payload.home_score
    visitorScore.innerText = payload.visitor_score
    gameClock.innerText = payload.clock
    shotClock.innerText = parseInt(payload.play)
    if (parseInt(payload.play) <= 5)
    {
        shotClock.classList.add('red')
    }
    else
    {
        shotClock.classList.remove('red')
    }
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

    if (payload.home_timeouts == 3)
    {
        homeTimeout1.classList.add('available')
        homeTimeout2.classList.add('available')
        homeTimeout3.classList.add('available')
    }

    if (payload.home_timeouts == 2)
    {
        homeTimeout1.classList.add('available')
        homeTimeout2.classList.add('available')
        homeTimeout3.classList.remove('available')
    }

    if (payload.home_timeouts == 1)
    {
        homeTimeout1.classList.add('available')
        homeTimeout2.classList.remove('available')
        homeTimeout3.classList.remove('available')
    }

    if (payload.home_timeouts == 0)
    {
        homeTimeout1.classList.remove('available')
        homeTimeout2.classList.remove('available')
        homeTimeout3.classList.remove('available')
    }

    if (payload.visitor_timeouts == 3)
    {
        visitorTimeout1.classList.add('available')
        visitorTimeout2.classList.add('available')
        visitorTimeout3.classList.add('available')
    }

    if (payload.visitor_timeouts == 2)
    {
        visitorTimeout1.classList.add('available')
        visitorTimeout2.classList.add('available')
        visitorTimeout3.classList.remove('available')
    }

    if (payload.visitor_timeouts == 1)
    {
        visitorTimeout1.classList.add('available')
        visitorTimeout2.classList.remove('available')
        visitorTimeout3.classList.remove('available')
    }

    if (payload.visitor_timeouts == 0)
    {
        visitorTimeout1.classList.remove('available')
        visitorTimeout2.classList.remove('available')
        visitorTimeout3.classList.remove('available')
    }


})

