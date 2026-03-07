// ####################################
// #######    rotate Planets    #######
// ####################################

// elements
const rotateCenter = document.querySelector(".rotate-center")
const planetCenters = document.querySelectorAll(".planet-center")
const tempBlock = document.querySelector(".temp-block")
const planetErea = document.querySelector(".planets")


// variables
const outDuration = 5;
const innerDuration = 4;
const bufferTime = 300;
const radius = 233;
const rotateCenterCoordinate = {
    x: rotateCenter.offsetLeft,
    y: rotateCenter.offsetTop
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

let currentIndex = getRandomInt(0, 2);

// ##########   init planets   ###########

planetCenters.forEach((planetCenter, index) => {
    planetCenter.setAttribute("index", index);
});

gsap.set(planetCenters[0], {
    left: rotateCenterCoordinate.x,
    top: rotateCenterCoordinate.y - radius,
});

gsap.set(planetCenters[1], {
    left: rotateCenterCoordinate.x + radius * (Math.cos(Math.PI / 6)),
    top: rotateCenterCoordinate.y + radius * (Math.sin(Math.PI / 6)),
});

gsap.set(planetCenters[2], {
    left: rotateCenterCoordinate.x - radius * (Math.cos(Math.PI / 6)),
    top: rotateCenterCoordinate.y + radius * (Math.sin(Math.PI / 6)),
});

// ###########   planet show   ##########
let planetsAppearanceTl = gsap.timeline()
planetsAppearanceTl.from(planetCenters[0].children[0], {
    opacity: 0,
    width: 0,
    height: 0
}).from(planetCenters[1].children[0], {
    opacity: 0,
    width: 0,
    height: 0
}).from(planetCenters[2].children[0], {
    opacity: 0,
    width: 0,
    height: 0
})


// ###########   let the planet-erea rotate   ##############
gsap.to('.planets', {
    duration: outDuration,
    rotation: 360,
    repeat: -1,
    ease: "none",
});


// ########### get Element by Index ######
function getPlanetCenterbyIndex(index) {
    let element = null;
    planetCenters.forEach((planetCenter) => {
        if (planetCenter.getAttribute("index") == index) {
            element = planetCenter
        }
    })
    return element
}

// ###########   get next index ######
function getNextIndex(currentIndex) {
    if (currentIndex === 2) {
        return 0;
    } else {
        return currentIndex + 1;
    }
}

// get rotate Center (inner and out)
function rotateOriginInner(index) {
    const result = { x: null, y: null }
    if (index == 0) {
        result.x = 0;
        result.y = radius;
    };
    if (index == 1) {
        result.x = -radius * Math.cos(Math.PI / 6);
        result.y = -radius * Math.sin(Math.PI / 6);
    };
    if (index == 2) {
        result.x = radius * Math.cos(Math.PI / 6);
        result.y = -radius * Math.sin(Math.PI / 6);
    }
    return result;
}

function rotateOriginOut(index) {
    const result = { x: null, y: null }
    if (index == 0) {
        result.x = -radius * Math.cos(Math.PI / 6);
        result.y = radius * Math.sin(Math.PI / 6);
    };
    if (index == 1) {
        result.x = 0;
        result.y = -radius;
    };
    if (index == 2) {
        result.x = radius * Math.cos(Math.PI / 6);
        result.y = radius * Math.sin(Math.PI / 6);
    }
    return result;
}

// ########## random index ##########

function randomOtherIndex(preventIndex) {
    const options = [0, 1, 2].filter(item => item !== preventIndex);
    // return options[Math.floor(Math.random() * 2)];
    currentIndex = options[Math.floor(Math.random() * 2)];
    return currentIndex;
}

// ########## rotate vector and get new coordinate #########
function newCoordinate(rotateCenterCoordinate, preveCoordinate, angle) {
    const vectorStart = {
        x: preveCoordinate.x - rotateCenterCoordinate.x,
        y: preveCoordinate.y - rotateCenterCoordinate.y
    }

    const vectorRotated = {
        x: vectorStart.x * Math.cos(angle) - vectorStart.y * Math.sin(angle),
        y: vectorStart.x * Math.sin(angle) + vectorStart.y * Math.cos(angle)
    }

    const newCoordinate = {
        x: rotateCenterCoordinate.x + vectorRotated.x,
        y: rotateCenterCoordinate.y + vectorRotated.y
    }

    return newCoordinate
}



// ########## animation cross main ##########


function animationCross(currentIndex) {
    const current = getPlanetCenterbyIndex(currentIndex);
    const nextIndex = getNextIndex(currentIndex)
    const next = getPlanetCenterbyIndex(nextIndex);

    // handle current
    const currentCoordinate = {
        x: current.offsetLeft,
        y: current.offsetTop
    };

    gsap.to(current, {
        duration: innerDuration,
        // ease:"none",
        onUpdate: function () {
            const progress = this.progress();

            const angle = (2 * Math.PI / 3) * progress

            const newCoordinate2 = newCoordinate(rotateCenterCoordinate, currentCoordinate, angle)

            gsap.set(current, {
                left: newCoordinate2.x,
                top: newCoordinate2.y
            })
        },
        onComplete: () => {
            current.setAttribute("index", nextIndex)
        }
    })

    // handle next
    const nextCoordinate = {
        x: next.offsetLeft,
        y: next.offsetTop
    }
    const nextRotateCenterCoordinate = {
        x: nextCoordinate.x + rotateOriginOut(nextIndex).x,
        y: nextCoordinate.y + rotateOriginOut(nextIndex).y
    }

    gsap.to(next, {
        duration: innerDuration,
        // ease:"none",
        onUpdate: function () {
            const progress = this.progress();

            const angle = (2 * Math.PI / 3) * progress

            const newCoordinate3 = newCoordinate(nextRotateCenterCoordinate, nextCoordinate, angle)

            gsap.set(next, {
                left: newCoordinate3.x,
                top: newCoordinate3.y
            })
        },
        onComplete: () => {
            next.setAttribute("index", currentIndex)
        }
    })
}

animationCross(2)
// setTimeout(()=>{
//     animationCross(2)
// },innerDuration*1000 + 100)
// setTimeout(()=>{
//     animationCross(2)
// },innerDuration*1000*2 + 100)


setInterval(() => {
    // random currentIndex
    currentIndex = randomOtherIndex(currentIndex);
    animationCross(currentIndex)
}, innerDuration * 1000 + bufferTime)




// 获取到某点最近的planetCenter
// function getClosestPlanetToCoordiante(planetCenters, coordiante) {
//     const result = {
//         closestPlanetCenter: null,
//         closeVector: {},
//         closePlanetCoordinate: {}
//     }
//     let closestDistance = Infinity;

//     planetCenters.forEach(planetCenter => {
//         const planetCoordinate = {
//             x: planetCenter.getBoundingClientRect().left,
//             y: planetCenter.getBoundingClientRect().top
//         }
//         const vector = {
//             x: planetCoordinate.x - coordiante.x,
//             y: planetCoordinate.y - coordiante.y
//         }

//         // 计算行星与点的距离
//         let distanceSquared = vector.x * vector.x + vector.y * vector.y;

//         // 如果当前行星的距离比已知最近距离小，则更新最近行星和最近距离
//         if (distanceSquared < closestDistance) {
//             result.closestPlanetCenter = planetCenter;
//             result.closeVector = vector;
//             result.closePlanetCoordinate = planetCoordinate;
//             closestDistance = distanceSquared;
//         }
//     });

//     return result;
// }

// 获取history-scroll区域的顶部中心坐标
// const history = document.querySelector(".history-scroll");
// const historyTopCenterCoordinate = {
//     x: history.getBoundingClientRect().left + history.offsetWidth / 2,
//     y: history.getBoundingClientRect().top

// }



// gsap.set(".history-planet-center", {
//     left: historyTopCenterCoordinate.x,
//     top: historyTopCenterCoordinate.y,
//     // opacity:0,
// })

// gsap.fromTo(".history-planet-center", {
//     scrollTrigger: {
//         trigger: ".history-scroll",
//         start: "top 90%",
//         markers: true
//     },
//     // on: () => {
//     // gsap.set(".history-planet-center", {
//     // left: getClosestPlanetToCoordiante(planetCenters, historyTopCenterCoordinate).closePlanetCoordinate.x,
//     // top: getClosestPlanetToCoordiante(planetCenters, historyTopCenterCoordinate).closePlanetCoordinate.y,
//     // opacity: 0,
//     // })
//     // },
//     left: getClosestPlanetToCoordiante(planetCenters, historyTopCenterCoordinate).closePlanetCoordinate.x,
//     top: getClosestPlanetToCoordiante(planetCenters, historyTopCenterCoordinate).closePlanetCoordinate.y,
//     // left: historyTopCenterCoordinate.x + getClosestPlanetToCoordiante(planetCenters, historyTopCenterCoordinate).closeVector.x,
//     // top: historyTopCenterCoordinate.y + getClosestPlanetToCoordiante(planetCenters, historyTopCenterCoordinate).closeVector.y,
// }, {
//     left: historyTopCenterCoordinate.x,
//     top: historyTopCenterCoordinate.y,
// })

// const observer = new IntersectionObserver((entries) => {
//     entries.forEach(entry => {
//         if (entry.isIntersecting) {
//             gsap.set(".history-planet-center", {
//                 left: getClosestPlanetToCoordiante(planetCenters, historyTopCenterCoordinate).closePlanetCoordinate.x,
//                 top: getClosestPlanetToCoordiante(planetCenters, historyTopCenterCoordinate).closePlanetCoordinate.y,
//             });
//             observer.unobserve(entry.target); // 只触发一次
//         }
//     });
// }, {
//     threshold: 0.1, // 当 10% 的视口可见时触发
// });

// // 监听一个位于 100vh * 0.1 位置的元素
// const triggerElement = document.createElement("div");
// triggerElement.style.height = "1px";
// triggerElement.style.position = "absolute";
// triggerElement.style.top = `${window.innerHeight * 0.1}px`;
// document.body.appendChild(triggerElement);
// observer.observe(triggerElement);
