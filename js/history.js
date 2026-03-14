import { loadJSON } from "./utils/loadJSON.js";

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

            // Title
            const title = document.createElement('h1');
            title.textContent = item.title;
            historyItem.appendChild(title);

            // Time
            const time = document.createElement('p');
            time.textContent = item.time;
            historyItem.appendChild(time);

            // Content
            const content = document.createElement('p');
            content.textContent = item.content;
            historyItem.appendChild(content);

            // Images if present
            if (item.imgUrl && item.imgUrl.length > 0) {
                item.imgUrl.forEach(imgSrc => {
                    const img = document.createElement('img');
                    img.src = imgSrc;
                    img.alt = item.title;
                    historyItem.appendChild(img);
                });
            }

            // Button if present
            if (item.buttonShow && item.buttonUrl && item.buttonText) {
                const button = document.createElement('button');
                const link = document.createElement('a');
                link.href = item.buttonUrl;
                link.textContent = item.buttonText;
                button.appendChild(link);
                historyItem.appendChild(button);
            }

            historyContent.appendChild(historyItem);
        });
    } catch (error) {
        console.error('Error loading history:', error);
    }
}