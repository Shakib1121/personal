/* =========================================================================
   EDITABLE JS VARIABLES
   ========================================================================= */
const CONFIG = {
  // Should music autoplay when countdown hits zero?
  AUTOPLAY_MUSIC_AT_MIDNIGHT: false,

  // Target date for the birthday (Year, Month index 0-11, Day, Hour, Min, Sec)
  // Note: October is month 9 in JS (0-indexed)
  // Format: "Month DD, YYYY HH:MM:SS"
  TARGET_DATE: "October 1, 2026 00:00:00",

  // Start date for calculating the photo blur effect
  // Example: Blur starts heavy 7 days before, gets clearer each day
  START_DATE: "September 28, 2026 00:00:00",

  // Max blur in pixels
  MAX_BLUR: 25,

  // Typewriter message to reveal at midnight
  TYPEWRITER_MESSAGE:
    "Happy Birthday Oishee 💖\nThe angel\nYou are the prettiest girl ever.\n With the most beautiful eyes, Smile, Heart and everything\nAlways be the way you are\n\nWishing you a very Happy Birthday Oishee💖\n- Someone",

  // Typewriter speed in ms per character
  TYPEWRITER_SPEED: 80,
};

/* =========================================================================
   DOM ELEMENTS
   ========================================================================= */
const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const mainContent = document.getElementById("main-content");
const heartsContainer = document.getElementById("hearts-container");
const revealPhoto = document.getElementById("reveal-photo");
const photoHint = document.getElementById("photo-hint");

const countdownSection = document.getElementById("countdown-section");
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

const revealSection = document.getElementById("reveal-section");
const typewriterEl = document.getElementById("typewriter");
const envelopeSection = document.getElementById("envelope-section");
const envelopeBtn = document.getElementById("envelope-btn");

const bgMusic = document.getElementById("birthday-song");
const musicBtn = document.getElementById("music-btn");
const musicIcon = document.getElementById("music-icon");
const musicText = document.getElementById("music-text");

let countdownInterval;
let isMusicPlaying = false;
let hasRevealed = false;

/* =========================================================================
   START SCREEN (Audio Init)
   ========================================================================= */
startBtn.addEventListener("click", () => {
  startScreen.style.opacity = "0";
  setTimeout(() => {
    startScreen.style.display = "none";
    mainContent.classList.remove("hidden");
    initApp();
  }, 500);
});

/* =========================================================================
   INITIALIZATION
   ========================================================================= */
function initApp() {
  initBackground();
  updateBlur();
  checkCountdown();
  countdownInterval = setInterval(checkCountdown, 1000);
}

/* =========================================================================
   MAGICAL BACKGROUND LOGIC
   ========================================================================= */
function initBackground() {
  createFireflies();
  createRosePetals();
  setInterval(createFloatingHeart, 2500);
}

function createFireflies() {
  const container = document.getElementById("fairy-dust");
  if (!container) return;
  const count = window.innerWidth < 600 ? 50 : 90;
  for (let i = 0; i < count; i++) {
    const firefly = document.createElement("div");
    firefly.className = "firefly";
    const size = 3 + Math.random() * 5;
    firefly.style.width = size + "px";
    firefly.style.height = size + "px";
    firefly.style.left = Math.random() * 100 + "vw";
    firefly.style.top = Math.random() * 100 + "vh";
    firefly.style.animationDuration = 8 + Math.random() * 10 + "s";
    firefly.style.animationDelay = Math.random() * 5 + "s";
    container.appendChild(firefly);
  }
}

function createRosePetals() {
  const container = document.getElementById("rose-petals");
  if (!container) return;
  setInterval(() => {
    if (Math.random() > 0.3) {
      const petal = document.createElement("div");
      petal.className = "rose-petal";
      const petals = ["🌸", "💮", "🌺", "🌼", "🌻", "🪷", "🏵️"];
      petal.innerHTML = petals[Math.floor(Math.random() * petals.length)];
      petal.style.left = Math.random() * 100 + "vw";
      petal.style.animationDuration =
        10 + Math.random() * 10 + "s, " + (2 + Math.random() * 3) + "s";
      container.appendChild(petal);
      setTimeout(() => petal.remove(), 25000);
    }
  }, 1500);
}

function createFloatingHeart() {
  const container = document.getElementById("floating-hearts");
  if (!container) return;

  const heart = document.createElement("div");
  heart.className = "bg-heart";

  const icons = ["💖", "💕", "🤍", "✨", "💓", "💗"];
  heart.innerHTML = icons[Math.floor(Math.random() * icons.length)];

  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = 15 + Math.random() * 20 + "px";
  heart.style.animationDuration = 8 + Math.random() * 7 + "s";

  container.appendChild(heart);

  setTimeout(() => heart.remove(), 15000);
}

/* =========================================================================
   PHOTO BLUR LOGIC
   ========================================================================= */
function updateBlur() {
  const now = new Date().getTime();
  const target = new Date(CONFIG.TARGET_DATE).getTime();
  const start = new Date(CONFIG.START_DATE).getTime();

  if (now >= target) {
    revealPhoto.style.filter = "blur(0px)";
    photoHint.innerText = "Here you are! ✨";
    return;
  }

  if (now <= start) {
    revealPhoto.style.filter = `blur(${CONFIG.MAX_BLUR}px)`;
    return;
  }

  // Calculate percentage between start and target
  const totalDuration = target - start;
  const elapsed = now - start;
  const progress = Math.min(Math.max(elapsed / totalDuration, 0), 1);

  // Invert progress for blur (100% progress = 0 blur)
  const currentBlur = CONFIG.MAX_BLUR * (1 - progress);
  revealPhoto.style.filter = `blur(${currentBlur}px)`;
}

/* =========================================================================
   COUNTDOWN LOGIC
   ========================================================================= */
function checkCountdown() {
  const now = new Date().getTime();
  const target = new Date(CONFIG.TARGET_DATE).getTime();
  const distance = target - now;

  if (distance <= 0) {
    // Midnight reached!
    clearInterval(countdownInterval);

    daysEl.innerText = "00";
    hoursEl.innerText = "00";
    minutesEl.innerText = "00";
    secondsEl.innerText = "00";

    triggerMidnightReveal();
  } else {
    // Update countdown UI
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.innerText = days.toString().padStart(2, "0");
    hoursEl.innerText = hours.toString().padStart(2, "0");
    minutesEl.innerText = minutes.toString().padStart(2, "0");
    secondsEl.innerText = seconds.toString().padStart(2, "0");
  }
}

/* =========================================================================
   MIDNIGHT REVEAL
   ========================================================================= */
function triggerMidnightReveal() {
  if (hasRevealed) return;
  hasRevealed = true;

  // Update Photo
  revealPhoto.style.filter = "blur(0px)";
  photoHint.innerText = "Happy Birthday Oishe! ✨";

  // Hide Countdown, Show Reveal
  countdownSection.classList.add("hidden");
  revealSection.classList.remove("hidden");

  // Show Music Widget
  const musicWidget = document.getElementById("music-widget");
  if (musicWidget) musicWidget.classList.remove("hidden");

  // Play Music
  if (CONFIG.AUTOPLAY_MUSIC_AT_MIDNIGHT && !isMusicPlaying) {
    toggleMusic();
  }

  // Confetti
  launchConfetti();

  // Typewriter
  startTypewriter(CONFIG.TYPEWRITER_MESSAGE, 0, () => {
    // Show Envelope after typewriter finishes
    setTimeout(() => {
      envelopeSection.classList.remove("hidden");
    }, 1000);
  });
}

function launchConfetti() {
  if (typeof confetti === "function") {
    const duration = 5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#ff7eb3", "#ff758c", "#ffffff"],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#ff7eb3", "#ff758c", "#ffffff"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }
}

function startTypewriter(text, index, callback) {
  if (index < text.length) {
    typewriterEl.innerHTML +=
      text.charAt(index) === "\n" ? "<br>" : text.charAt(index);
    setTimeout(
      () => startTypewriter(text, index + 1, callback),
      CONFIG.TYPEWRITER_SPEED,
    );
  } else {
    if (callback) callback();
  }
}

/* =========================================================================
   INTERACTIVE HEART TRAIL
   ========================================================================= */
let lastTrailTime = 0;

function createHeartTrail(x, y) {
  const now = Date.now();
  if (now - lastTrailTime < 50) return; // Throttle
  lastTrailTime = now;

  const heart = document.createElement("div");
  heart.className = "trail-heart";

  const hearts = ["❤️", "💙", "💜", "💛", "💚", "💖", "🤍", "🩷", "🩵", "🤎"];
  heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];

  // Randomize slight offset
  const offsetX = (Math.random() - 0.5) * 20;
  const offsetY = (Math.random() - 0.5) * 20;

  heart.style.left = x + offsetX + "px";
  heart.style.top = y + offsetY + "px";

  heartsContainer.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 1000);
}

document.addEventListener("mousemove", (e) => {
  createHeartTrail(e.clientX, e.clientY);
});

document.addEventListener(
  "touchmove",
  (e) => {
    if (e.touches.length > 0) {
      createHeartTrail(e.touches[0].clientX, e.touches[0].clientY);
    }
  },
  { passive: true },
);

/* =========================================================================
   MUSIC CONTROL
   ========================================================================= */
function toggleMusic() {
  if (isMusicPlaying) {
    bgMusic.pause();
    isMusicPlaying = false;
    musicIcon.innerText = "🎵";
    musicText.innerText = "Play Music";
    musicBtn.classList.remove("playing");
  } else {
    bgMusic.volume = 0.5;
    bgMusic
      .play()
      .then(() => {
        isMusicPlaying = true;
        musicIcon.innerText = "⏸️";
        musicText.innerText = "Pause Music";
        musicBtn.classList.add("playing");
      })
      .catch((e) => console.log("Audio play blocked", e));
  }
}

if (musicBtn) {
  musicBtn.addEventListener("click", toggleMusic);
}

/* =========================================================================
   ENVELOPE ROUTING
   ========================================================================= */
envelopeBtn.addEventListener("click", () => {
  // Add a tiny delay to allow animation
  setTimeout(() => {
    window.location.href = "gift.html";
  }, 600);
});
