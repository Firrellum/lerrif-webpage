document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });

    const githubIcons = document.querySelectorAll('.github-icon');
    const githubSvg = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.435 21.795 8.205 23.385C8.805 23.49 9.03 23.13 9.03 22.815C9.03 22.53 9.015 21.69 9.015 20.805C6 21.36 5.22 19.755 4.98 19.095C4.845 18.75 4.275 17.415 3.78 17.13C3.375 16.905 2.79 16.35 3.765 16.335C4.68 16.32 5.355 17.19 5.58 17.55C6.63 19.275 8.295 18.825 9.075 18.51C9.18 17.73 9.495 17.145 9.84 16.815C7.185 16.485 4.41 15.555 4.41 11.115C4.41 9.885 4.845 8.835 5.58 8.01C5.46 7.68 5.055 6.48 5.67 4.92C5.67 4.92 6.66 4.575 9.015 6.045C9.975 5.79 11.025 5.655 12.075 5.655C13.125 5.655 14.175 5.79 15.135 6.045C17.49 4.575 18.48 4.92 18.48 4.92C19.095 6.48 18.69 7.68 18.57 8.01C19.305 8.835 19.74 9.885 19.74 11.115C19.74 15.57 16.95 16.485 14.28 16.815C14.715 17.22 15.09 17.985 15.09 19.11C15.09 20.685 15.075 22.41 15.075 22.815C15.075 23.13 15.3 23.505 15.915 23.385C20.565 21.795 24 17.31 24 12C24 5.37 18.63 0 12 0Z" fill="var(--primary-cyan)"/>
        </svg>
    `;

    githubIcons.forEach(icon => {
        icon.innerHTML = githubSvg;
    });

    const canvas = document.getElementById('trail-canvas');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = document.querySelector('.hero').offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const squares = [];
    const numSquares = 7;

    class Square {
        constructor() {
            this.size = 10;
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.targetX = this.getRandomCoord(canvas.width);
            this.targetY = this.getRandomCoord(canvas.height);
            this.speed = 0.01;
            this.history = [];
            this.maxTrailLength = 40;
        }

        getRandomCoord(max) {
            return Math.random() * (max - this.size * 2) + this.size;
        }

        update() {
            this.x += (this.targetX - this.x) * this.speed;
            this.y += (this.targetY - this.y) * this.speed;

            if (Math.abs(this.targetX - this.x) < 1 && Math.abs(this.targetY - this.y) < 1) {
                this.targetX = this.getRandomCoord(canvas.width);
                this.targetY = this.getRandomCoord(canvas.height);
            }

            
            this.history.push({ x: this.x, y: this.y });
            if (this.history.length > this.maxTrailLength) {
                this.history.shift();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255, 0, 255, 0.5)';
            ctx.lineWidth = 2;
            for (let i = 0; i < this.history.length - 1; i++) {
                ctx.moveTo(this.history[i].x, this.history[i].y);
                ctx.lineTo(this.history[i + 1].x, this.history[i + 1].y);
                ctx.strokeStyle = `rgba(255, 0, 255, ${0.5 * (i / this.maxTrailLength)})`;
                ctx.stroke();
            }

            ctx.fillStyle = 'rgba(0, 255, 255, 0.7)';
            ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
            ctx.closePath();
        }
    }

    for (let i = 0; i < numSquares; i++) {
        squares.push(new Square());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        squares.forEach(square => {
            square.update();
            square.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();
});

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});