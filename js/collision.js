async function loadData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('加载失败:', error);
  }
}

const collisionJSON = await loadData("collision.json");
const collision = document.querySelector('.collision')
if (!collision) throw new Error('.collision not found');

const speedInt = 5

const placed = [];

console.log('collision rect:', collision.getBoundingClientRect());

collisionJSON.forEach(element => {
  const size = element.size;
  const rect = collision.getBoundingClientRect();
  const maxX = Math.max(rect.width - size, 0);
  const maxY = Math.max(rect.height - size, 0);
  console.log('element:', element.name, 'size:', size, 'maxX:', maxX, 'maxY:', maxY, 'rect:', rect);
  const speedX = Math.ceil(speedInt * 2 * Math.random() - speedInt)
  const speedY = Math.ceil(speedInt * 2 * Math.random() - speedInt )

  let x, y, attempts = 0, maxAttempts = 500;
  do {
    x = Math.random() * maxX;
    y = Math.random() * maxY;
    attempts++;
  } while (attempts < maxAttempts && placed.some(p => {
    const dx = (p.x + p.size / 2) - (x + size / 2);
    const dy = (p.y + p.size / 2) - (y + size / 2);
    const minDist = (p.size + size) / 2 + 2;
    return dx * dx + dy * dy < minDist * minDist;
  }));

  placed.push({ x, y, size });

  const div = document.createElement('div');
  div.className = 'collision-item';
  div.style.width = size + 'px';
  div.style.height = size + 'px';
  div.style.backgroundColor = element.color;
  div.style.top = y + 'px';
  div.style.left = x + 'px';
  div.textContent = element.name;
  div.dataset.speedX = speedX
  div.dataset.speedY = speedY

  collision.appendChild(div);
});

const collisionItems = document.querySelectorAll('.collision-item')
console.log(collisionItems)
setInterval(function(){
    collisionItems.forEach(
        item => {
            const speedX = parseInt(item.dataset.speedX)
            const speedY = parseInt(item.dataset.speedY)
            const currentX = parseFloat(item.style.left)
            const currentY = parseFloat(item.style.top)

            item.style.top = currentY + speedY + 'px'
            item.style.left = currentX + speedX + 'px'

        }
    )
},20)