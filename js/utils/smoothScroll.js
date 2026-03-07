document.querySelector(".main").addEventListener("wheel", (event) => {
    event.preventDefault(); // 阻止默认的滚动行为

    // 计算滚动距离
    const delta = event.deltaY;
    const scrollSpeed = 20; // 自定义滚动速度

    // 使用requestAnimationFrame来平滑滚动
    let start = null;
    const element = event.target; // 确保element是当前滚动的元素

    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;

        // 计算新的滚动位置
        let newScrollTop = element.scrollTop + (delta / scrollSpeed) * progress / 16;

        // 更新滚动位置
        element.scrollTop = newScrollTop;

        // 如果滚动尚未完成，继续请求下一帧
        if (progress < Math.abs(delta)) {
            window.requestAnimationFrame(step);
        }
    }

    window.requestAnimationFrame(step);
});
