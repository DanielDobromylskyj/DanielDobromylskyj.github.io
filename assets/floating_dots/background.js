
const canvas = document.getElementById("backgroundCanvas");
const ctx = canvas.getContext("2d");
let frame = 0

const particle_count = 500;
const luminosity_distance = 150;
const min_brightness = 0.1;
const max_vel = 10;

let particles = [];
let mouseX = 0;
let mouseY = 0;
let max_distance = luminosity_distance;
let delta_time = 1/30
let close_to_mouse = [];

class Particle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;

        this.vel_x = (Math.random() - 0.5);
        this.vel_y = (Math.random() - 0.5);

        this.brightness = 1;
        this.close_to_mouse = false;
    }

    update(frame) {
        this.vel_x += (Math.random() - 0.5) * delta_time;
        this.vel_y += (Math.random() - 0.5) * delta_time;

        this.vel_x = Math.min(Math.max(this.vel_x, -max_vel), max_vel)
        this.vel_y = Math.min(Math.max(this.vel_y, -max_vel), max_vel)

        this.x += this.vel_x;
        this.y += this.vel_y;

        if (this.x < 0) { this.x = canvas.width; }
        if (this.y < 0) { this.y = canvas.height; }
        if (this.x > canvas.width) { this.x = 0; }
        if (this.y > canvas.height) { this.y = 0; }


        const distance_to_mouse = Math.sqrt((this.x - mouseX)*(this.x - mouseX) + (this.y - mouseY)*(this.y - mouseY));
        this.brightness = Math.max(1 - distance_to_mouse / max_distance, min_brightness);


        if (this.brightness > min_brightness) {
            if (!(this.close_to_mouse)) {
                this.close_to_mouse = true;
                close_to_mouse.push(this);
            }
        } else {
            if (this.close_to_mouse) {
                close_to_mouse = close_to_mouse.filter(item => item !== this);
                this.close_to_mouse = false;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.brightness})`;
        ctx.fill();
        ctx.closePath();
    }
}


function populateGrid() {
    const player = new Particle(0, 0, 0);
    close_to_mouse.push(player);

    for (let i=0; i<particle_count; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const r = Math.random() * 3;

        const particle = new Particle(x, y, r);

        particles.push(particle);
    }
}


function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    //max_distance = Math.sqrt(canvas.width*canvas.width + canvas.height*canvas.height);
    //draw();
}


document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

function draw() {
    // Do calcs
    for (let i=0; i < particles.length; i++) {
        particles[i].update(frame);
    }

    close_to_mouse[0].x = mouseX;
    close_to_mouse[0].y = mouseY;

    ctx.fillStyle = "#121e26";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < close_to_mouse.length; i++) {
        for (let j = 0; j < close_to_mouse.length; j++) {
            const p1 = close_to_mouse[i];
            const p2 = close_to_mouse[j];

            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;

            const distance = Math.sqrt((p1.x - p2.x)*(p1.x - p2.x) + (p1.y - p2.y)*(p1.y - p2.y));

            if (distance < 100) {
                const ratio = (1 / distance);

                ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 * ratio})`;
                ctx.lineWidth = 2;

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p1.x + (dx), p1.y + (dy));
                ctx.stroke();
            }
        }
    }

    for (let i=0; i<particles.length; i++) {
        particles[i].draw();
    }
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas()

populateGrid()

// draw loop
setInterval(draw, delta_time * 1000);
