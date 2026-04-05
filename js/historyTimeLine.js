function getCoordinateY(rate) {
    const scrollY = window.scrollY || window.pageYOffset;
    const viewportHeight = window.innerHeight;
    return scrollY + (viewportHeight * rate);
}

const historyScroll = document.querySelector('.history-scroll');
const timerBox = document.querySelector('.history-timer-box');

// setInterval(logOut, 1000)
function logOut() {
    let centerLineCoordinateY = getCoordinateY(0.5);
    let View20CoordinateY = getCoordinateY(0.2)
    const timerBoxCoordinateY = timerBox.getBoundingClientRect().height;
    let timerBoxToViewTop = timerBoxCoordinateY - window.scrollY;
    console.log(centerLineCoordinateY,timerBoxCoordinateY,View20CoordinateY)
    // 当centerLineCoordinateY超过timerCoordinate后就让
}

function setTimeBox() {
    const View20CoordinateY = getCoordinateY(0.3)
    const timerBoxCoordinateY = timerBox.getBoundingClientRect().height;
    const timerBoxToViewTop = timerBoxCoordinateY - window.scrollY;
    if (timerBoxToViewTop <= window.innerHeight * 0.1) {
        timerBox.style.position = "fixed"
        timerBox.style.top = (timerBoxToViewTop * 0.3) + "px"
        clearInterval(time1)
    } else {
        timerBox.style.position = "absolute"
        timerBox.style.top = 0;
        const time1 = setInterval(setTimeBox, 17)
    }
}
// setTimeBox()







// 历史时间线功能
// 当视野进入.history-scroll时.history-timer-box就固定在屏幕上，
// 脱离该区域时就取消固定，留在history-scroll的底部。
// 同样的初始时留在顶部，向上划出时也保留在history-scroll的顶部


// document.addEventListener("DOMContentLoaded", () => {
//     // 获取元素
    
//     // 创建水平中线元素
//     const centerLine = document.createElement('div');
//     centerLine.className = 'viewport-center-line';
//     centerLine.style.cssText = `
//         position: fixed;
//         left: 0;
//         width: 100%;
//         height: 2px;
//         background-color: red;
//         z-index: 9999;
//         pointer-events: none;
//         transition: top 0.1s ease;
//     `;
    
//     // 创建显示垂直px值的标签
//     const centerLabel = document.createElement('div');
//     centerLabel.className = 'viewport-center-label';
//     centerLabel.style.cssText = `
//         position: fixed;
//         left: 20px;
//         background-color: rgba(0, 0, 0, 0.8);
//         color: white;
//         padding: 5px 10px;
//         border-radius: 4px;
//         font-family: monospace;
//         font-size: 14px;
//         z-index: 10000;
//         pointer-events: none;
//         transition: top 0.1s ease;
//     `;
    
//     // 将元素添加到页面
//     document.body.appendChild(centerLine);
//     document.body.appendChild(centerLabel);
    
//     // 更新中线和标签位置的函数
//     function updateCenterLine() {
//         const centerY = getViewportCenterY();
        
//         // 设置中线位置
//         centerLine.style.top = `${centerY}px`;
        
//         // 设置标签位置（在中线上方10px）
//         centerLabel.style.top = `${centerY - 30}px`;
//         centerLabel.textContent = `Y: ${Math.round(centerY)}px`;
//     }
    
//     // 初始更新
//     updateCenterLine();
    
//     // 监听滚动事件
//     window.addEventListener('scroll', updateCenterLine);
    
//     // 监听窗口大小变化
//     window.addEventListener('resize', updateCenterLine);
    
//     // 原有的时间线功能（保留占位）
//     // TODO: 实现时间线固定功能
// });
