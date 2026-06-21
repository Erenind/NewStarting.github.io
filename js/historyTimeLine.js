function getCoordinateY(rate) {
    const scrollY = window.scrollY || window.pageYOffset;
    const viewportHeight = window.innerHeight;
    return scrollY + (viewportHeight * rate);
}

const historyScroll = document.querySelector('.history-scroll');
const timerBox = document.querySelector('.history-timer-box');


