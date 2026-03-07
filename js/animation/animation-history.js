import { loadJSON } from "../utils/loadJSON.js";

const boxElement = document.querySelector(".box");

function getRotationAngle(element) {
    // 获取元素的计算样式
    const style = window.getComputedStyle(element);
    // 获取 transform 属性值
    const transformValue = style.transform;

    // 如果 transform 属性值不为空且不是 none
    if (transformValue !== 'none') {
        // 使用正则表达式提取矩阵值
        const matrix = transformValue.match(/^matrix$([^)]+)$$/);
        if (matrix) {
            // 矩阵值是一个字符串，包含6个数字，以逗号分隔
            const values = matrix[1].split(', ').map(parseFloat);
            // 提取 a 和 b 值
            const a = values[0];
            const b = values[1];

            // 计算旋转角度（atan2(b, a) 返回弧度，乘以 180 / Math.PI 转换为角度）
            const angle = Math.atan2(b, a) * (180 / Math.PI);
            return angle;
        }
    }
    // 如果没有应用旋转，则返回0
    return 0;
}

// 示例用法
const angle = getRotationAngle(boxElement);
let angleNext = angle;
console.log(`元素的旋转角度是: ${angle} 度`);




setInterval(()=> {
    angleNext += 1
    gsap.set(".box",{
        rotate:angleNext
    })
},15)