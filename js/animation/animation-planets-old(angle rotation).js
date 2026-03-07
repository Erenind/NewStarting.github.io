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
const innerDuration = 3;
const radius = 233;
const rotateX = rotateCenter.offsetLeft;
const rotateY = rotateCenter.offsetTop;

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

let currentIndex = getRandomInt(0,2);

// ##########################   init planets   #################################

planetCenters.forEach((planetCenter,index) => {
    planetCenter.setAttribute("index", index);
});

gsap.set(planetCenters[0], {
    left: rotateX,
    top: rotateY - radius,
});

gsap.set(planetCenters[1], {
    left: rotateX + radius * (Math.cos(Math.PI / 6)),
    top: rotateY + radius * (Math.sin(Math.PI / 6)),
});

gsap.set(planetCenters[2], {
    left: rotateX - radius * (Math.cos(Math.PI / 6)),
    top: rotateY + radius * (Math.sin(Math.PI / 6)),
});

// let planetsAppearanceTl = gsap.timeline()
// planetsAppearanceTl.from(planetCenters[0].children[0], {
//     opacity: 0,
//     width: 0,
//     height: 0
// }).from (planetCenters[1].children[0], {
//     opacity: 0,
//     width: 0,
//     height: 0
// }).from (planetCenters[2].children[0], {
//     opacity: 0,
//     width: 0,
//     height: 0
// })


// ###########   let the planet-erea rotate   ##############
// gsap.to('.planets',{
//     duration:outDuration,
//     rotation: 360,
//     repeat:-1,
//     ease:"none",
// });


// ###########   move the planetCenters   ################
// gsap.to(planetCenters[0],{
//     duration: innerDuration,
//     rotation:120,
//     transformOrigin: `0 ${radius}px`
// })
// gsap.to(planetCenters[1],{
//     duration: innerDuration,
//     rotation: 120,
//     // repeat: -1,
//     // ease: "none",
//     transformOrigin: `0 -${radius}px`
// })
// gsap.to(planetCenters[2],{
//     duration: duration,
//     rotation: 360,
//     repeat: -1,
//     ease: "none",
//     transformOrigin: `${(radius * (Math.cos(Math.PI / 6)))}px ${-(radius * Math.sin(Math.PI / 6))}px`
// })

// ########### get Element by Index
function getPlanetCenterbyIndex(index) {
    let element = null;
    planetCenters.forEach((planetCenter)=>{
        if (planetCenter.getAttribute("index")==index) {
            element = planetCenter
        }
    })
    return element
}

// ###########   get net index
function getNextIndex(currentIndex) {
    if (currentIndex === 2) {
        return 0;
    } else {
        return currentIndex + 1;
    }
}

// console.log(getPlanetCenterbyIndex(0))

// get rotate Center 
function rotateOriginInner(index) {
    let result = {x:null,y:null}
    if (index==0) {
        result.x = 0;
        result.y = radius;
    };
    if (index==1) {
        result.x = -radius*Math.cos(Math.PI / 6);
        result.y = -radius*Math.sin(Math.PI / 6);
    };
    if (index==2) {
        result.x = radius*Math.cos(Math.PI / 6);
        result.y = -radius*Math.sin(Math.PI / 6);
    }
    return result;
}

// test
// console.log(rotateOriginInner(1).x,rotateOriginInner(1).y)

function rotateOriginOut(index) {
    let result = {x:null,y:null}
    if (index==0) {
        result.x = -radius*Math.cos(Math.PI / 6);
        result.y = radius*Math.sin(Math.PI / 6);
    };
    if (index==1) {
        result.x = 0;
        result.y = -radius;
    };
    if (index==2) {
        result.x = radius*Math.cos(Math.PI / 6);
        result.y = radius*Math.sin(Math.PI / 6);
    }
    return result;
}


// test
// console.log(rotateOriginOut(0).x, rotateOriginOut(0).y)

// function animationAnything(index) {
//     let current  = getPlanetCenterbyIndex(index);
//     gsap.to(current, {
//         duration: innerDuration,
//         rotation:120,
//         transformOrigin: `${rotateOriginOut(index).x}px ${rotateOriginOut(index).y}px`
//     });

// }
// animationAnything(2)


// ##################    animation cross main   ################
// let current = null;
// let next = null;
// function animationCross(currentIndex) {
//     current = getPlanetCenterbyIndex(currentIndex);
//     next = getPlanetCenterbyIndex(getNextIndex(currentIndex));

//     // 1. 使用getComputedStyle获取当前旋转角度
//     const getCurrentRotation = (el) => {
//         const style = window.getComputedStyle(el);
//         const transform = style.transform || style.webkitTransform;
//         if (!transform || transform === 'none') return 0;
        
//         // 解析矩阵或rotate值
//         if (transform.includes('matrix')) {
//             const matrix = new DOMMatrix(transform);
//             return Math.round(Math.atan2(matrix.b, matrix.a) * (180 / Math.PI));
//         } else {
//             const match = transform.match(/rotate$(\d+)deg$/);
//             return match ? parseInt(match[1]) : 0;
//         }
//     };

//     const currentRotation = getCurrentRotation(current) + 120;
//     const nextRotation = getCurrentRotation(next) +120;

//     console.log(currentRotation,nextRotation)

//     // let currentPreveRotation = null;
//     // let nextPreveRotation = null;
//     // // const match = current.style.transform.match(/rotate$(\d+)deg$/); // 匹配rotate值
//     // if (current.style.transform.match(/rotate$(\d+)deg$/)) {
//     //     currentPreveRotation = parseInt(match[1]);
//     // } else {
//     //     currentPreveRotation = 0;
//     // }
//     // if (next.style.transform.match(/rotate$(\d+)deg$/)) {
//     //     nextPreveRotation = parseInt(match[1]);
//     // } else {
//     //     nextPreveRotation = 0;
//     // }
//     console.log(current,next);

//     gsap.killTweensOf(current);
//     gsap.killTweensOf(next);


//     gsap.to(current, {
//         duration: innerDuration,
//         rotation:currentRotation,
//         transformOrigin: `${rotateOriginInner(currentIndex).x}px ${rotateOriginInner(currentIndex).y}px`,
//         onComplete: () => current.setAttribute("index", getNextIndex(currentIndex))
//     });
//     gsap.to(next, {
//         duration: innerDuration,
//         rotation:nextRotation,
//         transformOrigin: `${rotateOriginOut(getNextIndex(currentIndex)).x}px ${rotateOriginOut(getNextIndex(currentIndex)).y}px`,
//         onComplete: () => next.setAttribute("index", currentIndex)
//     });

//     console.log(current,next)

// }
// animationCross(0);
// setTimeout(()=>{
//     animationCross(0);
// },innerDuration*1000)

function randomOtherIndex(preventIndex) {
    let options = [0, 1, 2].filter(item => item !== preventIndex);
    // return options[Math.floor(Math.random() * 2)];
    currentIndex = options[Math.floor(Math.random() * 2)];
    return currentIndex;
}

setInterval(()=>{
    // random currentIndex
    currentIndex = randomOtherIndex(currentIndex);
    // console.log(currentIndex)

    // animationCross(currentIndex)


},innerDuration*1000)


// 角度计算出现问题，改用坐标计算，这样好控制，也好获取上一个状态，并且可以使用一些数学函数，和数学公式。ok
