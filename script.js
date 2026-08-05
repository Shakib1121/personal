/* ==========================================
   MOBILE DETECTION & SOUND SYNTHESIZER (Web Audio API)
========================================== */

const isMobile = window.innerWidth < 768 || ('ontouchstart' in window);
let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function playSound(type) {
    try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;

        if (type === 'unlock') {
            // Chime sound
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + idx * 0.1);
                gain.gain.setValueAtTime(0.15, now + idx * 0.1);
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + idx * 0.1);
                osc.stop(now + idx * 0.1 + 0.45);
            });
        } else if (type === 'error') {
            // Error buzz
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.25);
        } else if (type === 'click') {
            // Soft click
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.08);
        } else if (type === 'open') {
            // Soft sweep sound
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(900, now + 0.3);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.3);
        }
    } catch (e) {
        // AudioContext not allowed or failed silently
    }
}

/* ==========================================
   PASSWORD SYSTEM & AUDIO WARMUP
========================================== */

const SECRET_PASSWORD = "oishee";

function checkPassword() {
    // Warm up audio context on user touch
    getAudioContext();

    const enteredPassword = document.getElementById("password").value;
    const error = document.getElementById("error");
    const loginCard = document.getElementById("loginCard");

    if (enteredPassword === SECRET_PASSWORD) {
        playSound('unlock');

        loginCard.classList.add("unlock-success");

        setTimeout(() => {
            document.getElementById("login-screen").style.display = "none";
            document.getElementById("website").style.display = "block";
            createStars();
            createShootingStars();
            updateCountdown();
        }, 500);

    } else {
        playSound('error');
        error.innerHTML = "Wrong password ❤️ Try again";

        loginCard.classList.remove("shake");
        void loginCard.offsetWidth; // Trigger reflow
        loginCard.classList.add("shake");
    }
}

/* ==========================================
   STAR & SHOOTING STAR BACKGROUND
========================================== */

function createStars() {
    const containers = [
        document.getElementById("stars"),
        document.getElementById("stars2"),
        document.getElementById("stars3")
    ];

    const count = isMobile ? 35 : 90;

    containers.forEach((container, index) => {
        if (!container || container.children.length > 0) return;

        for (let i = 0; i < count; i++) {
            const star = document.createElement("div");
            star.className = "star";

            const size = Math.random() * (index + 1.5) + 1;
            star.style.width = size + "px";
            star.style.height = size + "px";
            star.style.left = Math.random() * 100 + "vw";
            star.style.top = Math.random() * 100 + "vh";
            star.style.animationDuration = (2 + Math.random() * 5) + "s";
            star.style.animationDelay = Math.random() * 5 + "s";

            container.appendChild(star);
        }
    });
}

function createShootingStars() {
    const container = document.getElementById("shooting-stars");
    if (!container) return;

    const intervalTime = isMobile ? 4000 : 2500;

    setInterval(() => {
        if (Math.random() > 0.4) {
            const shootingStar = document.createElement("div");
            shootingStar.className = "shooting-star";

            shootingStar.style.top = Math.random() * 50 + "vh";
            shootingStar.style.left = Math.random() * 70 + "vw";
            shootingStar.style.animationDuration = (1.5 + Math.random() * 1.5) + "s";

            container.appendChild(shootingStar);

            setTimeout(() => {
                shootingStar.remove();
            }, 3000);
        }
    }, intervalTime);
}

/* ==========================================
   CURSOR HEART TRAIL EFFECT
========================================== */

let lastTrailTime = 0;
document.addEventListener("mousemove", (e) => {
    const now = Date.now();
    if (now - lastTrailTime < 70) return; // Throttle
    lastTrailTime = now;

    createCursorSparkle(e.clientX, e.clientY);
});

document.addEventListener("touchmove", (e) => {
    if (e.touches && e.touches[0]) {
        const touch = e.touches[0];
        createCursorSparkle(touch.clientX, touch.clientY);
    }
}, { passive: true });

function createCursorSparkle(x, y) {
    const trailContainer = document.getElementById("cursor-trail");
    if (!trailContainer) return;

    const sparkle = document.createElement("span");
    sparkle.className = "cursor-sparkle";

    const icons = ["✨", "💖", "❤️", "🌸", "⭐"];
    sparkle.innerHTML = icons[Math.floor(Math.random() * icons.length)];

    sparkle.style.left = (x + (Math.random() * 16 - 8)) + "px";
    sparkle.style.top = (y + (Math.random() * 16 - 8)) + "px";
    sparkle.style.fontSize = (12 + Math.random() * 12) + "px";

    trailContainer.appendChild(sparkle);

    setTimeout(() => {
        sparkle.remove();
    }, 1000);
}

/* ==========================================
   FLOATING HEART ANIMATION
========================================== */

function createHeart() {
    const heartsContainer = document.getElementById("hearts-container");
    if (!heartsContainer) return;

    const heart = document.createElement("div");
    heart.className = "heart";

    const heartIcons = ["❤️", "💖", "💕", "💗", "💓"];
    heart.innerHTML = heartIcons[Math.floor(Math.random() * heartIcons.length)];

    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = (15 + Math.random() * 30) + "px";
    heart.style.animationDuration = (6 + Math.random() * 6) + "s";

    heartsContainer.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 12000);
}

setInterval(createHeart, isMobile ? 1200 : 700);

/* ==========================================
   MUSIC TOGGLE PLAYER (PERSISTENT ACROSS PAGES)
========================================== */

const music = document.getElementById("music");
const musicBtn = document.getElementById("musicBtn");
const musicText = document.getElementById("musicText");
const musicIcon = document.getElementById("musicIcon");

let musicPlaying = false;

function syncMusicState() {
    if (!music) return;

    music.addEventListener("timeupdate", () => {
        if (musicPlaying) {
            sessionStorage.setItem("bgMusicTime", music.currentTime);
        }
    });

    const isSavedPlaying = sessionStorage.getItem("bgMusicPlaying") === "true";
    const savedTime = parseFloat(sessionStorage.getItem("bgMusicTime") || "0");

    if (isSavedPlaying) {
        if (savedTime > 0) {
            try { music.currentTime = savedTime; } catch (e) { }
        }
        playMusic();
    }
}

function playMusic() {
    if (!music) return;
    music.play().then(() => {
        musicPlaying = true;
        sessionStorage.setItem("bgMusicPlaying", "true");
        if (musicText) musicText.innerText = "Pause Music (Chitta)";
        if (musicIcon) musicIcon.innerText = "⏸️";
        if (musicBtn) musicBtn.classList.add("playing");
    }).catch((err) => {
        console.log("Audio play deferred or blocked:", err);
        const resumeAudio = () => {
            if (sessionStorage.getItem("bgMusicPlaying") === "true" && !musicPlaying) {
                const savedTime = parseFloat(sessionStorage.getItem("bgMusicTime") || "0");
                if (savedTime > 0 && music.currentTime === 0) {
                    try { music.currentTime = savedTime; } catch (e) { }
                }
                music.play().then(() => {
                    musicPlaying = true;
                    if (musicText) musicText.innerText = "Pause Music (Chitta)";
                    if (musicIcon) musicIcon.innerText = "⏸️";
                    if (musicBtn) musicBtn.classList.add("playing");
                }).catch(() => { });
            }
            window.removeEventListener("click", resumeAudio);
            window.removeEventListener("touchstart", resumeAudio);
        };
        window.addEventListener("click", resumeAudio);
        window.addEventListener("touchstart", resumeAudio);
    });
}

function pauseMusic() {
    if (!music) return;
    music.pause();
    musicPlaying = false;
    sessionStorage.setItem("bgMusicPlaying", "false");
    if (musicText) musicText.innerText = "Play Music (Chitta)";
    if (musicIcon) musicIcon.innerText = "🎵";
    if (musicBtn) musicBtn.classList.remove("playing");
}

if (musicBtn && music) {
    musicBtn.addEventListener("click", () => {
        playSound('click');
        if (!musicPlaying) {
            playMusic();
        } else {
            pauseMusic();
        }
    });
    syncMusicState();
}

/* ==========================================
   ANNIVERSARY COUNTDOWN
========================================== */

const anniversaryDate = new Date("August 10, 2026 00:00:00").getTime();
const countdownTimer = setInterval(updateCountdown, 1000);

function updateCountdown() {
    const now = new Date().getTime();
    const distance = anniversaryDate - now;

    if (distance <= 0) {
        clearInterval(countdownTimer);
        countdownFinished();
        return;
    }

    // Ensure ONLY countdown is visible before target date
    const countdownSection = document.getElementById("countdown-section");
    if (countdownSection) countdownSection.style.display = "flex";

    const heroSection = document.querySelector(".hero");
    if (heroSection) heroSection.style.display = "none";

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const dEl = document.getElementById("days");
    const hEl = document.getElementById("hours");
    const mEl = document.getElementById("minutes");
    const sEl = document.getElementById("seconds");

    if (dEl) dEl.innerHTML = days;
    if (hEl) hEl.innerHTML = hours;
    if (mEl) mEl.innerHTML = minutes;
    if (sEl) sEl.innerHTML = seconds;
}

function countdownFinished() {
    // Keep countdown section visible
    const countdownSection = document.getElementById("countdown-section");
    if (countdownSection) {
        countdownSection.style.display = "block";
        countdownSection.style.minHeight = "auto";
    }

    const dEl = document.getElementById("days");
    const hEl = document.getElementById("hours");
    const mEl = document.getElementById("minutes");
    const sEl = document.getElementById("seconds");

    if (dEl) dEl.innerHTML = "0";
    if (hEl) hEl.innerHTML = "0";
    if (mEl) mEl.innerHTML = "0";
    if (sEl) sEl.innerHTML = "0";

    // Reveal hero section (Anniversary title & text)
    const heroSection = document.querySelector(".hero");
    if (heroSection) {
        heroSection.style.display = "flex";
        heroSection.classList.add("fade-in");
    }

    // Reveal celebration message
    const celebration = document.getElementById("celebration");
    if (celebration) celebration.style.display = "block";

    revealSections();
    startTypewriter();
    launchConfetti();
}

/* ==========================================
   CONFETTI EFFECT
========================================== */

function launchConfetti() {
    if (typeof confetti !== 'function') return;

    confetti({
        particleCount: isMobile ? 100 : 200,
        spread: 160,
        startVelocity: 45,
        origin: { y: 0.6 }
    });

    let duration = 4000;
    let end = Date.now() + duration;

    let interval = setInterval(() => {
        if (Date.now() > end) {
            clearInterval(interval);
            return;
        }

        confetti({
            particleCount: isMobile ? 20 : 40,
            spread: 100,
            origin: { x: Math.random(), y: Math.random() - 0.2 }
        });
    }, 350);
}

/* ==========================================
   TYPEWRITER MESSAGE
========================================== */

const loveMessage = `Happy Anniversary Oishe❤️
Thank you for filling my life with love and happiness. 
You are really special for me. Please be the way you are. 
And yes, keep smiling. I am really obsessed with your eyes ❤️
-Shakib❤️`;
let textIndex = 0;

function startTypewriter() {
    const element = document.getElementById("typewriter");
    if (!element) return;

    element.innerHTML = "";
    textIndex = 0;

    function write() {
        if (textIndex < loveMessage.length) {
            const char = loveMessage.charAt(textIndex);
            element.innerHTML += (char === '\n') ? '<br>' : char;
            textIndex++;
            setTimeout(write, 45);
        }
    }
    write();
}

/* ==========================================
   REVEAL SECTIONS & SCROLL ANIMATIONS
========================================== */

function revealSections() {
    const sections = [
        ".slideshow-section",
        ".timeline-section",
        ".letter-section",
        ".rose-section",
        ".gift-section"
    ];

    sections.forEach(section => {
        const element = document.querySelector(section);
        if (element) {
            element.style.display = "block";
            element.classList.add("fade-in");
        }
    });
}

/* ==========================================
   INTERACTIVE PHOTO SLIDESHOW & TOUCH SWIPE
========================================== */

const photosData = [
    { src: "images/photo (1).jpg", caption: "❤️" },
    { src: "images/photo (2).jpg", caption: "💖" },
    { src: "images/photo (3).jpg", caption: "💕" },
    { src: "images/photo (4).jpg", caption: "💗" },
    { src: "images/photo (5).jpg", caption: "💓" },
    { src: "images/photo (6).jpg", caption: "💞" },
    { src: "images/photo (7).jpg", caption: "💘" },
    { src: "images/photo (8).jpg", caption: "💌" },
    { src: "images/photo (9).jpg", caption: "❣️" },
    { src: "images/photo (10).jpg", caption: "💜" },
    { src: "images/photo (11).jpg", caption: "💙" },
    { src: "images/photo (12).jpg", caption: "💝" }
];

let currentPhotoIndex = 0;
let slideshowInterval = null;

const slideImg = document.getElementById("slide");
const slideCaption = document.getElementById("slideCaption");
const prevBtn = document.getElementById("prevSlide");
const nextBtn = document.getElementById("nextSlide");
const dotsContainer = document.getElementById("slideDots");

function initSlideshow() {
    if (!slideImg || !dotsContainer) return;

    // Create pagination dots
    dotsContainer.innerHTML = "";
    photosData.forEach((_, idx) => {
        const dot = document.createElement("span");
        dot.className = "dot" + (idx === 0 ? " active" : "");
        dot.addEventListener("click", () => goToSlide(idx));
        dotsContainer.appendChild(dot);
    });

    if (prevBtn) prevBtn.addEventListener("click", () => { playSound('click'); prevSlide(); });
    if (nextBtn) nextBtn.addEventListener("click", () => { playSound('click'); nextSlide(); });

    // Touch Swipe Gestures for Mobile
    let touchStartX = 0;
    let touchEndX = 0;
    const slideshowWrapper = document.querySelector(".slideshow-container");

    if (slideshowWrapper) {
        slideshowWrapper.addEventListener("touchstart", (e) => {
            if (e.changedTouches && e.changedTouches[0]) {
                touchStartX = e.changedTouches[0].screenX;
            }
        }, { passive: true });

        slideshowWrapper.addEventListener("touchend", (e) => {
            if (e.changedTouches && e.changedTouches[0]) {
                touchEndX = e.changedTouches[0].screenX;
                const swipeDistance = touchEndX - touchStartX;
                if (Math.abs(swipeDistance) > 40) {
                    playSound('click');
                    if (swipeDistance < 0) {
                        nextSlide();
                    } else {
                        prevSlide();
                    }
                }
            }
        }, { passive: true });
    }

    startAutoSlide();
}

function updateSlideDisplay() {
    if (!slideImg) return;

    slideImg.style.opacity = "0";

    setTimeout(() => {
        slideImg.src = photosData[currentPhotoIndex].src;
        if (slideCaption) slideCaption.innerHTML = photosData[currentPhotoIndex].caption;

        slideImg.style.opacity = "1";

        // Update dots
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll(".dot");
            dots.forEach((dot, idx) => {
                dot.classList.toggle("active", idx === currentPhotoIndex);
            });
        }
    }, 300);
}

function nextSlide() {
    currentPhotoIndex = (currentPhotoIndex + 1) % photosData.length;
    updateSlideDisplay();
}

function prevSlide() {
    currentPhotoIndex = (currentPhotoIndex - 1 + photosData.length) % photosData.length;
    updateSlideDisplay();
}

function goToSlide(index) {
    playSound('click');
    currentPhotoIndex = index;
    updateSlideDisplay();
}

function startAutoSlide() {
    stopAutoSlide();
    slideshowInterval = setInterval(nextSlide, 4500);
}

function stopAutoSlide() {
    if (slideshowInterval) clearInterval(slideshowInterval);
}

// Pause slideshow on hover
const slideshowWrapper = document.querySelector(".slideshow-container");
if (slideshowWrapper) {
    slideshowWrapper.addEventListener("mouseenter", stopAutoSlide);
    slideshowWrapper.addEventListener("mouseleave", startAutoSlide);
}

/* ==========================================
   3D ENVELOPE & LETTER OPENING
========================================== */

const envelope = document.getElementById("envelope");
const letter = document.getElementById("letter");

if (envelope) {
    envelope.addEventListener("click", () => {
        playSound('open');
        envelope.classList.toggle("open");

        setTimeout(() => {
            if (letter) {
                letter.classList.add("letter-visible");
                letter.scrollIntoView({ behavior: 'smooth', block: isMobile ? 'start' : 'center' });
            }
        }, 400);
    });
}

/* ==========================================
   ROSE BLOOM & PETAL BURST
========================================== */

const rose = document.getElementById("rose");
const roseText = document.getElementById("roseText");
const petalBurst = document.getElementById("petal-burst");

if (rose) {
    rose.addEventListener("click", () => {
        playSound('open');

        rose.classList.add("bloom");
        rose.innerHTML = "🌺";

        if (roseText) {
            roseText.innerHTML = "You make my life bloom every single day ❤️";
            roseText.classList.add("highlight-text");
        }

        createPetalBurst();
    });
}

function createPetalBurst() {
    if (!petalBurst) return;

    const count = isMobile ? 16 : 30;
    const petals = ["🌸", "🌹", "💖", "✨"];
    for (let i = 0; i < count; i++) {
        const petal = document.createElement("span");
        petal.className = "falling-petal";
        petal.innerHTML = petals[Math.floor(Math.random() * petals.length)];

        petal.style.left = (Math.random() * 100) + "%";
        petal.style.animationDuration = (3 + Math.random() * 4) + "s";
        petal.style.fontSize = (16 + Math.random() * 20) + "px";

        petalBurst.appendChild(petal);

        setTimeout(() => {
            petal.remove();
        }, 7000);
    }
}

/* ==========================================
   GIFT BUTTON ROUTING
========================================== */

const giftButton = document.getElementById("giftBtn");
if (giftButton) {
    giftButton.addEventListener("click", () => {
        playSound('click');
        if (music && musicPlaying) {
            sessionStorage.setItem("bgMusicTime", music.currentTime);
            sessionStorage.setItem("bgMusicPlaying", "true");
        }
        window.location.href = "gift.html";
    });
}

/* ==========================================
   SMOOTH SCROLL INTERSECTION OBSERVER
========================================== */

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll("section").forEach(section => {
    observer.observe(section);
});

/* ==========================================
   INITIALIZE ON PAGE LOAD
========================================== */

window.addEventListener("load", () => {
    createStars();
    createShootingStars();
    initSlideshow();
    updateCountdown();
});
