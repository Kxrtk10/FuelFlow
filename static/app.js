const STORAGE_KEY = "fuelflow.logs";

const quotes = [
  "You do not have to earn your food. You just have to eat it.",
  "Progress is not a straight line, and neither is digestion.",
  "Fuel your body like you love living in it.",
  "One meal does not define your health. A lifetime of awareness does.",
  "Food is culture, comfort, celebration, and fuel.",
  "Your body is always talking. FuelFlow helps you listen.",
  "Balance is coming back to yourself.",
  "Eating well means eating happily, too.",
  "Strong is built meal by meal, with patience and care.",
  "Every bite is a choice, not a verdict.",
];

const moods = [
  { emoji: "😔", label: "Stressed" },
  { emoji: "😐", label: "Neutral" },
  { emoji: "😊", label: "Good" },
  { emoji: "😄", label: "Happy" },
  { emoji: "😤", label: "Angry" },
  { emoji: "😴", label: "Tired" },
];

const successMessages = [
  "Logged! Every meal is data, not a verdict.",
  "Nice one. Awareness is everything.",
  "Saved. You're doing great.",
  "Logged with love.",
  "One more piece of the puzzle.",
];

const exploreItems = [
  {
    icon: "🥘",
    title: "Indian vegetarian",
    description: "Comforting, colorful plates built around lentils, grains, vegetables, and spice.",
    details: ["Dal chawal with kachumber", "Paneer bhurji with roti", "Vegetable poha with peanuts"],
    benefit: "Mood benefit: steady carbs and warm spices can feel grounding and satisfying.",
  },
  {
    icon: "🫒",
    title: "Mediterranean",
    description: "Bright, simple meals with olive oil, legumes, grains, fish, herbs, and fresh produce.",
    details: ["Chickpea salad bowl", "Grilled fish with rice", "Greek yogurt with fruit and nuts"],
    benefit: "Mood benefit: balanced fats and fiber can support steady energy.",
  },
  {
    icon: "🍱",
    title: "Japanese",
    description: "Gentle, balanced meals with rice, soup, vegetables, fish, tofu, and fermented sides.",
    details: ["Miso soup with tofu", "Salmon rice bowl", "Onigiri with cucumber salad"],
    benefit: "Mood benefit: simple portions and savory warmth can feel calming.",
  },
  {
    icon: "₹",
    title: "Budget eating under ₹100/meal",
    description: "Practical, filling meals that respect both appetite and budget.",
    details: ["Egg bhurji with roti", "Rajma rice", "Curd rice with pickle and cucumber"],
    benefit: "Tip: batch-cook grains and dal, then rotate toppings for variety.",
  },
  {
    icon: "🏋️",
    title: "Athlete fuel",
    description: "Pre and post workout ideas for training days, recovery days, and busy days.",
    details: ["Pre: banana with peanut butter", "Post: chicken rice bowl", "Quick: curd, fruit, and granola"],
    benefit: "Mood benefit: timing carbs and protein can help energy feel more predictable.",
  },
  {
    icon: "🥂",
    title: "Mindful drinking",
    description: "An honest, kind guide to alcohol, food, hydration, sleep, and balance.",
    details: ["Eat before you drink", "Alternate with water", "Plan a gentle breakfast for the next morning"],
    benefit: "Balance note: awareness helps you care for tomorrow-you.",
  },
];

const quoteText = document.querySelector("#quoteText");
const navButtons = document.querySelectorAll("[data-nav-target]");
const views = document.querySelectorAll(".view");
const mealForm = document.querySelector("#mealForm");
const energyRange = document.querySelector("#energyRange");
const energyValue = document.querySelector("#energyValue");
const alcoholToggle = document.querySelector("#alcoholToggle");
const drinksField = document.querySelector("#drinksField");
const todaySummary = document.querySelector("#todaySummary");
const todayList = document.querySelector("#todayList");
const emptyToday = document.querySelector("#emptyToday");
const quickAddToggle = document.querySelector("#quickAddToggle");
const quickAddForm = document.querySelector("#quickAddForm");
const insightsButton = document.querySelector("#insightsButton");
const insightsEmpty = document.querySelector("#insightsEmpty");
const insightsHint = document.querySelector("#insightsHint");
const insightsLoading = document.querySelector("#insightsLoading");
const insightsResult = document.querySelector("#insightsResult");
const insightText = document.querySelector("#insightText");
const factsGrid = document.querySelector("#factsGrid");
const exploreGrid = document.querySelector("#exploreGrid");
const toast = document.querySelector("#toast");

let selectedMoods = {
  before: moods[1],
  after: moods[2],
};

function readLogs() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function writeLogs(logs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 3600);
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function switchView(viewName) {
  views.forEach((view) => {
    view.classList.toggle("active", view.dataset.view === viewName);
  });

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.navTarget === viewName);
  });

  if (viewName === "today") {
    renderToday();
  }

  if (viewName === "insights") {
    updateInsightsState();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderMoodGroups() {
  document.querySelectorAll(".mood-group").forEach((group) => {
    const moodType = group.dataset.moodGroup;
    group.innerHTML = moods
      .map((mood) => {
        const isActive = selectedMoods[moodType].label === mood.label;
        return `
          <button class="mood-pill ${isActive ? "active" : ""}" type="button" data-mood-type="${moodType}" data-label="${escapeHtml(mood.label)}" data-emoji="${escapeHtml(mood.emoji)}">
            ${escapeHtml(mood.emoji)} ${escapeHtml(mood.label)}
          </button>
        `;
      })
      .join("");
  });
}

function createLogFromForm(formData) {
  const alcohol = Boolean(formData.get("alcohol"));
  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    mealName: formData.get("mealName").trim(),
    mealType: formData.get("mealType"),
    portionFeel: formData.get("portionFeel"),
    moodBefore: selectedMoods.before,
    moodAfter: selectedMoods.after,
    energy: Number(formData.get("energy")),
    notes: formData.get("notes").trim(),
    alcohol,
    drinks: alcohol ? Number(formData.get("drinks") || 1) : 0,
    eaten: false,
  };
}

function isToday(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  return date.toDateString() === now.toDateString();
}

function getMoodTrend(logs) {
  if (!logs.length) {
    return "Ready to begin";
  }

  const changed = logs.filter((log) => log.moodBefore?.label !== log.moodAfter?.label).length;
  if (changed >= Math.ceil(logs.length / 2)) {
    return "Your meals are shifting the day";
  }

  return "A steady day is taking shape";
}

function renderToday() {
  const todaysLogs = readLogs()
    .filter((log) => isToday(log.timestamp))
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const averageEnergy = todaysLogs.length
    ? (todaysLogs.reduce((sum, log) => sum + Number(log.energy || 0), 0) / todaysLogs.length).toFixed(1)
    : "0";

  todaySummary.innerHTML = `
    <article class="summary-card"><span>${todaysLogs.length}</span><p>meals logged today</p></article>
    <article class="summary-card"><span>${averageEnergy}</span><p>average energy score</p></article>
    <article class="summary-card"><span>↗</span><p>${escapeHtml(getMoodTrend(todaysLogs))}</p></article>
  `;

  emptyToday.classList.toggle("hidden-soft", todaysLogs.length > 0);
  todayList.innerHTML = todaysLogs.map(renderEntryCard).join("");
}

function renderEntryCard(log) {
  const time = new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const energy = Math.max(1, Math.min(10, Number(log.energy || 1)));
  const alcoholNote = log.alcohol
    ? `<p class="alcohol-note">Hydrate well and be kind to yourself.</p>`
    : "";

  return `
    <article class="entry-card ${log.eaten ? "eaten" : ""}" data-log-id="${escapeHtml(log.id)}">
      <div class="entry-top">
        <div>
          <div class="entry-title">
            <h3>${escapeHtml(log.mealName)}</h3>
            <span class="type-badge">${escapeHtml(log.mealType)}</span>
          </div>
          <div class="entry-meta">
            <span class="tag-pill">${escapeHtml(log.moodBefore?.emoji || "😐")} → ${escapeHtml(log.moodAfter?.emoji || "😊")}</span>
            <span class="tag-pill">${escapeHtml(log.portionFeel || "Just right")}</span>
            ${log.drinks ? `<span class="tag-pill">${escapeHtml(log.drinks)} drink${log.drinks > 1 ? "s" : ""}</span>` : ""}
          </div>
        </div>
        <span class="entry-time">${escapeHtml(time)}</span>
      </div>
      <div class="energy-track" aria-label="Energy ${energy} out of 10">
        <div class="energy-fill" style="width: ${energy * 10}%"></div>
      </div>
      ${log.notes ? `<p>${escapeHtml(log.notes)}</p>` : ""}
      ${alcoholNote}
      <label class="eaten-row">
        <input class="eaten-checkbox" type="checkbox" ${log.eaten ? "checked" : ""}>
        <span>${log.eaten ? '<span class="checkmark">✓</span> Eaten' : "Eaten"}</span>
      </label>
    </article>
  `;
}

function toggleEaten(logId, checked) {
  const logs = readLogs().map((log) => {
    return log.id === logId ? { ...log, eaten: checked } : log;
  });
  writeLogs(logs);
  renderToday();
}

function quickAdd(name) {
  const logs = readLogs();
  logs.push({
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    mealName: name,
    mealType: "Snack",
    portionFeel: "Just right",
    moodBefore: { emoji: "😐", label: "Neutral" },
    moodAfter: { emoji: "😊", label: "Good" },
    energy: 6,
    notes: "Quick add",
    alcohol: false,
    drinks: 0,
    eaten: false,
  });
  writeLogs(logs);
  renderToday();
}

function updateInsightsState() {
  insightsButton.classList.remove("hidden-soft");
  insightsEmpty.classList.add("hidden-soft");
  if (readLogs().length >= 3) {
    insightsHint.classList.add("hidden-soft");
  }
}

async function getInsights() {
  const logs = readLogs();
  if (logs.length < 3) {
    insightsHint.classList.remove("hidden-soft");
    insightsLoading.classList.add("hidden-soft");
    insightsResult.classList.add("hidden-soft");
    return;
  }

  insightsHint.classList.add("hidden-soft");
  insightsButton.disabled = true;
  insightsLoading.classList.remove("hidden-soft");
  insightsResult.classList.add("hidden-soft");

  try {
    const response = await fetch("/api/get-insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logs }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "FuelFlow could not read your week yet.");
    }

    const data = await response.json();
    insightText.textContent = data.insight || "";
    factsGrid.innerHTML = (data.facts || [])
      .slice(0, 3)
      .map((fact) => `
        <article class="fact-card">
          <span>✦</span>
          <h3>Did you know?</h3>
          <p>${escapeHtml(fact)}</p>
        </article>
      `)
      .join("");
    insightsResult.classList.remove("hidden-soft");
  } catch (error) {
    showToast(error.message || "Something paused. Please try again.");
  } finally {
    insightsButton.disabled = false;
    insightsLoading.classList.add("hidden-soft");
  }
}

function renderExplore() {
  exploreGrid.innerHTML = exploreItems
    .map((item, index) => `
      <article class="explore-card">
        <button class="explore-toggle" type="button" data-explore-index="${index}">
          <span class="explore-icon">${escapeHtml(item.icon)}</span>
          <span>
            <strong>${escapeHtml(item.title)}</strong>
            <p>${escapeHtml(item.description)}</p>
          </span>
          <span class="expand-arrow">⌄</span>
        </button>
        <div class="explore-body">
          <ul>
            ${item.details.map((detail) => `<li>${escapeHtml(detail)}</li>`).join("")}
          </ul>
          <p class="explore-benefit">${escapeHtml(item.benefit)}</p>
        </div>
      </article>
    `)
    .join("");
}

function bindEvents() {
  navButtons.forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.navTarget));
  });

  document.addEventListener("click", (event) => {
    const moodButton = event.target.closest(".mood-pill");
    if (moodButton) {
      selectedMoods[moodButton.dataset.moodType] = {
        emoji: moodButton.dataset.emoji,
        label: moodButton.dataset.label,
      };
      renderMoodGroups();
      return;
    }

    const exploreButton = event.target.closest(".explore-toggle");
    if (exploreButton) {
      exploreButton.closest(".explore-card").classList.toggle("open");
    }
  });

  energyRange.addEventListener("input", () => {
    energyValue.textContent = energyRange.value;
  });

  alcoholToggle.addEventListener("change", () => {
    drinksField.classList.toggle("hidden-soft", !alcoholToggle.checked);
  });

  mealForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const log = createLogFromForm(new FormData(mealForm));
    const logs = readLogs();
    logs.push(log);
    writeLogs(logs);
    mealForm.reset();
    energyRange.value = 7;
    energyValue.textContent = "7";
    selectedMoods = {
      before: moods[1],
      after: moods[2],
    };
    renderMoodGroups();
    drinksField.classList.add("hidden-soft");
    showToast(randomItem(successMessages));
    switchView("today");
  });

  todayList.addEventListener("change", (event) => {
    if (event.target.classList.contains("eaten-checkbox")) {
      const card = event.target.closest(".entry-card");
      toggleEaten(card.dataset.logId, event.target.checked);
    }
  });

  quickAddToggle.addEventListener("click", () => {
    quickAddForm.classList.toggle("hidden-soft");
  });

  quickAddForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = new FormData(quickAddForm).get("quickName").trim();
    if (name) {
      quickAdd(name);
      quickAddForm.reset();
      quickAddForm.classList.add("hidden-soft");
      showToast("Saved. Small notes count too.");
    }
  });

  insightsButton.addEventListener("click", getInsights);
}

function init() {
  quoteText.textContent = randomItem(quotes);
  renderMoodGroups();
  renderExplore();
  renderToday();
  updateInsightsState();
  bindEvents();
}

init();
