const dino = document.getElementById("dino");
const cactus = document.getElementById("cactus");
const message = document.getElementById("buffMessage");
let isJumping = false;
let gravity = 0.9;
let score = 0;
let speed = 10; // Начальная скорость кактуса
let speedBoostActive = false; // Баф на скорость
let invisibilityActive = false; // Баф на невидимость
let superJumpActive = false; // Баф на увеличенный прыжок
let invincibilityActive = false; // Баф на неуязвимость

// Ведение счёта
let scoreCounter = setInterval(() => {
    score += 1;
    document.getElementById("score").innerText = `Score: ${score}`;

    // Увеличиваем скорость каждые 100 баллов
    if (score % 100 === 0) {
        speed += 1; // Увеличиваем скорость кактуса
    }
}, 100);

// Обработка прыжка динозавра
document.addEventListener("keydown", function(event) {
    if (event.key === " " && !isJumping) {
        jump();
    }
});

function jump() {
    let position = 0;
    let jumpHeight = superJumpActive ? 250 : 150; // Увеличиваем высоту прыжка, если активен баф
    isJumping = true;
    let interval = setInterval(() => {
        if (position >= jumpHeight) {
            clearInterval(interval);
            let downInterval = setInterval(() => {
                if (position <= 0) {
                    clearInterval(downInterval);
                    isJumping = false;
                } else {
                    position -= 20;
                    dino.style.bottom = position + "px";
                }
            }, 20);
        } else {
            position += 20;
            dino.style.bottom = position + "px";
        }
    }, 20);
}

// Движение кактуса справа налево
let cactusPosition = window.innerWidth;
let moveInterval = setInterval(() => {
    if (cactusPosition <= -50) {
        cactusPosition = window.innerWidth;
    } else {
        cactusPosition -= speed;
    }
    cactus.style.left = cactusPosition + "px";

    // Проверка на столкновение
    let dinoBottom = parseInt(window.getComputedStyle(dino).getPropertyValue("bottom"));
    if (cactusPosition > 0 && cactusPosition < 50 && dinoBottom < 60 && !invincibilityActive) {
        alert("Game Over");
        clearInterval(moveInterval);
        clearInterval(scoreCounter);
        location.reload();
    }
}, 20);

// Функция для наложения бафов
function applyRandomBuff() {
    let buffs = [
        { name: "Скорость", apply: activateSpeedBoost },
        { name: "Невидимость", apply: activateInvisibility },
        { name: "Мега прыжок", apply: activateSuperJump },
        { name: "Бесмертие", apply: activateInvincibility }
    ];
    let randomBuff = buffs[Math.floor(Math.random() * buffs.length)];
    
    randomBuff.apply();
    showMessage(randomBuff.name);

    // Баф накладывается каждые 10-20 секунд
    setTimeout(applyRandomBuff, Math.random() * (20000 - 10000) + 10000);
}

// Функции бафов

function activateSpeedBoost() {
    if (!speedBoostActive) {
        speedBoostActive = true;
        speed += 5; // Увеличиваем скорость кактуса
        setTimeout(() => {
            speedBoostActive = false;
            speed -= 5; // Возвращаем нормальную скорость
        }, 5000); // Баф действует 5 секунд
    }
}

function activateInvisibility() {
    if (!invisibilityActive) {
        invisibilityActive = true;
        dino.style.opacity = "0.5"; // Делаем динозавра полупрозрачным
        setTimeout(() => {
            invisibilityActive = false;
            dino.style.opacity = "1"; // Возвращаем обычную прозрачность
        }, 5000); // Баф действует 5 секунд
    }
}

function activateSuperJump() {
    if (!superJumpActive) {
        superJumpActive = true;
        setTimeout(() => {
            superJumpActive = false;
        }, 5000); // Баф действует 5 секунд
    }
}

function activateInvincibility() {
    if (!invincibilityActive) {
        invincibilityActive = true;
        dino.style.border = "3px solid yellow"; // Визуальный эффект неуязвимости
        setTimeout(() => {
            invincibilityActive = false;
            dino.style.border = "none"; // Возвращаем нормальный вид
        }, 5000); // Баф действует 5 секунд
    }
}

// Показываем сообщение о бафе
function showMessage(buffName) {
    message.innerText = `Buff activated: ${buffName}`;
    message.style.display = "block";
    setTimeout(() => {
        message.style.display = "none";
    }, 2000); // Сообщение исчезает через 2 секунды
}

// Запускаем бафы по таймеру
applyRandomBuff();
