// ####################################
// #######    rotate Planets    #######
// ####################################

// elements
const rotateCenter = document.querySelector(".rotate-center")
const planetCenters = document.querySelectorAll(".planet-center")
const tempBlock = document.querySelector(".temp-block")
const planetErea = document.querySelector(".planets")

let planetEreaCenterX = planetErea.getBoundingClientRect().left + planetErea.getBoundingClientRect().width / 2;
let planetEreaCenterY = planetErea.getBoundingClientRect().top + planetErea.getBoundingClientRect().height / 2;
rotateCenter.style.left = `${planetEreaCenterX}px`;
rotateCenter.style.top = `${planetEreaCenterY}px`;




// variables
const radius = 233;
const rotateX = rotateCenter.getBoundingClientRect().left;
const rotateY = rotateCenter.getBoundingClientRect().top;
const duration = 8;
let currentIndex = 0;





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

let planetsAppearanceTl = gsap.timeline()
planetsAppearanceTl.from(planetCenters[0].children[0], {
    opacity: 0,
    width: 0,
    height: 0
}).from (planetCenters[1].children[0], {
    opacity: 0,
    width: 0,
    height: 0
}).from (planetCenters[2].children[0], {
    opacity: 0,
    width: 0,
    height: 0
})




// ##########################################
// ###   let planets moving around        ###
// ###   plan1 calc position of planets   ### 
// ##########################################

// let planet0animation = gsap.to(planetCenters[0], {
//     duration: duration, 
//     repeat: -1, 
//     ease: "none", 
//     onUpdate: function () {
//         const progress = this.progress();

//         const angle = progress * Math.PI * 2;

//         const x = radius * Math.cos(angle);
//         const y = radius * Math.sin(angle);

//         gsap.set(planetCenters[0], {
//             x:x,
//             y:y + radius
//         });
//     }
// });


// let planet1animation = gsap.to(planetCenters[1], {
//     duration: duration, 
//     repeat: -1, 
//     ease: "none", 
//     onUpdate: function () {
//         const progress = this.progress() + 1/3;

//         const angle = progress * Math.PI * 2;

//         const x = radius * Math.cos(angle);
//         const y = radius * Math.sin(angle);

//         gsap.set(planetCenters[1], {
//             x:x - radius * (Math.cos(Math.PI / 6)),
//             y:y - radius * (Math.sin(Math.PI / 6))
//         });
//     }
// });

// let planet2animation = gsap.to(planetCenters[2], {
//     duration: duration, 
//     repeat: -1, 
//     ease: "none", 
//     onUpdate: function () {
//         const progress = this.progress() + 2/3;

//         const angle = progress * Math.PI * 2;

//         const x = radius * Math.cos(angle);
//         const y = radius * Math.sin(angle);

//         gsap.set(planetCenters[2], {
//             x:x + radius * (Math.cos(Math.PI / 6)),
//             y:y - radius * (Math.sin(Math.PI / 6))
//         });
//     }
// });



// ######################################
// ###   plan2 rotate planet-Center   ###
// ######################################

gsap.to(planetCenters[0],{
    duration: duration,
    rotation: 360,
    repeat: -1,
    ease: "none",
    transformOrigin: `0 ${radius}px`
})
gsap.to(planetCenters[1],{
    duration: duration,
    rotation: 360,
    repeat: -1,
    ease: "none",
    transformOrigin: `${-(radius * (Math.cos(Math.PI / 6)))}px ${-(radius * Math.sin(Math.PI / 6))}px`
})
gsap.to(planetCenters[2],{
    duration: duration,
    rotation: 360,
    repeat: -1,
    ease: "none",
    transformOrigin: `${(radius * (Math.cos(Math.PI / 6)))}px ${-(radius * Math.sin(Math.PI / 6))}px`
})




// #############################   functions   ######################################

// 获取到某点最近的planetCenter
function getClosestPlanetToAPoint(planetCenters, pointX, pointY) {
    let closestPlanetCenter = null;
    let closestDistance = Infinity;

    planetCenters.forEach(planetCenter => {
        let vectorX = planetCenter.getBoundingClientRect().left + parseFloat(gsap.getProperty(planetCenter, "x")) - pointX;
        let vectorY = planetCenter.getBoundingClientRect().top + parseFloat(gsap.getProperty(planetCenter, "y")) - pointY;

        // 计算行星与点的距离
        let distanceSquared = vectorX * vectorX + vectorY * vectorY;
        // console.log(planetCenter.getAttribute("index"),distanceSquared)

        // 如果当前行星的距离比已知最近距离小，则更新最近行星和最近距离
        if (distanceSquared < closestDistance) {
            closestPlanetCenter = planetCenter;
            closestDistance = distanceSquared;
        }
    });

    return closestPlanetCenter;
}


//随机选取一个行星
function randomOtherIndex(preventIndex) {
    let options = [0, 1, 2].filter(item => item !== preventIndex);
    // return options[Math.floor(Math.random() * 2)];
    currentIndex = options[Math.floor(Math.random() * 2)];
    return currentIndex;
}


// 计算顺时针的下一个行星的index
function getNextIndex(currentIndex) {
    if (currentIndex === 2) {
        return 0;
    } else {
        return currentIndex + 1;
    }
}


// 计算顺时针的上一个行星的index
function getLastIndex(currentIndex) {
    if (currentIndex === 0) {
        return 2;
    } else {
        return currentIndex - 1;
    }
}


//根据index选取planetCenter
function getPlanetCenterByIndex(index) {
    let neededPlanetCenter = null;

    planetCenters.forEach(planetCenter => {
        if (parseInt(planetCenter.getAttribute("index")) == index) {
            neededPlanetCenter = planetCenter;
        }
    })

    return neededPlanetCenter;
}

// console.log(getClosestPlanetToAPoint(planetCenters,rotateX-radius*Math.cos(Math.PI/6), rotateY+radius*Math.sin(Math.PI/6)))
// 使用函数获取距离左下方最近的行星
// const closestPlanet = getClosestPlanetToAPoint(planetCenters, rotateX, rotateY + radius);
// console.log("距离左下方最近的行星是:", closestPlanet);


// function removeElement(arr, value) {
//   return arr.filter(item => item !== value);
// }



// randomOtherIndex(currentIndex);
// console.log("随机选取的行星是:", currentIndex);

// 实现三体星系的随机性。
// 随机选取一个行星
// 选取当前选取的行星的下一个行星（顺治针）
// 在创建一个旋转原点
// 旋转原点跟随下一个行星一起转动（角速度一致）可以通过增加下一个行星的x和Y来实现
// 清楚当前选取的行星的动画
// 开始绕新的旋转原点旋转
// 获取当前选取的行星的后一个行星（逆时针）
// 后一个行星加速到当前选取的行星的位置。
// 计算新的旋转原点的半径上，当前选取的行星的process,需要计算弧度，然后转化到0-1之间
// 设置旋转实现，使当前选取的行星刚好旋转到原轨道上，可能是要计算新的旋转原点和半径的圆和当前轨道的交点，然后计算两交点之间的弧度，并转化到0-1之间
// 计算弧可能需要旋转矩阵坐标公式。
// 根据计算得到的process来设置动画进行的时间，从当前process,加到新的process，后停止动画，继续原来的动画。
// 设置定时器，每隔一端时间重复上面的过程。
// planetCenters[0].getAttribute()




// console.log(getPlanetCenterByIndex(2))

// get gsap object of planetCenter
// function getPlanetCenterGsapObject(planetCenter) {
    // let index = parseInt(planetCenter.getAttribute("index"));
    // let gsapObject = null;

    // if (index === 0) {
        // gsapObject = planet0animation;
    // } else if (index === 1) {
        // gsapObject = planet1animation;
    // } else if (index === 2) {
        // gsapObject = planet2animation;
    // }
// }

// function crossPlanet(planetCenter) {
//     // 计算新旋转中心
//     // 获取顺时针的下一个行星
//     // thisPlanetIndex = planetCenter.GetAttribute("index");
//     // 获取当前行星的index
//     let currentPlanetIndex = parseInt(planetCenter.getAttribute("index"));
//     // 获取顺时针的下一个行星的index
//     let nextPlanetIndex = getNextIndex(currentPlanetIndex);
//     // 获取顺时针的下一个行星
//     let nextPlanetCenter = getPlanetCenterByIndex(nextPlanetIndex);

//     // nextPlanetCenter
//     let nextPlanetCenterGsapObject = gsap.getTweensOf(nextPlanetCenter)[0];
//     // nextPlanetCenterGsapObject.timeScale(2);

//     // setTimeout(() => nextPlanetCenterGsapObject.timeScale(1), 2500);


//     // console.log(currentPlanetIndex, nextPlanetCenter)
//     // 计算新旋转中心
//     // 计算新旋转中心的坐标
//     let currentPlanetCenterX = planetCenter.getBoundingClientRect().left;
//     let currentPlanetCenterY = planetCenter.getBoundingClientRect().top;

//     let nextPlanetCenterX = nextPlanetCenter.getBoundingClientRect().left + parseInt(gsap.getProperty(nextPlanetCenter, "x"));
//     let nextPlanetCenterY = nextPlanetCenter.getBoundingClientRect().top + parseInt(gsap.getProperty(nextPlanetCenter, "y"));

//     let vectorRotateCenterToNextPlanetCenterX = nextPlanetCenterX - rotateX;
//     let vectorRotateCenterToNextPlanetCenterY = nextPlanetCenterY - rotateY;

//     let newRotateCenterX = nextPlanetCenterX + vectorRotateCenterToNextPlanetCenterX;
//     let newRotateCenterY = nextPlanetCenterY + vectorRotateCenterToNextPlanetCenterY;


//     console.log("rotate Center", rotateX, rotateY)
//     console.log("下一个行星坐标:", nextPlanetCenterX, nextPlanetCenterY)
//     console.log("新旋转中心坐标:", newRotateCenterX, newRotateCenterY)
//     // let newRotateCenterX = rotateX - (nexpPlanetCenterX - rotateX) / 2;

//     // 计算需要旋转的角度
//     let vectorCurrentPlanetCenterToNewRotateCenterX = newRotateCenterX - currentPlanetCenterX;
//     let vectorCurrentPlanetCenterToNewRotateCenterY = newRotateCenterY - currentPlanetCenterY;
//     let distanceCurrentPlanetCenterToNewRotateCenter = Math.sqrt(vectorCurrentPlanetCenterToNewRotateCenterX * vectorCurrentPlanetCenterToNewRotateCenterX + vectorCurrentPlanetCenterToNewRotateCenterY * vectorCurrentPlanetCenterToNewRotateCenterY);

//     let vectorRotateCenterToNewRotateCenterX = newRotateCenterX - rotateX;
//     let vectorRotateCenterToNewRotateCenterY = newRotateCenterY - rotateY;
//     let distanceRotatecenterToNewRotateCenter = Math.sqrt(vectorRotateCenterToNewRotateCenterX * vectorRotateCenterToNewRotateCenterX + vectorRotateCenterToNewRotateCenterY * vectorRotateCenterToNewRotateCenterY)

//     let vectorCurrentPlanetCenterToRotateCenterX = rotateX - currentPlanetCenterX;
//     let vectorCurrentPlanetCenterToRotateCenterY = rotateY - currentPlanetCenterY;
//     let distanceCurrentPlanetCenterToRotateCenter = Math.sqrt(vectorCurrentPlanetCenterToRotateCenterX * vectorCurrentPlanetCenterToRotateCenterX + vectorCurrentPlanetCenterToRotateCenterY * vectorCurrentPlanetCenterToRotateCenterY)

//     let radianCurreentToNewRotateCenter = 2 * Math.acos((distanceCurrentPlanetCenterToNewRotateCenter * distanceCurrentPlanetCenterToNewRotateCenter + distanceRotatecenterToNewRotateCenter * distanceRotatecenterToNewRotateCenter - distanceCurrentPlanetCenterToRotateCenter * distanceCurrentPlanetCenterToRotateCenter) / (2 * distanceCurrentPlanetCenterToNewRotateCenter * distanceRotatecenterToNewRotateCenter));
//     let angleCurreentToNewRotateCenter = radianCurreentToNewRotateCenter * 180 / Math.PI;
//     console.log(angleCurreentToNewRotateCenter)

//     // gsap.getTweensOf(planetCenter)[0].paused();
//     gsap.to(planetCenter, {
//         duration: 2,
//         ease: "none", 
//         rotation: angleCurreentToNewRotateCenter,
//         onUpdate: function() {
//             const progress = this.progress();

//             newRotateCenterX = nextPlanetCenterX + nextPlanetCenter.getBoundingClientRect().left + parseInt(gsap.getProperty(nextPlanetCenter, "x")) - rotateX;
//             newRotateCenterY = nextPlanetCenterY + nextPlanetCenter.getBoundingClientRect().top + parseInt(gsap.getProperty(nextPlanetCenter, "y")) - rotateY;

//             // tempBlock.style.left = `${newRotateCenterX - planetCenter.getBoundingClientRect().left}px`;
//             // tempBlock.style.top = `${newRotateCenterY - planetCenter.getBoundingClientRect().top}px`;

//             gsap.set(planetCenter, {
//                 transformOrigin: `${newRotateCenterX - planetCenter.getBoundingClientRect().left}px ${newRotateCenterY - planetCenter.getBoundingClientRect().top}px`
//             })
//         }

//     });
// }

// setTimeout(()=> {
    // crossPlanet(getClosestPlanetToAPoint(planetCenters,rotateX-radius*Math.cos(Math.PI/6), rotateY+radius*Math.sin(Math.PI/6)))
    // console.log()
// }, 1000

// setInterval(() => {
    // let index = randomOtherIndex(currentIndex);
    // crossPlanet(getPlanetCenterByIndex(index))
    // currentIndex = index;
// },2000)
// console.log()





// function movePlanetByRadians(planet, radians, moveDuration = 2) {
//     // 清除现有动画
//     gsap.killTweensOf(planet);
    
//     // 获取当前变换值
//     const currentX = parseFloat(gsap.getProperty(planet, "x")) || 0;
//     const currentY = parseFloat(gsap.getProperty(planet, "y")) || 0;
    
//     // 计算当前角度
//     const currentAngle = Math.atan2(currentY - radius, currentX);
//     const targetAngle = currentAngle + radians;
    
//     return gsap.to(planet, {
//         duration: moveDuration,
//         ease: "power2.inOut",
//         onUpdate: function() {
//             const progress = this.progress();
//             const angle = currentAngle + progress * radians;
            
//             const x = radius * Math.cos(angle);
//             const y = radius * Math.sin(angle);
            
//             gsap.set(planet, {
//                 x: x,
//                 y: y + radius
//             });
//         },
//         onComplete: function() {
//             // 运动完成后，可以重新开始圆周运动或执行其他操作
//             console.log("弧度运动完成");
//         }
//     });
// }


// ############################
// ####   以上是真“三体” 😅   ###
// ############################


// ############################
// ####     以下是假“三体”    ###
// ############################

function crossPlanetNew(currentPlanetCenter) {

    let currentIndex = parseInt(currentPlanetCenter.getAttribute("index"));
    let currentGsapObject = gsap.getTweensOf(currentPlanetCenter)[0]
    let currentPlanetCenterX = currentPlanetCenter.getBoundingClientRect().left
    let currentPlanetCenterY = currentPlanetCenter.getBoundingClientRect().top

    let nextPlanetCenter = planetCenters[getNextIndex(currentIndex)]
    let nextGsapObject = gsap.getTweensOf(nextPlanetCenter)[0]
    let nextPlanetCenterX = nextPlanetCenter.getBoundingClientRect().left
    let nextPlanetCenterY = nextPlanetCenter.getBoundingClientRect().top


    let lastPlanetCenter = planetCenters[getLastIndex(currentIndex)]
    let lastGsapObject = gsap.getTweensOf(lastPlanetCenter)[0]
    let lastPlanetCenterX = lastPlanetCenter.getBoundingClientRect().left
    let lastPlanetCenterY = lastPlanetCenter.getBoundingClientRect().top


    // currentGsapObject.pause();
    gsap.killTweensOf(currentPlanetCenter);
    gsap.killTweensOf(nextPlanetCenter);
    gsap.killTweensOf(lastPlanetCenter);
    
    // nextGsapObject.pause();
    // lastGsapObject.pause();

    // 计算current到next的向量
    let vectorCurrentToNextX = nextPlanetCenterX - currentPlanetCenterX;
    let vectorCurrentToNextY = nextPlanetCenterY - currentPlanetCenterY;
    let distanceCurrentToNext = parseInt(Math.sqrt(vectorCurrentToNextX * vectorCurrentToNextX + vectorCurrentToNextY * vectorCurrentToNextY));


    // 获得中点
    let Midx = currentPlanetCenterX + vectorCurrentToNextX / 2;
    let Midy = currentPlanetCenterY + vectorCurrentToNextY / 2;

    // 获得中点到current的向量
    let vectorMidToCurrentX = currentPlanetCenterX - Midx;
    let vectorMidToCurrentY = currentPlanetCenterY - Midy;

    // 旋转中点到current的向量，形成法向量
    let vectorMidToRotate1X = vectorMidToCurrentX * Math.cos(Math.PI / 2) - vectorMidToCurrentY * Math.sin(Math.PI / 2)
    let vectorMidToRotate1Y = vectorMidToCurrentX * Math.sin(Math.PI / 2) + vectorMidToCurrentY * Math.cos(Math.PI / 2)

    let vectorMidToRotate2X = vectorMidToCurrentX * Math.cos(-Math.PI / 2) - vectorMidToCurrentY * Math.sin(-Math.PI / 2)
    let vectorMidToRotate2Y = vectorMidToCurrentX * Math.sin(-Math.PI / 2) + vectorMidToCurrentY * Math.cos(-Math.PI / 2)

    // rotate1 position
    let rotate1X = Midx + vectorMidToRotate1X;
    let rotate1Y = Midy + vectorMidToRotate1Y;

    let rotate2X = Midx + vectorMidToRotate2X;
    let rotate2Y = Midy + vectorMidToRotate2Y;

    // current To rotate2 vector
    let vectorCurrentToRotate2X = rotate2X - currentPlanetCenterX;
    let vectorCurrentToRotate2Y = rotate2Y - currentPlanetCenterY;

    // next To rotate1 vector
    let vectorNextToRotate1X = rotate1X - nextPlanetCenterX;
    let vectorNextToRotate1Y = rotate1Y - nextPlanetCenterY;


    // current 绕 rotate1旋转90deg

    gsap.to(currentPlanetCenter, {
        duration: 3,
        rotation: 90,
        ease: "none",
        transformOrigin: `${vectorCurrentToRotate2X}px ${vectorCurrentToRotate2Y}px`
    })

    gsap.to(nextPlanetCenter, {
        duration:3,
        rotation: 90,
        ease: "none",
        transformOrigin:`${vectorNextToRotate1X}px ${vectorNextToRotate1Y}px`
    })

    // 互换index
    currentPlanetCenter.setAttribute("index",nextPlanetCenter.getAttribute("index"))
    nextPlanetCenter.setAttribute("index", currentIndex)




    // let vectorCenterToMidX = Midx - rotateX;
    // let vectorCenterToMidY = Midy - rotateY;
    // let distanceCenterToMid = Math.sqrt(vectorCenterToMidX * vectorCenterToMidX + vectorCenterToMidY * vectorCenterToMidY);
    // let unitVectorCenterToMidX = vectorCenterToMidX / distanceCenterToMid;
    // let unitVectorCenterToMidY = vectorCenterToMidY / distanceCenterToMid;

    // let vectorCenterToNewRotatePointX = 2 * radius * unitVectorCenterToMidX;
    // let vectorCenterToNewRotatePointY = 2 * radius * unitVectorCenterToMidY;

    // let newRotatePointX = rotateX + vectorCenterToNewRotatePointX;
    // let newRotatePointY = rotateY + vectorCenterToNewRotatePointY;

    tempBlock.style.left = rotate1X + 'px';
    tempBlock.style.top = rotate1Y + 'px';

    // console.log(newRotatePointX,newRotatePointY)

    // let vectorNextToNewRotatePointX = newRotatePointX - nextPlanetCenterX
    // let vectorNextToNewRotatePointY = newRotatePointY - nextPlanetCenterY

    // gsap.to(nextPlanetCenter, {
        // duration:2,
        // rotation: 60,
        // transformOrigin: `${vectorNextToNewRotatePointX}px ${vectorNextToNewRotatePointY}px`
    // })


    // gsap.to(nextPlanetCenter, {

    // })
    // nextGsapObject.play(+10)
    // nextGsapObject.timeScale(1.5)
    
    // lastGsapObject.play()
    // lastGsapObject.timeScale(0.5)

    // currentGsapObject.play()

    // console.log(currentPlanetCenter.getBoundingClientRect().left, currentPlanetCenter.getBoundingClientRect().top)
    // console.log(nextPlanetCenter.getBoundingClientRect().left,nextPlanetCenter.getBoundingClientRect().top)
    // console.log(Midx,Midy)

    // tempBlock.style.left = `${Midx}px`;
    // tempBlock.style.top = `${newRotateCenterY - planetCenter.getBoundingClientRect().top}px`;
}

// setInterval(() => crossPlanetNew(getPlanetCenterByIndex(randomOtherIndex(currentIndex))), 3000)
crossPlanetNew(getPlanetCenterByIndex(1))

setTimeout(() => {
    crossPlanetNew(getPlanetCenterByIndex(0))
}, 3000);


// #########################################
// ############   consoles   ###############
// #########################################
console.log(rotateX,rotateY)