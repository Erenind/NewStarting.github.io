import { loadJSON } from "./utils/loadJSON.js";

/**
 * 根据border字段值获取对应的CSS变量名
 * @param {string} borderValue - border字段的值
 * @returns {string} CSS变量名
 */
function getBorderColorVariable(borderValue) {
    const borderMap = {
        'gray': '--textbox-border-gray',
        'light': '--textbox-border-light',
        'gold': '--textbox-border-gold',
        'light-green': '--textbox-border-light-green',
        'green': '--textbox-border-light-green', // 别名
    };
    
    // 默认使用gray，如果找不到对应的映射
    return borderMap[borderValue] || '--textbox-border-gray';
}

/**
 * 为历史项设置GSAP滚动动画
 * @param {HTMLElement} element - 历史项元素
 */
function setupHistoryItemAnimation(element) {
    // 确保GSAP和ScrollTrigger已加载
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded, skipping animation setup');
        return;
    }

    // 设置初始状态
    gsap.set(element, {
        opacity: 0,
        y: 50,
        scale: 0.95
    });

    // 创建动画时间线
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: element,
            start: 'top 80%', // 当元素顶部进入视口80%时开始
            end: 'top 20%',   // 当元素顶部到达视口20%时结束
            scrub: false,      // 动画进度与滚动位置同步
            markers: false,   // 调试时可设为true显示标记
            // 可选：添加更多配置
            // toggleActions: 'play none none reverse' // 也可以使用toggleActions
        }
    });

    // 添加动画序列
    tl.to(element, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5, // 动画持续时间（在scrub模式下，实际持续时间由滚动距离决定）
        ease: 'power2.out'
    });

    // 可选：添加一些微妙的旋转效果
    // tl.fromTo(element, { rotation: -2 }, { rotation: 0, duration: 0.5 }, '-=0.5');
}

export async function loadHistory() {
    try {
        const historyData = await loadJSON('history.json');
        const historyContent = document.querySelector('.history-content');

        // Clear existing content
        historyContent.innerHTML = '';

        historyData.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.setAttribute('type', item.type);

            // 根据border字段设置边框颜色
            if (item.border) {
                const borderColorVar = getBorderColorVariable(item.border);
                historyItem.style.borderColor = `var(${borderColorVar})`;
            }

            // Title
            const title = document.createElement('h1');
            title.textContent = item.title;
            historyItem.appendChild(title);

            // Image icon if images are present
            if (item.imgUrl && item.imgUrl.length > 0) {
                const iconContainer = document.createElement('div');
                iconContainer.className = 'history-item-image-icon';
                iconContainer.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-images-icon lucide-images"><path d="m22 11-1.296-1.296a2.4 2.4 0 0 0-3.408 0L11 16"/><path d="M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2"/><circle cx="13" cy="7" r="1" fill="currentColor"/><rect x="8" y="2" width="14" height="14" rx="2"/></svg>
                `;
                
                // Create image preview container
                const imagePreview = document.createElement('div');
                imagePreview.className = 'history-item-image-preview';
                imagePreview.style.display = 'none';
                
                // Add images to preview
                item.imgUrl.forEach(imgSrc => {
                    const img = document.createElement('img');
                    img.src = imgSrc;
                    img.alt = item.title;
                    imagePreview.appendChild(img);
                });
                
                // Add hover events with better UX
                let hideTimeout;
                
                iconContainer.addEventListener('mouseenter', () => {
                    clearTimeout(hideTimeout);
                    imagePreview.style.display = 'block';
                });
                
                iconContainer.addEventListener('mouseleave', () => {
                    // 短暂延迟再隐藏，让用户有机会移动到预览区域
                    hideTimeout = setTimeout(() => {
                        imagePreview.style.display = 'none';
                    }, 300);
                });
                
                imagePreview.addEventListener('mouseenter', () => {
                    clearTimeout(hideTimeout);
                    imagePreview.style.display = 'block';
                });
                
                imagePreview.addEventListener('mouseleave', () => {
                    hideTimeout = setTimeout(() => {
                        imagePreview.style.display = 'none';
                    }, 300);
                });
                
                historyItem.appendChild(iconContainer);
                historyItem.appendChild(imagePreview);
            }

            // Time
            const time = document.createElement('p');
            time.textContent = item.time;
            time.className = 'history-item-time';
            historyItem.appendChild(time);

            // Content
            const content = document.createElement('p');
            content.textContent = item.content;
            historyItem.appendChild(content);

            // Button if present
            if (item.buttonShow && item.buttonUrl && item.buttonText) {
                const button = document.createElement('button');
                const link = document.createElement('a');
                link.href = item.buttonUrl;
                link.textContent = item.buttonText;
                button.appendChild(link);
                
                // 设置按钮的边框颜色属性，使其与历史项边框颜色关联
                if (item.border) {
                    button.setAttribute('data-border-color', item.border);
                } else {
                    // 默认使用 light-green
                    button.setAttribute('data-border-color', 'light-green');
                }
                
                historyItem.appendChild(button);
            }

            historyContent.appendChild(historyItem);
            
            // 在元素添加到DOM后调整大小
            adjustSizeToFit(historyItem);
            
            // 设置GSAP滚动动画
            setupHistoryItemAnimation(historyItem);
        });
    } catch (error) {
        console.error('Error loading history:', error);
    }
}

function setSize(element, width, height) {
    element.style.width = width + 'px';
    element.style.height = height + 'px';
}

/**
 * 自适应调整元素大小
 * @param {HTMLElement} element - 要调整大小的元素
 * @param {number} startWidth - 起始宽度
 * @param {number} step - 每次递增的步长
 * @returns {Object} 最终的大小对象 {width, height}
 */
function adjustSizeToFit(element, startWidth = 300, step = 10) {
    let width = startWidth;
    let height = width * 0.618; // 黄金比例
    
    // 保存原始overflow样式
    const originalOverflow = element.style.overflow;
    
    // 临时设置overflow为hidden以便检测
    element.style.overflow = 'hidden';
    
    // 临时设置初始大小
    setSize(element, width, height);
    
    // 添加最大迭代限制，防止无限循环
    const maxIterations = 100;
    let iterations = 0;
    
    // 确保元素有非零的clientWidth/clientHeight
    // 如果clientWidth为0，可能需要强制重排
    if (element.clientWidth === 0 || element.clientHeight === 0) {
        // 强制浏览器重排以计算正确尺寸
        void element.offsetHeight;
    }
    
    // 检测是否溢出
    while ((element.scrollWidth > element.clientWidth || 
            element.scrollHeight > element.clientHeight) &&
            iterations < maxIterations) {
        // 如果溢出，增加宽度
        width += step;
        height = width * 0.618;
        setSize(element, width, height);
        iterations++;
    }
    
    // 恢复原始overflow样式
    element.style.overflow = originalOverflow;
    
    // 如果达到最大迭代次数，记录警告
    if (iterations >= maxIterations) {
        console.warn('adjustSizeToFit: 达到最大迭代次数，元素可能无法完全适应内容', element);
    }
    
    return { width, height };
}
