/* =========================================================================
   EDITABLE JS VARIABLES
   ========================================================================= */
const CONFIG = {
  // Password required to unlock the gift
  SECRET_PASSWORD: "pakhi",

  // Scratch cards data: label shown above, and letter/word hidden beneath
  SCRATCH_ITEMS: [
    { label: "❤️", hidden: "You" },
    { label: "💙", hidden: "Are" },
    { label: "💜", hidden: "The" },
    { label: "🖤", hidden: "Best" },
    { label: "💗", hidden: "Cutest" },
    { label: "💝", hidden: "Sweetest" },
    { label: "💛", hidden: "Amr jaan" },
    { label: "🩵", hidden: "Amr pookie" },
    { label: "🧡", hidden: "Amr pakhi" },
    { label: "🤎", hidden: "Amr bou" },
    { label: "💚", hidden: "Amr valobasha" },
    { label: "🤍", hidden: "Amr boujaan" },
    { label: "🩷", hidden: "I Love You Jaan" },
    { label: "💞", hidden: "I Love You Bou" },
    { label: "💓", hidden: "I Love You Pookie" },
    { label: "🖤", hidden: "I Love You Pakhi" },
    { label: "🖤", hidden: "I Love You Boujaan" },
  ],

  // Scratch brush size
  BRUSH_SIZE: 25,
};

/* =========================================================================
   DOM ELEMENTS
   ========================================================================= */
const passwordScreen = document.getElementById("password-screen");
const passwordCard = document.querySelector(".password-card");
const passwordInput = document.getElementById("password-input");
const unlockBtn = document.getElementById("unlock-btn");
const errorMsg = document.getElementById("error-msg");

const giftContent = document.getElementById("gift-content");
const scratchContainer = document.getElementById("scratch-container");

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

initBackground();

/* =========================================================================
   PASSWORD LOGIC
   ========================================================================= */
unlockBtn.addEventListener("click", checkPassword);
passwordInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") checkPassword();
});

function checkPassword() {
  const entered = passwordInput.value.trim().toLowerCase();

  if (entered === CONFIG.SECRET_PASSWORD.toLowerCase()) {
    // Success
    passwordScreen.style.opacity = "0";
    setTimeout(() => {
      passwordScreen.classList.add("hidden");
      giftContent.classList.remove("hidden");
      initScratchCards();
    }, 500);
  } else {
    // Error
    errorMsg.classList.remove("hidden");
    passwordCard.classList.remove("shake");
    void passwordCard.offsetWidth; // Trigger reflow
    passwordCard.classList.add("shake");
  }
}

/* =========================================================================
   SCRATCH CARD GENERATION & LOGIC
   ========================================================================= */
function initScratchCards() {
  scratchContainer.innerHTML = "";

  CONFIG.SCRATCH_ITEMS.forEach((item) => {
    // Wrapper
    const wrapper = document.createElement("div");
    wrapper.className = "scratch-card-wrapper";

    // Label
    const label = document.createElement("div");
    label.className = "card-label";
    label.innerText = item.label;

    // Card Body
    const card = document.createElement("div");
    card.className = "scratch-card";

    // Hidden Text
    const hiddenText = document.createElement("div");
    hiddenText.className = "scratch-content";
    hiddenText.innerText = item.hidden;

    // Canvas (The scratchable surface)
    const canvas = document.createElement("canvas");

    card.appendChild(hiddenText);
    card.appendChild(canvas);

    wrapper.appendChild(label);
    wrapper.appendChild(card);

    scratchContainer.appendChild(wrapper);

    // Setup canvas context and logic
    setupCanvas(canvas);
  });
}

function setupCanvas(canvas) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  // Set actual canvas size based on parent dimensions
  const width = 250;
  const height = 150;

  // Adjust for mobile screens if necessary based on CSS
  const isMobile = window.innerWidth <= 600;
  canvas.width = isMobile ? 220 : width;
  canvas.height = isMobile ? 130 : height;

  // Fill with metallic silver gradient
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#c0c0c0");
  gradient.addColorStop(0.5, "#e8e8e8");
  gradient.addColorStop(1, "#a0a0a0");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add some noise/texture (optional)
  ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
  for (let i = 0; i < 50; i++) {
    ctx.beginPath();
    ctx.arc(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      Math.random() * 2,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }

  // "SCRATCH ME" text on top
  ctx.font = "bold 20px sans-serif";
  ctx.fillStyle = "#666";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("SCRATCH ME", canvas.width / 2, canvas.height / 2);

  // Interaction logic
  let isDrawing = false;

  function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  function startDrawing(e) {
    isDrawing = true;
    scratch(e);
    e.preventDefault();
  }

  function stopDrawing() {
    isDrawing = false;
    checkReveal();
  }

  function scratch(e) {
    if (!isDrawing) return;

    const pos = getMousePos(e);

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, CONFIG.BRUSH_SIZE, 0, Math.PI * 2);
    ctx.fill();
  }

  // Event listeners
  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mousemove", scratch);
  canvas.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("mouseleave", stopDrawing);

  canvas.addEventListener("touchstart", startDrawing, { passive: false });
  canvas.addEventListener("touchmove", scratch, { passive: false });
  canvas.addEventListener("touchend", stopDrawing);

  // Check if scratched enough to reveal completely
  function checkReveal() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    // Every 4th value is Alpha
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        transparentPixels++;
      }
    }

    const totalPixels = pixels.length / 4;
    const percentageScratched = (transparentPixels / totalPixels) * 100;

    // If 60% scratched, clear the rest
    if (percentageScratched > 60) {
      canvas.style.transition = "opacity 0.5s ease";
      canvas.style.opacity = "0";
      setTimeout(() => {
        canvas.style.display = "none";
      }, 500);
    }
  }
}
