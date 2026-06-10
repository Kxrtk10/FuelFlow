const STORAGE_KEY = "fuelflow.logs";
const USER_KEY = "fuelflow_user";
const DEFAULT_MEALS_PER_DAY = 4;

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

const activityDescriptions = {
  "Sedentary": "Desk job, little to no exercise",
  "Light": "Light exercise 1-3 days/week",
  "Moderate": "Gym 3-4x/week, active lifestyle",
  "Active": "Hard training 6-7 days/week",
  "Very Active": "Athlete or twice-daily training",
};

const bodyTypes = [
  {
    key: "Ectomorph",
    description: "Naturally lean, hard to gain weight, fast metabolism",
    shape: "lean",
  },
  {
    key: "Mesomorph",
    description: "Athletic build, gains muscle easily, responds well to training",
    shape: "athletic",
  },
  {
    key: "Endomorph",
    description: "Broader build, gains weight easily, higher body fat tendency",
    shape: "broad",
  },
];

const bodyFatRanges = {
  Male: [
    { label: "Very Lean", range: "8-12%", mid: 10, shape: 0 },
    { label: "Lean", range: "13-17%", mid: 15, shape: 1 },
    { label: "Average", range: "18-22%", mid: 20, shape: 2 },
    { label: "Above Average", range: "23-27%", mid: 25, shape: 3 },
    { label: "High", range: "28-33%", mid: 30.5, shape: 4 },
    { label: "Very High", range: "34%+", mid: 34, shape: 5 },
  ],
  Female: [
    { label: "Very Lean", range: "15-19%", mid: 17, shape: 0 },
    { label: "Lean", range: "20-24%", mid: 22, shape: 1 },
    { label: "Average", range: "25-29%", mid: 27, shape: 2 },
    { label: "Above Average", range: "30-34%", mid: 32, shape: 3 },
    { label: "High", range: "35-39%", mid: 37, shape: 4 },
    { label: "Very High", range: "40%+", mid: 40, shape: 5 },
  ],
};

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
const homeHeading = document.querySelector("#homeHeading");
const homeSubheading = document.querySelector("#homeSubheading");
const journeyCard = document.querySelector("#journeyCard");
const homeProgress = document.querySelector("#homeProgress");
const macroProgressList = document.querySelector("#macroProgressList");
const profileCard = document.querySelector("#profileCard");
const navButtons = document.querySelectorAll("[data-nav-target]");
const views = document.querySelectorAll(".view");
const mealForm = document.querySelector("#mealForm");
const foodInsightCard = document.querySelector("#foodInsightCard");
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
const onboardingOverlay = document.querySelector("#onboardingOverlay");
const onboardingTrack = document.querySelector("#onboardingTrack");
const onboardingName = document.querySelector("#onboardingName");
const onboardingAge = document.querySelector("#onboardingAge");
const onboardingWeight = document.querySelector("#onboardingWeight");
const onboardingHeight = document.querySelector("#onboardingHeight");
const onboardingSex = document.querySelector("#onboardingSex");
const activityDescription = document.querySelector("#activityDescription");
const bodyTypeCards = document.querySelector("#bodyTypeCards");
const bodyFatCards = document.querySelector("#bodyFatCards");
const targetBodyFatCards = document.querySelector("#targetBodyFatCards");
const finishOnboarding = document.querySelector("#finishOnboarding");

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

function readUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

function writeUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function calculateDailyCalories(profile) {
  const weight = Number(profile.weight_kg || 0);
  const height = Number(profile.height_cm || 0);
  const age = Number(profile.age || 0);
  const sexAdjustment = profile.sex === "Female" ? -161 : 5;
  const bodyFatMid = Number(profile.body_fat_mid || 0);
  const leanBodyMass = bodyFatMid ? weight * (1 - (bodyFatMid / 100)) : 0;
  const bmr = leanBodyMass
    ? 370 + (21.6 * leanBodyMass)
    : (10 * weight) + (6.25 * height) - (5 * age) + sexAdjustment;
  const activityMultipliers = {
    "Sedentary": 1.2,
    "Light": 1.375,
    "Moderate": 1.55,
    "Active": 1.725,
    "Very Active": 1.9,
  };
  const goalAdjustments = {
    "Lose weight": -300,
    "Gain muscle": 300,
    "Maintain": 0,
    "Improve energy": 0,
    "Eat healthier": 0,
  };
  return Math.round(
    (bmr * (activityMultipliers[profile.activity_level] || 1.2)) +
    (goalAdjustments[profile.goal] || 0)
  );
}

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 10) {
    return "Good morning. How did you sleep? Let's start the day right.";
  }
  if (hour < 14) {
    return "Good afternoon. Have you logged your meals today?";
  }
  if (hour < 18) {
    return "Keep it going. You're doing great today.";
  }
  return "Evening check-in. How has your day been?";
}

function getUserProfileForApi() {
  const user = readUser();
  if (!user) {
    return {};
  }
  return {
    name: user.name,
    goal: user.goal,
    activity_level: user.activity_level,
    daily_calories: user.daily_calories,
    body_fat_mid: user.body_fat_mid,
  };
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

  if (viewName === "home") {
    renderHomePersonalization();
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

function renderHomePersonalization() {
  const user = readUser();
  if (!user) {
    homeHeading.textContent = "Food is fuel. Feelings matter.";
    homeSubheading.textContent = "Track what you eat and how it makes you feel. No shame. No harsh rules. Just clarity.";
    homeProgress.classList.add("hidden-soft");
    journeyCard.classList.add("hidden-soft");
    profileCard.classList.add("hidden-soft");
    return;
  }

  homeHeading.textContent = `Hey ${user.name}! 🔥`;
  homeSubheading.textContent = getTimeGreeting();
  renderJourneyCard();
  renderHomeProgress();
  renderProfileCard();
}

function getBodyFatShape(mid) {
  const value = Number(mid || 0);
  if (value <= 17) return 0;
  if (value <= 22) return 1;
  if (value <= 27) return 2;
  if (value <= 32) return 3;
  if (value <= 37) return 4;
  return 5;
}

function getSilhouetteSvg(shape = 2, label = "body") {
  const widths = [
    { shoulder: 16, waist: 13, hip: 15 },
    { shoulder: 19, waist: 15, hip: 17 },
    { shoulder: 22, waist: 18, hip: 20 },
    { shoulder: 24, waist: 21, hip: 23 },
    { shoulder: 27, waist: 25, hip: 27 },
    { shoulder: 30, waist: 29, hip: 30 },
  ][shape] || { shoulder: 22, waist: 18, hip: 20 };
  const leftShoulder = 50 - widths.shoulder;
  const rightShoulder = 50 + widths.shoulder;
  const leftWaist = 50 - widths.waist;
  const rightWaist = 50 + widths.waist;
  const leftHip = 50 - widths.hip;
  const rightHip = 50 + widths.hip;

  return `
    <svg viewBox="0 0 100 120" role="img" aria-label="${escapeHtml(label)}">
      <defs>
        <linearGradient id="bodyGrad${shape}" x1="50" y1="18" x2="50" y2="112" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FFD700"/>
          <stop offset="55%" stop-color="#FF8C00"/>
          <stop offset="100%" stop-color="#FF4500"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="16" r="10" fill="url(#bodyGrad${shape})"/>
      <path d="M${leftShoulder} 34 C${leftWaist} 48 ${leftWaist} 70 ${leftHip} 92 C${leftHip + 7} 104 ${rightHip - 7} 104 ${rightHip} 92 C${rightWaist} 70 ${rightWaist} 48 ${rightShoulder} 34 C${rightShoulder - 8} 28 ${leftShoulder + 8} 28 ${leftShoulder} 34Z" fill="url(#bodyGrad${shape})"/>
      <path d="M42 96 L38 116 M58 96 L62 116" stroke="#FF8C00" stroke-width="7" stroke-linecap="round"/>
      <path d="M${leftShoulder + 2} 42 L20 68 M${rightShoulder - 2} 42 L80 68" stroke="#FF7000" stroke-width="6" stroke-linecap="round"/>
    </svg>
  `;
}

function renderJourneyCard() {
  const user = readUser();
  if (!user?.body_fat_mid || !user?.target_body_fat_mid) {
    journeyCard.classList.add("hidden-soft");
    return;
  }

  const diff = Math.abs(Number(user.body_fat_mid) - Number(user.target_body_fat_mid));
  const estimatedKgChange = Math.max(1, Math.round((user.weight_kg || 70) * (diff / 100)));
  const weeks = Math.max(1, Math.ceil(estimatedKgChange / 0.5));
  const direction = user.target_body_fat_mid < user.body_fat_mid ? "deficit" : "surplus";
  journeyCard.innerHTML = `
    <p class="eyebrow flame">Your Journey</p>
    <h3>Small steps, visible direction</h3>
    <div class="journey-preview">
      <div class="journey-body">${getSilhouetteSvg(getBodyFatShape(user.body_fat_mid), "current body")}<span>Current</span></div>
      <div class="journey-arrow">→</div>
      <div class="journey-body">${getSilhouetteSvg(getBodyFatShape(user.target_body_fat_mid), "target body")}<span>Target</span></div>
    </div>
    <p>From <strong>${escapeHtml(user.body_fat_range)}</strong> → <strong>${escapeHtml(user.target_body_fat_range)}</strong> body fat</p>
    <p>At your current ${direction}, you could reach your goal in ~${weeks} weeks.</p>
  `;
  journeyCard.classList.remove("hidden-soft");
}

function renderProfileCard() {
  const user = readUser();
  if (!user) {
    profileCard.classList.add("hidden-soft");
    return;
  }

  profileCard.innerHTML = `
    <p class="eyebrow flame">Your Profile</p>
    <div class="profile-grid">
      <div class="profile-item">Name <span class="profile-value">${escapeHtml(user.name)}</span></div>
      <div class="profile-item">Goal <span class="profile-value">${escapeHtml(user.goal)}</span></div>
      <div class="profile-item">Body type <span class="profile-value">${escapeHtml(user.body_type || "Not set")}</span></div>
      <div class="profile-item">Estimated body fat <span class="profile-value">${escapeHtml(user.body_fat_range || "Not set")}</span></div>
      <div class="profile-item">Daily target <span class="profile-value">${escapeHtml(user.daily_calories)} kcal</span></div>
    </div>
    <button id="editProfileButton" class="profile-edit" type="button">Edit</button>
  `;
  profileCard.classList.remove("hidden-soft");
}

function renderHomeProgress() {
  const user = readUser();
  if (!user?.daily_calories) {
    homeProgress.classList.add("hidden-soft");
    return;
  }

  const todaysLogs = readLogs().filter((log) => isToday(log.timestamp));
  const mealsPerDay = user.meals_per_day || DEFAULT_MEALS_PER_DAY;
  const loggedCalories = Math.round(todaysLogs.length * (user.daily_calories / mealsPerDay));
  const proteinTarget = Math.round((user.daily_calories * 0.25) / 4);
  const carbsTarget = Math.round((user.daily_calories * 0.5) / 4);
  const fatTarget = Math.round((user.daily_calories * 0.25) / 9);
  const proteinLogged = Math.round((loggedCalories * 0.25) / 4);
  const carbsLogged = Math.round((loggedCalories * 0.5) / 4);
  const fatLogged = Math.round((loggedCalories * 0.25) / 9);
  const rows = [
    { label: "Calories", logged: loggedCalories, target: user.daily_calories, unit: "kcal" },
    { label: "Protein", logged: proteinLogged, target: proteinTarget, unit: "g" },
    { label: "Carbs", logged: carbsLogged, target: carbsTarget, unit: "g" },
    { label: "Fat", logged: fatLogged, target: fatTarget, unit: "g" },
  ];

  macroProgressList.innerHTML = rows.map((row) => {
    const percent = Math.min(100, Math.round((row.logged / row.target) * 100) || 0);
    return `
      <div class="macro-progress-row">
        <div class="macro-progress-top">
          <span>${escapeHtml(row.label)}</span>
          <span>${escapeHtml(row.logged)} / ${escapeHtml(row.target)} ${escapeHtml(row.unit)}</span>
        </div>
        <div class="macro-progress-track">
          <div class="macro-progress-fill" style="width: ${percent}%"></div>
        </div>
      </div>
    `;
  }).join("");
  homeProgress.classList.remove("hidden-soft");
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
  renderHomeProgress();
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
      body: JSON.stringify({ logs, user_profile: getUserProfileForApi() }),
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

let onboardingStep = 0;
let onboardingSelections = {
  goal: "Lose weight",
  activity_level: "Sedentary",
  body_type: "Ectomorph",
  body_fat_range: "",
  body_fat_mid: 0,
  target_body_fat_range: "",
  target_body_fat_mid: 0,
};

function setOnboardingStep(step) {
  onboardingStep = step;
  onboardingTrack.style.transform = `translateX(-${step * 16.667}%)`;
  if (step === 3) {
    renderBodyTypeCards();
  }
  if (step === 4) {
    renderBodyFatCards();
  }
  if (step === 5) {
    renderTargetBodyFatCards();
  }
}

function showOnboardingIfNeeded() {
  if (!readUser()) {
    onboardingOverlay.classList.remove("hidden-soft");
    setOnboardingStep(0);
  }
}

function renderBodyTypeCards() {
  bodyTypeCards.innerHTML = bodyTypes.map((type) => {
    const shape = type.shape === "lean" ? 0 : type.shape === "athletic" ? 1 : 4;
    return `
      <button class="visual-card ${onboardingSelections.body_type === type.key ? "selected" : ""}" type="button" data-body-type="${escapeHtml(type.key)}">
        ${getSilhouetteSvg(shape, type.key)}
        <strong>${escapeHtml(type.key)}</strong>
        <span>${escapeHtml(type.description)}</span>
      </button>
    `;
  }).join("");
}

function getBodyFatOptions() {
  return bodyFatRanges[onboardingSex.value] || bodyFatRanges.Male;
}

function renderBodyFatCards() {
  const options = getBodyFatOptions();
  if (!onboardingSelections.body_fat_range) {
    onboardingSelections.body_fat_range = options[2].range;
    onboardingSelections.body_fat_mid = options[2].mid;
  }
  bodyFatCards.innerHTML = options.map((option) => `
    <button class="visual-card ${onboardingSelections.body_fat_range === option.range ? "selected" : ""}" type="button" data-body-fat-range="${escapeHtml(option.range)}" data-body-fat-mid="${escapeHtml(option.mid)}">
      ${getSilhouetteSvg(option.shape, option.label)}
      <strong>${escapeHtml(option.label)}</strong>
      <small>${escapeHtml(option.range)}</small>
    </button>
  `).join("");
}

function getAllowedTargetIndexes(options) {
  const goal = onboardingSelections.goal;
  if (goal === "Maintain") {
    return options.map((_, index) => index);
  }
  if (goal === "Gain muscle") {
    return [1, 2].filter((index) => options[index]);
  }
  if (goal === "Lose weight" || goal === "Improve energy") {
    return [0, 1, 2].filter((index) => options[index]);
  }
  return options.map((_, index) => index);
}

function renderTargetBodyFatCards() {
  const options = getBodyFatOptions();
  const allowed = getAllowedTargetIndexes(options);
  if (onboardingSelections.goal === "Maintain") {
    onboardingSelections.target_body_fat_range = onboardingSelections.body_fat_range || options[2].range;
    onboardingSelections.target_body_fat_mid = onboardingSelections.body_fat_mid || options[2].mid;
  } else if (!onboardingSelections.target_body_fat_range || !allowed.some((index) => options[index].range === onboardingSelections.target_body_fat_range)) {
    const defaultOption = options[allowed[0] ?? 2];
    onboardingSelections.target_body_fat_range = defaultOption.range;
    onboardingSelections.target_body_fat_mid = defaultOption.mid;
  }

  targetBodyFatCards.innerHTML = options.map((option, index) => {
    const disabled = !allowed.includes(index);
    return `
      <button class="visual-card ${onboardingSelections.target_body_fat_range === option.range ? "selected" : ""} ${disabled ? "disabled" : ""}" type="button" data-target-body-fat-range="${escapeHtml(option.range)}" data-target-body-fat-mid="${escapeHtml(option.mid)}" ${disabled ? "disabled" : ""}>
        ${getSilhouetteSvg(option.shape, option.label)}
        <strong>${escapeHtml(option.label)}</strong>
        <small>${escapeHtml(option.range)}</small>
      </button>
    `;
  }).join("");
}

function finishUserOnboarding() {
  const profile = {
    name: onboardingName.value.trim() || "friend",
    age: Number(onboardingAge.value || 0),
    weight_kg: Number(onboardingWeight.value || 0),
    height_cm: Number(onboardingHeight.value || 0),
    sex: onboardingSex.value,
    goal: onboardingSelections.goal,
    activity_level: onboardingSelections.activity_level,
    body_type: onboardingSelections.body_type,
    body_fat_range: onboardingSelections.body_fat_range,
    body_fat_mid: onboardingSelections.body_fat_mid,
    target_body_fat_range: onboardingSelections.target_body_fat_range,
    target_body_fat_mid: onboardingSelections.target_body_fat_mid,
    meals_per_day: DEFAULT_MEALS_PER_DAY,
  };
  profile.daily_calories = calculateDailyCalories(profile);
  writeUser(profile);
  onboardingOverlay.classList.add("hidden-soft");
  renderHomePersonalization();
}

function renderFoodInsightCard(log, insight) {
  const isGood = Boolean(insight.good_for_goal);
  foodInsightCard.classList.remove("hidden-soft", "fading");
  foodInsightCard.innerHTML = `
    <h3>${escapeHtml(log.mealName)}</h3>
    <p>${escapeHtml(insight.what_it_does || "This meal gives your body useful energy and helps you notice what supports your day.")}</p>
    <span class="goal-badge ${isGood ? "good" : "okay"}">${isGood ? "Great for your goal" : "Okay for your goal"}</span>
    <p class="up-next">Up next: ${escapeHtml(insight.next_suggestion || "Add water and a protein-rich option later.")}</p>
  `;

  window.setTimeout(() => {
    foodInsightCard.classList.add("fading");
  }, 7600);
  window.setTimeout(() => {
    foodInsightCard.classList.add("hidden-soft");
    foodInsightCard.classList.remove("fading");
  }, 8000);
}

async function getFoodInsight(log) {
  const user = readUser() || {};
  try {
    const response = await fetch("/api/food-insight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        food_name: log.mealName,
        goal: user.goal || "",
        activity_level: user.activity_level || "",
      }),
    });

    if (!response.ok) {
      throw new Error("Food insight paused.");
    }

    renderFoodInsightCard(log, await response.json());
  } catch {
    renderFoodInsightCard(log, {
      what_it_does: "This meal gives your body useful energy and another data point for your patterns. Notice how your energy feels over the next hour.",
      good_for_goal: true,
      next_suggestion: "Pair your next meal with protein and water for steady energy.",
    });
  }
}

function bindEvents() {
  navButtons.forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.navTarget));
  });

  document.addEventListener("click", (event) => {
    const moodButton = event.target.closest(".mood-pill");
    if (moodButton && !moodButton.closest(".onboarding-pills")) {
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
      return;
    }

    const onboardingPill = event.target.closest(".onboarding-pills .mood-pill");
    if (onboardingPill) {
      const group = onboardingPill.closest(".onboarding-pills");
      group.querySelectorAll(".mood-pill").forEach((button) => {
        button.classList.toggle("active", button === onboardingPill);
      });
      onboardingSelections[group.dataset.onboardingGroup] = onboardingPill.dataset.value;
      if (group.dataset.onboardingGroup === "activity_level") {
        activityDescription.textContent = activityDescriptions[onboardingPill.dataset.value];
      }
      if (group.dataset.onboardingGroup === "goal") {
        onboardingSelections.target_body_fat_range = "";
        onboardingSelections.target_body_fat_mid = 0;
      }
      return;
    }

    const bodyTypeCard = event.target.closest("[data-body-type]");
    if (bodyTypeCard) {
      onboardingSelections.body_type = bodyTypeCard.dataset.bodyType;
      renderBodyTypeCards();
      return;
    }

    const bodyFatCard = event.target.closest("[data-body-fat-range]");
    if (bodyFatCard) {
      onboardingSelections.body_fat_range = bodyFatCard.dataset.bodyFatRange;
      onboardingSelections.body_fat_mid = Number(bodyFatCard.dataset.bodyFatMid);
      onboardingSelections.target_body_fat_range = "";
      onboardingSelections.target_body_fat_mid = 0;
      renderBodyFatCards();
      return;
    }

    const targetBodyFatCard = event.target.closest("[data-target-body-fat-range]");
    if (targetBodyFatCard && !targetBodyFatCard.disabled) {
      onboardingSelections.target_body_fat_range = targetBodyFatCard.dataset.targetBodyFatRange;
      onboardingSelections.target_body_fat_mid = Number(targetBodyFatCard.dataset.targetBodyFatMid);
      renderTargetBodyFatCards();
      return;
    }

    const editProfileButton = event.target.closest("#editProfileButton");
    if (editProfileButton) {
      localStorage.removeItem(USER_KEY);
      onboardingSelections = {
        goal: "Lose weight",
        activity_level: "Sedentary",
        body_type: "Ectomorph",
        body_fat_range: "",
        body_fat_mid: 0,
        target_body_fat_range: "",
        target_body_fat_mid: 0,
      };
      renderHomePersonalization();
      showOnboardingIfNeeded();
    }
  });

  energyRange.addEventListener("input", () => {
    energyValue.textContent = energyRange.value;
  });

  alcoholToggle.addEventListener("change", () => {
    drinksField.classList.toggle("hidden-soft", !alcoholToggle.checked);
  });

  onboardingSex.addEventListener("change", () => {
    onboardingSelections.body_fat_range = "";
    onboardingSelections.body_fat_mid = 0;
    onboardingSelections.target_body_fat_range = "";
    onboardingSelections.target_body_fat_mid = 0;
    renderBodyFatCards();
    renderTargetBodyFatCards();
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
    renderToday();
    renderHomeProgress();
    getFoodInsight(log);
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

  document.querySelectorAll(".onboarding-next").forEach((button) => {
    button.addEventListener("click", () => {
      setOnboardingStep(Math.min(5, onboardingStep + 1));
    });
  });

  finishOnboarding.addEventListener("click", finishUserOnboarding);
}

function init() {
  quoteText.textContent = randomItem(quotes);
  renderMoodGroups();
  renderExplore();
  renderToday();
  renderHomePersonalization();
  updateInsightsState();
  bindEvents();
  showOnboardingIfNeeded();
}

init();
