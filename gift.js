/* ==========================================
   STAR BACKGROUND & CURSOR SPARKLES
========================================== */

const isMobileGift = window.innerWidth < 768 || ('ontouchstart' in window);

function createStars() {
    const container = document.getElementById("stars");
    if (!container) return;

    const count = isMobileGift ? 45 : 220;

    for (let i = 0; i < count; i++) {
        const star = document.createElement("div");
        star.className = "star";

        const size = Math.random() * 3 + 1;
        star.style.width = size + "px";
        star.style.height = size + "px";
        star.style.left = Math.random() * 100 + "vw";
        star.style.top = Math.random() * 100 + "vh";
        star.style.animationDuration = (2 + Math.random() * 5) + "s";
        star.style.animationDelay = Math.random() * 5 + "s";

        container.appendChild(star);
    }
}

/* ==========================================
   CURSOR SPARKLE TRAIL
========================================== */

let lastGiftTrail = 0;
document.addEventListener("mousemove", (e) => {
    const now = Date.now();
    if (now - lastGiftTrail < 80) return;
    lastGiftTrail = now;

    const container = document.getElementById("cursor-trail");
    if (!container) return;

    const sparkle = document.createElement("span");
    sparkle.className = "cursor-sparkle";
    const icons = ["✨", "🎁", "💖", "❤️", "⭐"];
    sparkle.innerHTML = icons[Math.floor(Math.random() * icons.length)];

    sparkle.style.left = e.clientX + "px";
    sparkle.style.top = e.clientY + "px";

    container.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 1000);
});

/* ==========================================
   GIFT OPENING & CONFETTI
========================================== */

const giftBox = document.getElementById("giftBox");
const giftBoxSection = document.getElementById("giftBoxSection");
const surprise = document.getElementById("surprise");

if (giftBox) {
    giftBox.addEventListener("click", () => {
        // Animation
        giftBox.style.transform = "scale(0) rotate(720deg)";
        giftBox.style.opacity = "0";

        // Confetti burst
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 250,
                spread: 180,
                startVelocity: 50,
                origin: { y: 0.5 }
            });
        }

        setTimeout(() => {
            if (giftBoxSection) giftBoxSection.style.display = "none";

            if (surprise) {
                surprise.classList.remove("hidden");
                surprise.style.display = "block";
            }

            createHearts();
        }, 800);
    });
}

/* ==========================================
   FLOATING HEARTS
========================================== */

function createHearts() {
    setInterval(() => {
        const heart = document.createElement("div");
        const heartIcons = ["❤️", "💖", "🎁", "💕", "💗"];
        heart.innerHTML = heartIcons[Math.floor(Math.random() * heartIcons.length)];

        heart.style.position = "fixed";
        heart.style.bottom = "-50px";
        heart.style.left = Math.random() * 100 + "vw";
        heart.style.fontSize = (20 + Math.random() * 30) + "px";
        heart.style.zIndex = "10";
        heart.style.pointerEvents = "none";
        heart.style.animation = "heartFloat 7s linear forwards";

        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 7000);
    }, 450);
}

/* ==========================================
   KEYFRAMES FOR FLOATING HEARTS
========================================== */

const style = document.createElement("style");
style.innerHTML = `
@keyframes heartFloat {
    0% {
        transform: translateY(0) rotate(0deg);
        opacity: 0;
    }
    20% {
        opacity: 1;
    }
    100% {
        transform: translateY(-120vh) rotate(360deg);
        opacity: 0;
    }
}
.cursor-sparkle {
    position: absolute;
    pointer-events: none;
    user-select: none;
    animation: sparkleFade 1s linear forwards;
    font-size: 14px;
}
@keyframes sparkleFade {
    0% { transform: scale(0.5) translateY(0); opacity: 1; }
    100% { transform: scale(1.4) translateY(-25px); opacity: 0; }
}
`;

document.head.appendChild(style);

/* ==========================================
   PERSISTENT BACKGROUND MUSIC PLAYER
========================================== */

const giftMusic = document.getElementById("giftMusic");

function initGiftMusic() {
    if (!giftMusic) return;

    giftMusic.addEventListener("timeupdate", () => {
        if (sessionStorage.getItem("bgMusicPlaying") === "true") {
            sessionStorage.setItem("bgMusicTime", giftMusic.currentTime);
        }
    });

    const isSavedPlaying = sessionStorage.getItem("bgMusicPlaying") === "true";
    const savedTime = parseFloat(sessionStorage.getItem("bgMusicTime") || "0");

    if (isSavedPlaying) {
        if (savedTime > 0) {
            try { giftMusic.currentTime = savedTime; } catch (e) { }
        }
        playGiftMusic();
    }
}

function playGiftMusic() {
    if (!giftMusic) return;
    giftMusic.play().then(() => {
        sessionStorage.setItem("bgMusicPlaying", "true");
    }).catch((err) => {
        console.log("Gift audio play deferred:", err);
        const resumeGiftAudio = () => {
            if (sessionStorage.getItem("bgMusicPlaying") === "true") {
                const savedTime = parseFloat(sessionStorage.getItem("bgMusicTime") || "0");
                if (savedTime > 0 && giftMusic.currentTime === 0) {
                    try { giftMusic.currentTime = savedTime; } catch (e) { }
                }
                giftMusic.play().catch(() => { });
            }
            window.removeEventListener("click", resumeGiftAudio);
            window.removeEventListener("touchstart", resumeGiftAudio);
        };
        window.addEventListener("click", resumeGiftAudio);
        window.addEventListener("touchstart", resumeGiftAudio);
    });
}

/* ==========================================
   INITIALIZE
========================================== */

window.addEventListener("load", () => {
    createStars();
    initGiftMusic();
});