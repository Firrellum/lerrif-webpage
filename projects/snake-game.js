document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            window.location.href = href;
        });
    });

    const githubIcons = document.querySelectorAll('.github-icon');
    const githubSvg = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.435 21.795 8.205 23.385C8.805 23.49 9.03 23.13 9.03 22.815C9.03 22.53 9.015 21.69 9.015 20.805C6 21.36 5.22 19.755 4.98 19.095C4.845 18.75 4.275 17.415 3.78 17.13C3.375 16.905 2.79 16.35 3.765 16.335C4.68 16.32 5.355 17.19 5.58 17.55C6.63 19.275 8.295 18.825 9.075 18.51C9.18 17.73 9.495 17.145 9.84 16.815C7.185 16.485 4.41 15.555 4.41 11.115C4.41 9.885 4.845 8.835 5.58 8.01C5.46 7.68 5.055 6.48 5.67 4.92C5.67 4.92 6.66 4.575 9.015 6.045C9.975 5.79 11.025 5.655 12.075 5.655C13.125 5.655 14.175 5.79 15.135 6.045C17.49 4.575 18.48 4.92 18.48 4.92C19.095 6.48 18.69 7.68 18.57 8.01C19.305 8.835 19.74 9.885 19.74 11.115C19.74 15.57 16.95 16.485 14.28 16.815C14.715 17.22 15.09 17.985 15.09 19.11C15.09 20.685 15.075 22.41 15.075 22.815C15.075 23.13 15.3 23.505 15.915 23.385C20.565 21.795 24 17.31 24 12C24 5.37 18.63 0 12 0Z" fill="var(--primary-cyan)"/>
        </svg>
    `;
    githubIcons.forEach(icon => {
        icon.innerHTML = githubSvg;
    });

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score');
    const gameStatus = document.getElementById('gameStatus');
    const resetBtn = document.getElementById('resetBtn');

    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    let snake = [
        { x: 10, y: 10 },
    ];
    let food = { x: 15, y: 15 };
    let dx = 0;
    let dy = 0;
    let score = 0;
    let gameSpeed = 100;
    let gameLoop;

    const drawGame = () => {
        ctx.fillStyle = 'rgba(10, 25, 47, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= tileCount; i++) {
            ctx.beginPath();
            ctx.moveTo(i * gridSize, 0);
            ctx.lineTo(i * gridSize, canvas.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * gridSize);
            ctx.lineTo(canvas.width, i * gridSize);
            ctx.stroke();
        }

        snake.forEach(segment => {
            ctx.fillStyle = 'rgba(0, 255, 255, 0.8)';
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        });

        ctx.fillStyle = 'rgba(255, 0, 255, 0.8)';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    };

    const moveSnake = () => {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreDisplay.textContent = score;
            generateFood();
        } else {
            snake.pop();
        }
    };

    const generateFood = () => {
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);
        snake.forEach(segment => {
            if (food.x === segment.x && food.y === segment.y) {
                generateFood();
            }
        });
    };

    const checkCollision = () => {
        const head = snake[0];
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            return true;
        }
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true;
            }
        }
        return false;
    };

    const gameLoopFunction = () => {
        moveSnake();
        if (checkCollision()) {
            gameStatus.textContent = `Game Over! Score: ${score}`;
            clearInterval(gameLoop);
            return;
        }
        drawGame();
    };

    const startGame = () => {
        snake = [{ x: 10, y: 10 }];
        dx = 0;
        dy = 0;
        score = 0;
        scoreDisplay.textContent = score;
        gameStatus.textContent = '';
        generateFood();
        if (gameLoop) clearInterval(gameLoop);
        gameLoop = setInterval(gameLoopFunction, gameSpeed);
    };

    document.addEventListener('keydown', (e) => {
        e.preventDefault()
        switch (e.key) {
            case 'ArrowUp':
                if (dy !== 1) { dx = 0; dy = -1; }
                break;
            case 'ArrowDown':
                if (dy !== -1) { dx = 0; dy = 1; }
                break;
            case 'ArrowLeft':
                if (dx !== 1) { dx = -1; dy = 0; }
                break;
            case 'ArrowRight':
                if (dx !== -1) { dx = 1; dy = 0; }
                break;
        }
    });

    resetBtn.addEventListener('click', startGame);

    startGame();
});

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});