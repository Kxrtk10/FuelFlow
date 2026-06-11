const USER_KEY = "fuelflow_user";
const TOKEN_KEY = "fuelflow_token";
const USER_ID_KEY = "fuelflow_user_id";
const EMAIL_KEY = "fuelflow_email";
const THEME_KEY = "fuelflow_theme";
const SIZZLE_KEY = "fuelflow_sizzle_history";
const CHAT_SESSIONS_KEY = "fuelflow_chat_sessions";
const STREAK_KEY = "fuelflow_streak";
const DAILY_MOOD_KEY = "fuelflow_daily_mood";
const DAILY_MOOD_DISMISS_KEY = "fuelflow_daily_mood_dismissed";
const MEAL_PLAN_KEY = "fuelflow_meal_plan";
const PLAN_SELECTIONS_KEY = "fuelflow_plan_selections";
const GROCERY_CHECKS_KEY = "fuelflow_grocery_checks";
const WEIGHT_HISTORY_KEY = "fuelflow_weight_history";
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

const dailyQuotes = [
  "Discipline is choosing between what you want now and what you want most.",
  "Your body hears everything your mind says. Feed both well.",
  "Progress, not perfection. Every single day.",
  "The people who transform are the ones who show up on the hard days.",
  "One meal at a time. One day at a time. One version better.",
  "You didn't come this far to only come this far.",
  "Your future self is watching. Make them proud.",
  "Transformation isn't a destination. It's a daily decision.",
  "Eat like you love yourself. Move like you love yourself. Think like you love yourself.",
  "The strongest thing you can do is stay consistent when nobody's watching.",
  "Food is medicine. Choose your prescription.",
  "Every time you choose your goal over your craving, you become stronger.",
  "You are not starting over. You are starting again with more experience.",
  "Small steps every day. Big transformation over time.",
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

const planTypeDescriptions = {
  "Cut": "Calorie deficit — lose fat while preserving muscle",
  "Bulk": "Calorie surplus — maximize muscle growth",
  "Lean Bulk": "Slight surplus — slow muscle gain, minimal fat",
  "Recomp": "Maintenance calories — lose fat and gain muscle simultaneously",
  "Maintain": "Stay exactly where you are, improve food quality",
};

const planLoadingMessages = [
  "Calculating your macros...",
  "Picking the best foods for your goal...",
  "Making sure biryani fits in somewhere...",
  "Almost ready — your transformation starts now...",
];

const exploreItems = [
  {
    icon: "💛",
    title: "Feeling Low? Read This 💛",
    description: "A warm note for the days when food, energy, or progress feels complicated.",
    highlight: true,
    intro: "Whatever brought you here today — you're in the right place. FuelFlow doesn't judge. We walk this with you.",
    stories: [
      {
        name: "Story 1 — Priya, 24",
        text: "I used to skip meals to lose weight faster. I was exhausted and miserable. Understanding how food actually works changed everything. Down 8kg, zero starvation.",
      },
      {
        name: "Story 2 — Arjun, 28",
        text: "98kg and every diet felt like punishment. Tracking how food made me FEEL instead of just counting calories was the switch. Still eating biryani on weekends.",
      },
      {
        name: "Story 3 — Meera, 31",
        text: "I feared food for years. The no-guilt approach here genuinely rewired something. I enjoy eating now. That's everything.",
      },
    ],
    closing: "You didn't fail. You're still learning. Keep going. 💛",
    note: "Stories are illustrative and represent common experiences.",
  },
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
const authView = document.querySelector("#authView");
const loginView = document.querySelector("#loginView");
const signupView = document.querySelector("#signupView");
const loginEmail = document.querySelector("#loginEmail");
const loginPassword = document.querySelector("#loginPassword");
const loginError = document.querySelector("#loginError");
const loginButton = document.querySelector("#loginButton");
const signupEmail = document.querySelector("#signupEmail");
const signupPassword = document.querySelector("#signupPassword");
const signupConfirmPassword = document.querySelector("#signupConfirmPassword");
const signupError = document.querySelector("#signupError");
const signupButton = document.querySelector("#signupButton");
const showSignupButton = document.querySelector("#showSignupButton");
const showLoginButton = document.querySelector("#showLoginButton");
const mainApp = document.querySelector("#mainApp");
const bottomNav = document.querySelector("#bottomNav");
const homeHeading = document.querySelector("#homeHeading");
const homeSubheading = document.querySelector("#homeSubheading");
const homeMotivation = document.querySelector("#homeMotivation");
const streakText = document.querySelector("#streakText");
const dailyQuoteText = document.querySelector("#dailyQuoteText");
const dailyMoodCheckIn = document.querySelector("#dailyMoodCheckIn");
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
const sizzleMessages = document.querySelector("#sizzleMessages");
const sizzleForm = document.querySelector("#sizzleForm");
const sizzleInput = document.querySelector("#sizzleInput");
const clearSizzleChat = document.querySelector("#clearSizzleChat");
const previousChatsButton = document.querySelector("#previousChatsButton");
const chatSessionsDropdown = document.querySelector("#chatSessionsDropdown");
const backToCurrentChat = document.querySelector("#backToCurrentChat");
const exploreGrid = document.querySelector("#exploreGrid");
const planSetup = document.querySelector("#planSetup");
const planDisplay = document.querySelector("#planDisplay");
const mealPlanForm = document.querySelector("#mealPlanForm");
const planMealsPerDay = document.querySelector("#planMealsPerDay");
const planTypeDescription = document.querySelector("#planTypeDescription");
const planLoading = document.querySelector("#planLoading");
const planLoadingMessage = document.querySelector("#planLoadingMessage");
const generateMealPlanButton = document.querySelector("#generateMealPlanButton");
const settingsProfile = document.querySelector("#settingsProfile");
const themeFiery = document.querySelector("#themeFiery");
const themeOcean = document.querySelector("#themeOcean");
const logoutConfirmMessage = document.querySelector("#logoutConfirmMessage");
const settingsLogoutButton = document.querySelector("#settingsLogoutButton");
const exportLogsButton = document.querySelector("#exportLogsButton");
const resetAllDataButton = document.querySelector("#resetAllDataButton");
const toast = document.querySelector("#toast");
const onboardingOverlay = document.querySelector("#onboardingOverlay");
const onboardingTrack = document.querySelector("#onboardingTrack");
const onboardingName = document.querySelector("#onboardingName");
const onboardingAge = document.querySelector("#onboardingAge");
const onboardingWeight = document.querySelector("#onboardingWeight");
const onboardingHeight = document.querySelector("#onboardingHeight");
const onboardingSex = document.querySelector("#onboardingSex");
const activityDescription = document.querySelector("#activityDescription");
const foodRelationshipMessage = document.querySelector("#foodRelationshipMessage");
const bodyTypeCards = document.querySelector("#bodyTypeCards");
const bodyFatCards = document.querySelector("#bodyFatCards");
const targetBodyFatCards = document.querySelector("#targetBodyFatCards");
const finishOnboarding = document.querySelector("#finishOnboarding");

let selectedMoods = {
  before: moods[1],
  after: moods[2],
};

let logsCache = [];
let logoutArmed = false;
let onboardingMode = "full";
let viewingArchivedChat = false;
let archivedChatMessages = [];
let planSelections = {
  plan_type: "Cut",
  food_preference: "Vegetarian",
  cuisine: ["Indian"],
  budget: "Under ₹100",
  sport: "General fitness",
  alcohol_frequency: "I don't drink",
};
let selectedPlanDay = 0;
let planLoadingTimer = null;

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setAuth(token, userId, email = "") {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_ID_KEY, userId);
  if (email) {
    localStorage.setItem(EMAIL_KEY, email);
  }
}

function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(EMAIL_KEY);
  localStorage.removeItem(SIZZLE_KEY);
  logsCache = [];
}

function clearAllLocalData() {
  localStorage.clear();
  logsCache = [];
}

async function apiFetch(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(path, { ...options, headers });
  if (response.status === 401) {
    clearAuth();
    showAuth("login");
    throw new Error("Please log in again.");
  }
  return response;
}

function readLogs() {
  return logsCache;
}

async function writeLogs(logs) {
  logsCache = logs;
  await saveLogsToServer();
  if (streakText && dailyQuoteText) {
    updateStreakDisplay();
  }
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

function applyTheme(theme = "fiery") {
  const selectedTheme = theme === "ocean" ? "ocean" : "fiery";
  document.body.classList.toggle("theme-ocean", selectedTheme === "ocean");
  localStorage.setItem(THEME_KEY, selectedTheme);
  themeFiery?.classList.toggle("active", selectedTheme === "fiery");
  themeOcean?.classList.toggle("active", selectedTheme === "ocean");
}

async function saveProfileToServer(profile) {
  if (!getToken()) return;
  await apiFetch("/api/profile/save", {
    method: "POST",
    body: JSON.stringify({ profile_data: profile }),
  });
}

async function loadProfileFromServer() {
  const response = await apiFetch("/api/profile/get");
  if (!response.ok) return null;
  const data = await response.json();
  if (data.profile_data) {
    writeUser(data.profile_data);
  }
  return data.profile_data;
}

async function saveLogsToServer() {
  if (!getToken()) return;
  await apiFetch("/api/logs/save", {
    method: "POST",
    body: JSON.stringify({ logs: logsCache }),
  });
}

async function loadLogsFromServer() {
  const response = await apiFetch("/api/logs/get");
  if (!response.ok) {
    logsCache = [];
    return;
  }
  const data = await response.json();
  logsCache = data.logs || [];
}

function readMealPlan() {
  try {
    return JSON.parse(localStorage.getItem(MEAL_PLAN_KEY));
  } catch {
    return null;
  }
}

function writeMealPlan(plan) {
  localStorage.setItem(MEAL_PLAN_KEY, JSON.stringify(plan));
}

function writePlanSelections() {
  localStorage.setItem(PLAN_SELECTIONS_KEY, JSON.stringify({
    ...planSelections,
    meals_per_day: Number(planMealsPerDay.value || DEFAULT_MEALS_PER_DAY),
  }));
}

function restorePlanSelections() {
  try {
    const saved = JSON.parse(localStorage.getItem(PLAN_SELECTIONS_KEY));
    if (!saved) return;
    planSelections = {
      ...planSelections,
      ...saved,
      cuisine: Array.isArray(saved.cuisine) ? saved.cuisine : String(saved.cuisine || "Indian").split(", "),
    };
    planMealsPerDay.value = saved.meals_per_day || DEFAULT_MEALS_PER_DAY;
    document.querySelectorAll(".plan-pills").forEach((group) => {
      const key = group.dataset.planGroup;
      const selected = planSelections[key];
      group.querySelectorAll(".mood-pill").forEach((button) => {
        button.classList.toggle("active", Array.isArray(selected) ? selected.includes(button.dataset.value) : selected === button.dataset.value);
      });
    });
    planTypeDescription.textContent = planTypeDescriptions[planSelections.plan_type];
  } catch {
    localStorage.removeItem(PLAN_SELECTIONS_KEY);
  }
}

function readGroceryChecks() {
  try {
    return JSON.parse(localStorage.getItem(GROCERY_CHECKS_KEY)) || {};
  } catch {
    return {};
  }
}

function writeGroceryChecks(checks) {
  localStorage.setItem(GROCERY_CHECKS_KEY, JSON.stringify(checks));
}

async function savePlanToServer(plan) {
  if (!getToken()) return;
  await apiFetch("/api/plan/save", {
    method: "POST",
    body: JSON.stringify({ plan_data: plan }),
  });
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
    body_type: user.body_type,
    body_fat_range: user.body_fat_range,
    body_fat_mid: user.body_fat_mid,
    target_body_fat_range: user.target_body_fat_range,
    target_body_fat_mid: user.target_body_fat_mid,
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
    renderSizzleMessages();
  }

  if (viewName === "settings") {
    renderSettings();
  }

  if (viewName === "plan") {
    renderMealPlanView();
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
    dailyMood: readDailyMoodData()[getTodayKey()]?.mood || "",
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

function dateKey(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTodayKey() {
  return dateKey(new Date().toISOString());
}

function getDailyQuote() {
  const dayNumber = Math.floor(Date.now() / 86400000);
  return dailyQuotes[dayNumber % dailyQuotes.length];
}

function calculateStreak(logs) {
  const loggedDays = new Set(logs.map((log) => dateKey(log.timestamp)));
  const cursor = new Date();
  let streak = 0;

  while (loggedDays.has(dateKey(cursor.toISOString()))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  localStorage.setItem(STREAK_KEY, String(streak));
  return streak;
}

function updateStreakDisplay() {
  const logs = readLogs();
  const streak = calculateStreak(logs);
  const hasLoggedToday = logs.some((log) => dateKey(log.timestamp) === getTodayKey());

  if (!hasLoggedToday || streak === 0) {
    streakText.textContent = "Start today's streak 🔥";
  } else if (streak >= 30) {
    streakText.textContent = `🔥 ${streak} days — this is who you are now`;
  } else if (streak >= 7) {
    streakText.textContent = `🔥 ${streak} day streak — you're on fire`;
  } else {
    streakText.textContent = `🔥 ${streak} day streak — keep it burning`;
  }

  dailyQuoteText.textContent = getDailyQuote();
}

function readDailyMoodData() {
  try {
    return JSON.parse(localStorage.getItem(DAILY_MOOD_KEY)) || {};
  } catch {
    return {};
  }
}

function renderDailyMoodCheckIn() {
  const today = getTodayKey();
  const dismissedDate = localStorage.getItem(DAILY_MOOD_DISMISS_KEY);
  dailyMoodCheckIn.classList.toggle("hidden-soft", dismissedDate === today);
}

async function saveDailyMood(mood) {
  const today = getTodayKey();
  const moodData = readDailyMoodData();
  moodData[today] = {
    mood,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(DAILY_MOOD_KEY, JSON.stringify(moodData));
  localStorage.setItem(DAILY_MOOD_DISMISS_KEY, today);
  if (readLogs().some((log) => dateKey(log.timestamp) === today)) {
    const logs = readLogs().map((log) => {
      return dateKey(log.timestamp) === today ? { ...log, dailyMood: mood } : log;
    });
    await writeLogs(logs);
  }
  dailyMoodCheckIn.classList.add("hidden-soft");
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
    homeMotivation.classList.add("hidden-soft");
    dailyMoodCheckIn.classList.add("hidden-soft");
    homeProgress.classList.add("hidden-soft");
    journeyCard.classList.add("hidden-soft");
    profileCard.classList.add("hidden-soft");
    return;
  }

  homeHeading.textContent = `Hey ${user.name}! 🔥`;
  homeSubheading.textContent = getTimeGreeting();
  homeMotivation.classList.remove("hidden-soft");
  updateStreakDisplay();
  renderDailyMoodCheckIn();
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
  return getBodyFatSvg(shape, readUser()?.sex || onboardingSex?.value || "Male", label);
}

function svgDefs(id, colors = ["#FFD000", "#FF7000", "#FF2200"]) {
  return `
    <defs>
      <linearGradient id="${id}" x1="40" y1="8" x2="40" y2="118" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="${colors[0]}"/>
        <stop offset="52%" stop-color="${colors[1]}"/>
        <stop offset="100%" stop-color="${colors[2]}"/>
      </linearGradient>
    </defs>
  `;
}

function getBodyTypeSvg(type) {
  const id = `typeGrad${type}`;
  if (type === "Ectomorph") {
    return `
      <svg viewBox="0 0 80 120" role="img" aria-label="Ectomorph body type">
        ${svgDefs(id)}
        <circle cx="40" cy="13" r="8" fill="url(#${id})"/>
        <path d="M31 30 C32 24 48 24 49 30 L46 78 C45 89 35 89 34 78 Z" fill="url(#${id})"/>
        <path d="M31 35 L20 74 M49 35 L60 74" stroke="#FF8C00" stroke-width="5" stroke-linecap="round"/>
        <path d="M35 82 L30 116 M45 82 L50 116" stroke="#FF8C00" stroke-width="5" stroke-linecap="round"/>
      </svg>
    `;
  }
  if (type === "Mesomorph") {
    return `
      <svg viewBox="0 0 80 120" role="img" aria-label="Mesomorph body type">
        ${svgDefs(id)}
        <circle cx="40" cy="13" r="9" fill="url(#${id})"/>
        <path d="M20 32 C27 22 53 22 60 32 L51 78 C49 91 31 91 29 78 Z" fill="url(#${id})"/>
        <path d="M22 36 C15 47 14 62 20 74 M58 36 C65 47 66 62 60 74" stroke="#FF7000" stroke-width="8" stroke-linecap="round"/>
        <path d="M34 82 L29 116 M46 82 L51 116" stroke="#FF8C00" stroke-width="7" stroke-linecap="round"/>
        <path d="M31 43 H49 M34 53 H46 M35 63 H45 M40 43 V72" stroke="#4A1600" stroke-width="2" stroke-linecap="round" opacity="0.75"/>
      </svg>
    `;
  }
  return `
    <svg viewBox="0 0 80 120" role="img" aria-label="Endomorph body type">
      ${svgDefs(id, ["#FFB000", "#FF7A00", "#C65300"])}
      <circle cx="40" cy="14" r="10" fill="url(#${id})"/>
      <path d="M18 35 C22 22 58 22 62 35 C70 60 63 91 40 95 C17 91 10 60 18 35Z" fill="url(#${id})"/>
      <path d="M20 42 C12 55 12 70 20 82 M60 42 C68 55 68 70 60 82" stroke="#FF7A00" stroke-width="9" stroke-linecap="round"/>
      <path d="M33 91 L28 116 M47 91 L52 116" stroke="#FF8C00" stroke-width="9" stroke-linecap="round"/>
    </svg>
  `;
}

function getBodyFatSvg(shape = 2, sex = "Male", label = "body") {
  const female = sex === "Female";
  const id = `bfGrad${sex}${shape}`.replace(/\W/g, "");
  const palette = shape <= 1
    ? ["#FFD000", "#FF7000", "#FF2200"]
    : shape <= 3
      ? ["#FFC247", "#FF8C00", "#D85B00"]
      : ["#D98D2B", "#B96516", "#7C3F10"];
  const maleBodies = [
    "M17 31 L28 24 H52 L63 31 L54 78 L47 94 H33 L26 78 Z",
    "M19 32 C26 24 54 24 61 32 L53 78 C51 91 29 91 27 78 Z",
    "M21 34 C27 27 53 27 59 34 L56 79 C52 94 28 94 24 79 Z",
    "M19 35 C24 26 56 26 61 35 C67 58 61 88 40 92 C19 88 13 58 19 35Z",
    "M17 36 C20 25 60 25 63 36 C72 62 64 96 40 99 C16 96 8 62 17 36Z",
    "M14 38 C17 24 63 24 66 38 C77 66 67 103 40 106 C13 103 3 66 14 38Z",
  ];
  const femaleBodies = [
    "M23 33 C29 24 51 24 57 33 L52 63 C61 72 60 90 47 95 H33 C20 90 19 72 28 63 Z",
    "M22 33 C28 25 52 25 58 33 L53 65 C62 75 59 92 47 96 H33 C21 92 18 75 27 65 Z",
    "M21 34 C27 27 53 27 59 34 C57 48 55 61 58 73 C63 89 53 100 40 100 C27 100 17 89 22 73 C25 61 23 48 21 34Z",
    "M19 36 C24 27 56 27 61 36 C65 53 64 74 58 89 C52 101 28 101 22 89 C16 74 15 53 19 36Z",
    "M17 37 C21 27 59 27 63 37 C71 61 66 96 40 102 C14 96 9 61 17 37Z",
    "M14 39 C17 26 63 26 66 39 C77 68 69 106 40 109 C11 106 3 68 14 39Z",
  ];
  const bodyPath = female ? femaleBodies[shape] : maleBodies[shape];
  const definition = shape === 0
    ? `<path d="M30 42 H50 M32 53 H48 M34 64 H46 M40 42 V76 M27 37 C32 42 35 42 39 38 M41 38 C45 42 48 42 53 37 M28 78 L52 78" stroke="#451200" stroke-width="2" stroke-linecap="round" opacity="0.85"/>`
    : shape === 1
      ? `<path d="M31 43 H49 M34 56 H46 M35 67 H45 M40 45 V73 M29 38 C34 42 37 42 39 39 M41 39 C43 42 46 42 51 38" stroke="#552000" stroke-width="1.7" stroke-linecap="round" opacity="0.62"/>`
      : shape === 2
        ? `<path d="M30 43 C35 47 45 47 50 43" stroke="#663000" stroke-width="1.6" stroke-linecap="round" opacity="0.4"/>`
        : "";
  const armWidth = shape <= 1 ? 7 : shape <= 3 ? 8 : 10;
  const legWidth = shape <= 2 ? 7 : shape <= 4 ? 9 : 11;
  return `
    <svg viewBox="0 0 80 120" role="img" aria-label="${escapeHtml(label)} body fat reference">
      ${svgDefs(id, palette)}
      <circle cx="40" cy="13" r="${shape >= 4 ? 10 : 9}" fill="url(#${id})"/>
      <path d="${bodyPath}" fill="url(#${id})"/>
      <path d="M22 38 C12 52 12 69 21 82 M58 38 C68 52 68 69 59 82" stroke="${palette[1]}" stroke-width="${armWidth}" stroke-linecap="round"/>
      <path d="M33 92 L29 116 M47 92 L51 116" stroke="${palette[1]}" stroke-width="${legWidth}" stroke-linecap="round"/>
      ${definition}
      ${shape >= 3 ? `<path d="M28 61 C34 69 46 69 52 61" stroke="#6B2D00" stroke-width="2" stroke-linecap="round" opacity="0.38"/>` : ""}
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

function renderSettings() {
  const user = readUser() || {};
  const email = localStorage.getItem(EMAIL_KEY) || "Signed in";
  settingsProfile.innerHTML = `
    <div class="settings-section-head">
      <h3>Profile</h3>
      <p>Your FuelFlow plan at a glance.</p>
    </div>
    <div class="settings-grid">
      <div class="settings-item">Name <span>${escapeHtml(user.name || "Not set")}</span></div>
      <div class="settings-item">Email <span>${escapeHtml(email)}</span></div>
      <div class="settings-item">Goal <span>${escapeHtml(user.goal || "Not set")}</span></div>
      <div class="settings-item">Body type <span>${escapeHtml(user.body_type || "Not set")}</span></div>
      <div class="settings-item">Current body fat <span>${escapeHtml(user.body_fat_range || "Not set")}</span></div>
      <div class="settings-item">Target body fat <span>${escapeHtml(user.target_body_fat_range || "Not set")}</span></div>
      <div class="settings-item">Daily calorie target <span>${escapeHtml(user.daily_calories || "Not set")} kcal</span></div>
    </div>
    <div class="settings-actions">
      <button id="settingsEditProfile" class="secondary-button" type="button">Edit Profile</button>
      <button id="settingsEditGoals" class="secondary-button" type="button">Edit Goals</button>
    </div>
  `;
  applyTheme(localStorage.getItem(THEME_KEY) || "fiery");
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
        <div class="entry-actions">
          <span class="entry-time">${escapeHtml(time)}</span>
          <button class="icon-button entry-edit" type="button" aria-label="Edit meal">✎</button>
          <button class="icon-button entry-delete" type="button" aria-label="Delete meal">🗑️</button>
        </div>
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
      <div class="delete-confirm hidden-soft">
        <span>Delete this meal?</span>
        <div class="confirm-actions">
          <button class="mini-danger delete-yes" type="button">Yes</button>
          <button class="mini-muted delete-no" type="button">No</button>
        </div>
      </div>
      <form class="edit-log-form hidden-soft">
        <div class="form-row">
          <label>
            <span>Meal name</span>
            <input name="editMealName" type="text" value="${escapeHtml(log.mealName)}" required>
          </label>
          <label>
            <span>Meal type</span>
            <select name="editMealType">
              ${["Breakfast", "Lunch", "Dinner", "Snack", "Drink"].map((type) => `<option ${log.mealType === type ? "selected" : ""}>${type}</option>`).join("")}
            </select>
          </label>
        </div>
        <label>
          <span>Energy level: ${energy}/10</span>
          <input name="editEnergy" type="range" min="1" max="10" value="${energy}">
        </label>
        <label>
          <span>Notes</span>
          <textarea name="editNotes" rows="3">${escapeHtml(log.notes || "")}</textarea>
        </label>
        <div class="edit-actions">
          <button class="gradient-button compact edit-save" type="submit">Save</button>
          <button class="secondary-button compact edit-cancel" type="button">Cancel</button>
        </div>
      </form>
    </article>
  `;
}

async function toggleEaten(logId, checked) {
  const logs = readLogs().map((log) => {
    return log.id === logId ? { ...log, eaten: checked } : log;
  });
  await writeLogs(logs);
  renderToday();
  renderHomeProgress();
}

async function quickAdd(name) {
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
  await writeLogs(logs);
  renderToday();
}

async function deleteLog(logId) {
  const logs = readLogs().filter((log) => log.id !== logId);
  await writeLogs(logs);
  renderToday();
  renderHomeProgress();
}

async function updateLog(logId, form) {
  const formData = new FormData(form);
  const logs = readLogs().map((log) => {
    if (log.id !== logId) return log;
    return {
      ...log,
      mealName: formData.get("editMealName").trim(),
      mealType: formData.get("editMealType"),
      energy: Number(formData.get("editEnergy")),
      notes: formData.get("editNotes").trim(),
    };
  });
  await writeLogs(logs);
  renderToday();
  renderHomeProgress();
}

function updateInsightsState() {
  insightsButton.classList.remove("hidden-soft");
  insightsEmpty.classList.add("hidden-soft");
  if (readLogs().length >= 3) {
    insightsHint.classList.add("hidden-soft");
  }
}

function readSizzleHistory() {
  try {
    return JSON.parse(localStorage.getItem(SIZZLE_KEY)) || [];
  } catch {
    return [];
  }
}

function writeSizzleHistory(history) {
  localStorage.setItem(SIZZLE_KEY, JSON.stringify(history.slice(-20)));
}

function readChatSessions() {
  try {
    return JSON.parse(localStorage.getItem(CHAT_SESSIONS_KEY)) || [];
  } catch {
    return [];
  }
}

function writeChatSessions(sessions) {
  localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(sessions.slice(0, 5)));
}

function saveCurrentChatSession() {
  const messages = readSizzleHistory();
  if (!messages.some((message) => message.role === "user")) return;

  const firstUserMessage = messages.find((message) => message.role === "user")?.content || "Sizzle chat";
  const sessions = readChatSessions().filter((session) => {
    return JSON.stringify(session.messages) !== JSON.stringify(messages);
  });
  writeChatSessions([
    {
      timestamp: new Date().toISOString(),
      preview: firstUserMessage,
      messages,
    },
    ...sessions,
  ]);
}

function renderChatSessionsDropdown() {
  const sessions = readChatSessions();
  if (!sessions.length) {
    chatSessionsDropdown.innerHTML = `<p class="chat-session-empty">No previous sessions yet.</p>`;
    return;
  }

  chatSessionsDropdown.innerHTML = sessions.map((session, index) => {
    const date = new Date(session.timestamp).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    return `
      <button class="chat-session-item" type="button" data-chat-session-index="${index}">
        <span>${escapeHtml(date)}</span>
        <p>${escapeHtml(session.preview || "Sizzle chat")}</p>
      </button>
    `;
  }).join("");
}

function parseSizzleMarkdown(text) {
  const formatInline = (value) => {
    return escapeHtml(value)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*(?!\s)([^*\n]+?)\*/g, "$1<em>$2</em>");
  };

  const lines = String(text || "").split("\n");
  const html = [];
  let inList = false;

  lines.forEach((line) => {
    const bulletMatch = line.match(/^\s*(?:•|-)\s+(.+)/);
    if (bulletMatch) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${formatInline(bulletMatch[1])}</li>`);
      return;
    }

    if (inList) {
      html.push("</ul>");
      inList = false;
    }

    if (!line.trim()) {
      html.push("<br>");
      return;
    }

    html.push(`${formatInline(line)}<br>`);
  });

  if (inList) {
    html.push("</ul>");
  }

  return html.join("").replace(/(<br>)+$/, "");
}

function renderSizzleMessages(extraMessages = []) {
  const intro = {
    role: "assistant",
    content: "Hey! I'm Sizzle 🔥 — your personal food and nutrition AI. Ask me anything about what you eat, your goals, recipes, or how to feel better. I'm here to help, not judge.",
  };
  const activeMessages = viewingArchivedChat ? archivedChatMessages : readSizzleHistory();
  const messages = [intro, ...activeMessages, ...extraMessages];
  sizzleMessages.innerHTML = "";
  messages.forEach((message) => {
    const isUser = message.role === "user";
    const wrapper = document.createElement("div");
    wrapper.className = `chat-message ${isUser ? "user" : "assistant"}`;

    const name = document.createElement("span");
    name.className = "chat-name";
    name.textContent = isUser ? "You" : "🔥 Sizzle";

    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${isUser ? "" : "sizzle-message"}`;
    if (isUser) {
      bubble.textContent = message.content;
    } else {
      bubble.innerHTML = parseSizzleMarkdown(message.content);
    }

    wrapper.append(name, bubble);
    sizzleMessages.appendChild(wrapper);
  });
  backToCurrentChat.classList.toggle("hidden-soft", !viewingArchivedChat);
  sizzleForm.classList.toggle("hidden-soft", viewingArchivedChat);
  sizzleMessages.scrollTop = sizzleMessages.scrollHeight;
}

async function sendSizzleMessage(message) {
  if (viewingArchivedChat) {
    viewingArchivedChat = false;
    archivedChatMessages = [];
  }
  const history = readSizzleHistory();
  const nextHistory = [...history, { role: "user", content: message }];
  writeSizzleHistory(nextHistory);
  renderSizzleMessages([{ role: "assistant", content: "Sizzle is thinking... 🔥" }]);

  try {
    const response = await apiFetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        message,
        history: nextHistory.slice(-6),
        user_profile: getUserProfileForApi(),
      }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "Sizzle paused for a second.");
    }
    const data = await response.json();
    writeSizzleHistory([...nextHistory, { role: "assistant", content: data.reply || "I am here with you. Ask me one specific thing and we will work through it." }]);
  } catch (error) {
    writeSizzleHistory([...nextHistory, { role: "assistant", content: error.message || "I hit a pause, but I am still here. Try asking that again in a simpler way." }]);
  }
  renderSizzleMessages();
  renderChatSessionsDropdown();
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
    const response = await apiFetch("/api/get-insights", {
      method: "POST",
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
      <article class="explore-card ${item.highlight ? "feeling-low-card" : ""}">
        <button class="explore-toggle" type="button" data-explore-index="${index}">
          <span class="explore-icon">${escapeHtml(item.icon)}</span>
          <span>
            <strong>${escapeHtml(item.title)}</strong>
            <p>${escapeHtml(item.description)}</p>
          </span>
          <span class="expand-arrow">⌄</span>
        </button>
        <div class="explore-body">
          ${item.highlight ? `
            <p class="feeling-low-intro">${escapeHtml(item.intro)}</p>
            <h3>Community Stories</h3>
            <div class="community-stories">
              ${item.stories.map((story) => `
                <article>
                  <strong>${escapeHtml(story.name)}</strong>
                  <p>"${escapeHtml(story.text)}"</p>
                </article>
              `).join("")}
            </div>
            <p class="feeling-low-closing">${escapeHtml(item.closing)}</p>
            <p class="story-note"><em>${escapeHtml(item.note)}</em></p>
          ` : `
            <ul>
              ${item.details.map((detail) => `<li>${escapeHtml(detail)}</li>`).join("")}
            </ul>
            <p class="explore-benefit">${escapeHtml(item.benefit)}</p>
          `}
        </div>
      </article>
    `)
    .join("");
}

function getPlanProfile() {
  const user = readUser() || {};
  return {
    ...user,
    food_preference: planSelections.food_preference,
    budget: planSelections.budget,
    sport: planSelections.sport,
    plan_type: planSelections.plan_type,
    cuisine: planSelections.cuisine.join(", "),
    alcohol_frequency: planSelections.alcohol_frequency,
    meals_per_day: Number(planMealsPerDay.value || DEFAULT_MEALS_PER_DAY),
  };
}

function renderMealPlanView() {
  const plan = readMealPlan();
  planSetup.classList.toggle("hidden-soft", Boolean(plan));
  planDisplay.classList.toggle("hidden-soft", !plan);
  if (plan) {
    renderMealPlan(plan);
  }
}

function renderMealPlan(plan) {
  const summary = plan.plan_summary || {};
  const days = plan.days || [];
  const day = days[selectedPlanDay] || days[0] || {};
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const alcoholFrequency = getPlanProfile().alcohol_frequency;
  const showAlcohol = alcoholFrequency && alcoholFrequency !== "I don't drink";
  const groceryChecks = readGroceryChecks();

  planDisplay.className = "plan-display";
  planDisplay.innerHTML = `
    <section class="card plan-header">
      <div class="plan-header-top">
        <div>
          <span class="plan-badge">${escapeHtml(summary.plan_type || "Plan")}</span>
          <h2>Your ${escapeHtml(summary.plan_type || "Meal")} Plan</h2>
          <p>${escapeHtml(summary.weekly_goal || "A practical week built around your goals.")}</p>
        </div>
        <div class="plan-actions">
          <button id="regeneratePlanButton" class="secondary-button compact" type="button">Regenerate Plan</button>
          <button id="downloadPlanButton" class="secondary-button compact" type="button">Download as PDF</button>
        </div>
      </div>
      <div class="macro-pills">
        <span class="metric-pill">${escapeHtml(summary.daily_calories || 0)} kcal/day</span>
        <span class="metric-pill">P ${escapeHtml(summary.protein_g || 0)}g</span>
        <span class="metric-pill">C ${escapeHtml(summary.carbs_g || 0)}g</span>
        <span class="metric-pill">F ${escapeHtml(summary.fat_g || 0)}g</span>
      </div>
    </section>

    <nav class="day-tabs" aria-label="Meal plan days">
      ${days.map((item, index) => `
        <button class="day-tab ${index === selectedPlanDay ? "active" : ""}" type="button" data-plan-day="${index}">
          ${escapeHtml(dayNames[index] || item.day)}
        </button>
      `).join("")}
    </nav>

    <section class="meal-plan-day">
      ${(day.meals || []).map((meal, index) => renderPlanMealCard(meal, index)).join("")}
      ${showAlcohol ? `
        <article class="card alcohol-guidance-card">
          <h3>🍺 Alcohol Balance Guide</h3>
          <p>${escapeHtml(plan.alcohol_guidance || "If you drink, hydrate well, eat protein first, and return to your normal meals the next day.")}</p>
        </article>
      ` : ""}
    </section>

    <section class="card grocery-section">
      <div class="progress-heading">
        <div>
          <p class="eyebrow flame">Full week</p>
          <h3>Grocery list</h3>
        </div>
        <button id="copyGroceryButton" class="secondary-button compact" type="button">Copy list</button>
      </div>
      <button class="grocery-toggle" type="button">
        <span>🛒 Grocery List (${escapeHtml((plan.grocery_list || []).length)} items)</span>
        <span class="expand-arrow">⌄</span>
      </button>
      <div class="grocery-dropdown">
        <ul class="grocery-list">
          ${(plan.grocery_list || []).map((item, index) => `
            <li>
              <label class="${groceryChecks[index] ? "checked" : ""}">
                <input class="grocery-check" type="checkbox" data-grocery-index="${index}" ${groceryChecks[index] ? "checked" : ""}>
                <span>${escapeHtml(item)}</span>
              </label>
            </li>
          `).join("")}
        </ul>
      </div>
    </section>

    <section class="card weekly-tips">
      <p class="eyebrow flame">This week</p>
      <h3>Weekly tips</h3>
      <div class="tip-grid">
        ${(plan.weekly_tips || []).slice(0, 3).map((tip) => `
          <article class="tip-card">
            <span>✦</span>
            <p>${escapeHtml(tip)}</p>
          </article>
        `).join("")}
      </div>
      <p>${escapeHtml(plan.adjustment_note || "")}</p>
    </section>

    <section class="card weight-check-card">
      <h3>Track your progress</h3>
      <p>Update your weight weekly so your plan stays accurate</p>
      <form id="weightUpdateForm" class="weight-row">
        <label>
          <span>Weight in kg</span>
          <input name="weightKg" type="number" min="1" step="0.1" value="${escapeHtml(readUser()?.weight_kg || "")}">
        </label>
        <button class="gradient-button compact" type="submit">Update & Recalculate</button>
      </form>
      <p id="planUpdateMessage" class="plan-message hidden-soft">Plan updated for your new stats 🔥</p>
    </section>

    <button id="bottomRegeneratePlanButton" class="gradient-button full" type="button">Not happy with this plan? Generate a new one 🔥</button>
  `;
}

function renderPlanMealCard(meal, index) {
  const totalMacros = Math.max(1, Number(meal.protein_g || 0) + Number(meal.carbs_g || 0) + Number(meal.fat_g || 0));
  const proteinWidth = Math.round((Number(meal.protein_g || 0) / totalMacros) * 100);
  const carbsWidth = Math.round((Number(meal.carbs_g || 0) / totalMacros) * 100);
  const fatWidth = Math.max(0, 100 - proteinWidth - carbsWidth);
  return `
    <article class="card plan-meal-card" data-plan-meal-index="${index}">
      <div class="plan-meal-top">
        <div>
          <div class="entry-title">
            <span class="type-badge">${escapeHtml(meal.meal_type || "Meal")}</span>
            <span class="entry-time">${escapeHtml(meal.time || "")}</span>
          </div>
          <h3>${escapeHtml(meal.name || "Meal")}</h3>
        </div>
        <button class="secondary-button compact log-plan-meal" type="button">Log this meal</button>
      </div>
      <div class="macro-bar" aria-label="Macro proportions">
        <span style="width:${proteinWidth}%"></span>
        <span style="width:${carbsWidth}%"></span>
        <span style="width:${fatWidth}%"></span>
      </div>
      <div class="metric-pills">
        <span class="metric-pill">${escapeHtml(meal.calories || 0)} kcal</span>
        <span class="metric-pill">P ${escapeHtml(meal.protein_g || 0)}g</span>
        <span class="metric-pill">C ${escapeHtml(meal.carbs_g || 0)}g</span>
        <span class="metric-pill">F ${escapeHtml(meal.fat_g || 0)}g</span>
      </div>
      <button class="clear-chat-button recipe-toggle" type="button">See recipe ↓</button>
      <div class="recipe-panel">
        <h4>Ingredients</h4>
        <ul>${(meal.ingredients || []).map((ingredient) => `<li>${escapeHtml(ingredient)}</li>`).join("")}</ul>
        <h4>Recipe</h4>
        <p>${escapeHtml(meal.recipe || "")}</p>
        <p class="why-meal">Why this meal? ${escapeHtml(meal.why || "")}</p>
      </div>
    </article>
  `;
}

function setPlanLoading(isLoading) {
  generateMealPlanButton.disabled = isLoading;
  planLoading.classList.toggle("hidden-soft", !isLoading);
  if (isLoading) {
    let index = 0;
    planLoadingMessage.textContent = planLoadingMessages[index];
    planLoadingTimer = window.setInterval(() => {
      index = (index + 1) % planLoadingMessages.length;
      planLoadingMessage.textContent = planLoadingMessages[index];
    }, 1800);
  } else if (planLoadingTimer) {
    window.clearInterval(planLoadingTimer);
    planLoadingTimer = null;
  }
}

async function generateMealPlan() {
  const profile = getPlanProfile();
  writePlanSelections();
  setPlanLoading(true);
  try {
    const response = await apiFetch("/api/generate-meal-plan", {
      method: "POST",
      body: JSON.stringify({ user_profile: profile }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "FuelFlow could not generate your plan yet.");
    }
    const plan = await response.json();
    writeMealPlan(plan);
    localStorage.removeItem(GROCERY_CHECKS_KEY);
    await savePlanToServer(plan);
    selectedPlanDay = 0;
    renderMealPlanView();
    showToast("Your meal plan is ready 🔥");
  } catch (error) {
    showToast(error.message || "Something paused. Please try again.");
  } finally {
    setPlanLoading(false);
  }
}

async function logPlanMeal(meal) {
  const logs = readLogs();
  logs.push({
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    mealName: meal.name || "Planned meal",
    mealType: meal.meal_type || "Meal",
    portionFeel: "Just right",
    moodBefore: { emoji: "😐", label: "Neutral" },
    moodAfter: { emoji: "😊", label: "Good" },
    energy: 7,
    notes: `From meal plan: ${meal.calories || 0} kcal, P ${meal.protein_g || 0}g, C ${meal.carbs_g || 0}g, F ${meal.fat_g || 0}g`,
    dailyMood: readDailyMoodData()[getTodayKey()]?.mood || "",
    alcohol: false,
    drinks: 0,
    eaten: true,
  });
  await writeLogs(logs);
  showToast("Meal logged from your plan.");
  renderToday();
  renderHomeProgress();
}

async function updateWeightAndRecalculate(weightKg) {
  const user = readUser();
  if (!user || !weightKg) return;
  const updatedUser = { ...user, weight_kg: Number(weightKg) };
  updatedUser.daily_calories = calculateDailyCalories(updatedUser);
  writeUser(updatedUser);
  await saveProfileToServer(updatedUser);
  const history = JSON.parse(localStorage.getItem(WEIGHT_HISTORY_KEY) || "[]");
  history.push({ date: new Date().toISOString(), weight_kg: Number(weightKg) });
  localStorage.setItem(WEIGHT_HISTORY_KEY, JSON.stringify(history));
  document.querySelector("#planUpdateMessage")?.classList.remove("hidden-soft");
  renderHomePersonalization();
}

let onboardingStep = 0;
let onboardingSelections = {
  goal: "Lose weight",
  activity_level: "Sedentary",
  food_relationship: "Pretty good",
  body_type: "",
  body_fat_range: "",
  body_fat_mid: 0,
  target_body_fat_range: "",
  target_body_fat_mid: 0,
};

function getDefaultOnboardingSelections() {
  return {
    goal: "Lose weight",
    activity_level: "Sedentary",
    food_relationship: "Pretty good",
    body_type: "",
    body_fat_range: "",
    body_fat_mid: 0,
    target_body_fat_range: "",
    target_body_fat_mid: 0,
  };
}

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
  updateOnboardingButtons();
}

function updateOnboardingButtons() {
  document.querySelectorAll(".onboarding-step").forEach((step) => {
    const stepIndex = Number(step.dataset.step);
    const nextButton = step.querySelector(".onboarding-next");
    const finishButton = step.querySelector("#finishOnboarding");
    if (nextButton && stepIndex === 3) {
      nextButton.disabled = !onboardingSelections.body_type;
    }
    if (nextButton && stepIndex === 4) {
      nextButton.disabled = !onboardingSelections.body_fat_range;
    }
    if (finishButton) {
      finishButton.disabled = !onboardingSelections.target_body_fat_range;
    }
  });
}

function showOnboardingIfNeeded() {
  if (!readUser()) {
    startOnboarding(0, "full");
  }
}

function fillOnboardingFromProfile(profile = readUser()) {
  if (!profile) {
    onboardingSelections = getDefaultOnboardingSelections();
    onboardingName.value = "";
    onboardingAge.value = "";
    onboardingWeight.value = "";
    onboardingHeight.value = "";
    onboardingSex.value = "Male";
    activityDescription.textContent = activityDescriptions.Sedentary;
    foodRelationshipMessage.classList.add("hidden-soft");
    document.querySelectorAll(".onboarding-pills").forEach((group) => {
      group.querySelectorAll(".mood-pill").forEach((button) => {
        button.classList.toggle("active", button.dataset.value === onboardingSelections[group.dataset.onboardingGroup]);
      });
    });
    return;
  }
  onboardingName.value = profile.name || "";
  onboardingAge.value = profile.age || "";
  onboardingWeight.value = profile.weight_kg || "";
  onboardingHeight.value = profile.height_cm || "";
  onboardingSex.value = profile.sex || "Male";
  onboardingSelections = {
    goal: profile.goal || "Lose weight",
    activity_level: profile.activity_level || "Sedentary",
    food_relationship: profile.food_relationship || "Pretty good",
    body_type: profile.body_type || "",
    body_fat_range: profile.body_fat_range || "",
    body_fat_mid: Number(profile.body_fat_mid || 0),
    target_body_fat_range: profile.target_body_fat_range || "",
    target_body_fat_mid: Number(profile.target_body_fat_mid || 0),
  };
  document.querySelectorAll(".onboarding-pills").forEach((group) => {
    group.querySelectorAll(".mood-pill").forEach((button) => {
      button.classList.toggle("active", button.dataset.value === onboardingSelections[group.dataset.onboardingGroup]);
    });
  });
  activityDescription.textContent = activityDescriptions[onboardingSelections.activity_level];
  foodRelationshipMessage.classList.toggle("hidden-soft", onboardingSelections.food_relationship !== "I struggle sometimes");
}

function startOnboarding(step = 0, mode = "full") {
  onboardingMode = mode;
  fillOnboardingFromProfile();
  onboardingOverlay.classList.remove("hidden-soft");
  setOnboardingStep(step);
}

function renderBodyTypeCards() {
  bodyTypeCards.innerHTML = bodyTypes.map((type) => {
    return `
      <button class="visual-card ${onboardingSelections.body_type === type.key ? "selected" : ""}" type="button" data-body-type="${escapeHtml(type.key)}">
        ${getBodyTypeSvg(type.key)}
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
  bodyFatCards.innerHTML = options.map((option) => `
    <button class="visual-card ${onboardingSelections.body_fat_range === option.range ? "selected" : ""}" type="button" data-body-fat-range="${escapeHtml(option.range)}" data-body-fat-mid="${escapeHtml(option.mid)}">
      ${getBodyFatSvg(option.shape, onboardingSex.value, option.label)}
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
  if (onboardingSelections.goal === "Maintain") {
    onboardingSelections.target_body_fat_range = onboardingSelections.body_fat_range || options[2].range;
    onboardingSelections.target_body_fat_mid = onboardingSelections.body_fat_mid || options[2].mid;
  }

  targetBodyFatCards.innerHTML = options.map((option, index) => {
    return `
      <button class="visual-card ${onboardingSelections.target_body_fat_range === option.range ? "selected" : ""}" type="button" data-target-body-fat-range="${escapeHtml(option.range)}" data-target-body-fat-mid="${escapeHtml(option.mid)}">
        ${getBodyFatSvg(option.shape, onboardingSex.value, option.label)}
        <strong>${escapeHtml(option.label)}</strong>
        <small>${escapeHtml(option.range)}</small>
      </button>
    `;
  }).join("");
}

async function finishUserOnboarding() {
  const existingProfile = readUser() || {};
  const profile = {
    ...existingProfile,
    name: onboardingName.value.trim() || existingProfile.name || "friend",
    age: Number(onboardingAge.value || existingProfile.age || 0),
    weight_kg: Number(onboardingWeight.value || existingProfile.weight_kg || 0),
    height_cm: Number(onboardingHeight.value || existingProfile.height_cm || 0),
    sex: onboardingSex.value || existingProfile.sex || "Male",
    goal: onboardingSelections.goal,
    activity_level: onboardingSelections.activity_level,
    food_relationship: onboardingSelections.food_relationship || existingProfile.food_relationship || "Pretty good",
    body_type: onboardingSelections.body_type || existingProfile.body_type || "",
    body_fat_range: onboardingSelections.body_fat_range || existingProfile.body_fat_range || "",
    body_fat_mid: onboardingSelections.body_fat_mid || existingProfile.body_fat_mid || 0,
    target_body_fat_range: onboardingSelections.target_body_fat_range || existingProfile.target_body_fat_range || "",
    target_body_fat_mid: onboardingSelections.target_body_fat_mid || existingProfile.target_body_fat_mid || 0,
    meals_per_day: DEFAULT_MEALS_PER_DAY,
  };
  profile.daily_calories = calculateDailyCalories(profile);
  writeUser(profile);
  await saveProfileToServer(profile);
  onboardingOverlay.classList.add("hidden-soft");
  onboardingMode = "full";
  renderHomePersonalization();
  renderSettings();
}

function renderFoodInsightCard(log, insight) {
  const isGood = Boolean(insight.good_for_goal);
  const motivation = getMotivationalNudge();
  foodInsightCard.classList.remove("hidden-soft", "fading");
  foodInsightCard.innerHTML = `
    <h3>${escapeHtml(log.mealName)}</h3>
    <p>${escapeHtml(insight.what_it_does || "This meal gives your body useful energy and helps you notice what supports your day.")}</p>
    <span class="goal-badge ${isGood ? "good" : "okay"}">${isGood ? "Great for your goal" : "Okay for your goal"}</span>
    <p class="up-next">Up next: ${escapeHtml(insight.next_suggestion || "Add water and a protein-rich option later.")}</p>
    <p class="motivation-line">${escapeHtml(motivation)}</p>
  `;

  window.setTimeout(() => {
    foodInsightCard.classList.add("fading");
  }, 7600);
  window.setTimeout(() => {
    foodInsightCard.classList.add("hidden-soft");
    foodInsightCard.classList.remove("fading");
  }, 8000);
}

function getMotivationalNudge() {
  const hour = new Date().getHours();
  let timeMessage = "Midday check-in done. You're showing up for yourself.";
  if (hour < 10) {
    timeMessage = "Starting the day with intention. That's how transformations begin.";
  } else if (hour >= 18 && hour < 22) {
    timeMessage = "Evening awareness is where most people fall short. You're not most people.";
  } else if (hour >= 22 || hour < 4) {
    timeMessage = "Late night, still tracking. That's discipline showing up.";
  }

  const goal = readUser()?.goal || "";
  const goalMessages = {
    "Gain muscle": "Every meal is a building block. Your body is listening.",
    "Lose weight": "Awareness is the first step. You're already ahead.",
    "Maintain": "Consistency is the hardest thing. You're nailing it.",
  };
  return `${timeMessage} ${goalMessages[goal] || ""}`.trim();
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

function showAuth(mode) {
  authView.classList.remove("hidden-soft");
  mainApp.classList.add("hidden-soft");
  bottomNav.classList.add("hidden-soft");
  onboardingOverlay.classList.add("hidden-soft");
  loginView.classList.toggle("hidden-soft", mode !== "login");
  signupView.classList.toggle("hidden-soft", mode !== "signup");
}

function showMainApp() {
  if (window.location.pathname !== "/app") {
    window.history.replaceState(null, "", "/app");
  }
  authView.classList.add("hidden-soft");
  mainApp.classList.remove("hidden-soft");
  bottomNav.classList.remove("hidden-soft");
}

async function completeAuthenticatedLoad(profile = null) {
  if (profile) {
    writeUser(profile);
  } else {
    await loadProfileFromServer();
  }
  await loadLogsFromServer();
  showMainApp();
  renderToday();
  renderHomePersonalization();
  updateInsightsState();
  renderSizzleMessages();
  renderSettings();
  if (!readUser()) {
    startOnboarding(0, "full");
  }
}

async function handleAuthResponse(response, errorEl) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong.");
  }
  const email = (loginEmail.value || signupEmail.value || "").trim().toLowerCase();
  setAuth(data.token, data.user_id, email);
  if (data.has_profile) {
    await completeAuthenticatedLoad();
  } else {
    await loadLogsFromServer();
    localStorage.removeItem(USER_KEY);
    showMainApp();
    renderToday();
    renderHomePersonalization();
    updateInsightsState();
    startOnboarding(0, "full");
  }
  errorEl.textContent = "";
}

async function loginUser() {
  loginError.textContent = "";
  loginButton.disabled = true;
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: loginEmail.value.trim(),
        password: loginPassword.value,
      }),
    });
    await handleAuthResponse(response, loginError);
  } catch (error) {
    loginError.textContent = error.message;
  } finally {
    loginButton.disabled = false;
  }
}

async function signupUser() {
  signupError.textContent = "";
  if (signupPassword.value !== signupConfirmPassword.value) {
    signupError.textContent = "Passwords do not match.";
    return;
  }
  signupButton.disabled = true;
  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: signupEmail.value.trim(),
        password: signupPassword.value,
      }),
    });
    await handleAuthResponse(response, signupError);
  } catch (error) {
    signupError.textContent = error.message;
  } finally {
    signupButton.disabled = false;
  }
}

async function verifyExistingSession() {
  if (!getToken()) {
    showAuth("login");
    return;
  }
  try {
    const response = await apiFetch("/api/auth/me");
    if (!response.ok) {
      throw new Error("Session expired.");
    }
    const data = await response.json();
    if (data.user?.email) {
      localStorage.setItem(EMAIL_KEY, data.user.email);
    }
    if (data.profile) {
      writeUser(data.profile);
    } else {
      localStorage.removeItem(USER_KEY);
    }
    await completeAuthenticatedLoad(data.profile);
  } catch {
    clearAuth();
    showAuth("login");
  }
}

function bindEvents() {
  showSignupButton.addEventListener("click", () => showAuth("signup"));
  showLoginButton.addEventListener("click", () => showAuth("login"));
  loginButton.addEventListener("click", loginUser);
  signupButton.addEventListener("click", signupUser);
  loginPassword.addEventListener("keydown", (event) => {
    if (event.key === "Enter") loginUser();
  });
  signupConfirmPassword.addEventListener("keydown", (event) => {
    if (event.key === "Enter") signupUser();
  });

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

    const dailyMoodButton = event.target.closest("[data-daily-mood]");
    if (dailyMoodButton) {
      saveDailyMood(dailyMoodButton.dataset.dailyMood);
      return;
    }

    const planPill = event.target.closest(".plan-pills .mood-pill");
    if (planPill) {
      const group = planPill.closest(".plan-pills");
      const key = group.dataset.planGroup;
      if (group.classList.contains("multi")) {
        planPill.classList.toggle("active");
        const activeValues = Array.from(group.querySelectorAll(".mood-pill.active")).map((button) => button.dataset.value);
        planSelections[key] = activeValues.length ? activeValues : [planPill.dataset.value];
        if (!activeValues.length) planPill.classList.add("active");
      } else {
        group.querySelectorAll(".mood-pill").forEach((button) => {
          button.classList.toggle("active", button === planPill);
        });
        planSelections[key] = planPill.dataset.value;
        if (key === "plan_type") {
          planTypeDescription.textContent = planTypeDescriptions[planPill.dataset.value];
        }
      }
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
      if (group.dataset.onboardingGroup === "food_relationship") {
        foodRelationshipMessage.classList.toggle("hidden-soft", onboardingPill.dataset.value !== "I struggle sometimes");
      }
      if (group.dataset.onboardingGroup === "goal") {
        onboardingSelections.target_body_fat_range = "";
        onboardingSelections.target_body_fat_mid = 0;
      }
      updateOnboardingButtons();
      return;
    }

    const bodyTypeCard = event.target.closest("[data-body-type]");
    if (bodyTypeCard) {
      onboardingSelections.body_type = bodyTypeCard.dataset.bodyType;
      renderBodyTypeCards();
      updateOnboardingButtons();
      return;
    }

    const bodyFatCard = event.target.closest("[data-body-fat-range]");
    if (bodyFatCard) {
      onboardingSelections.body_fat_range = bodyFatCard.dataset.bodyFatRange;
      onboardingSelections.body_fat_mid = Number(bodyFatCard.dataset.bodyFatMid);
      onboardingSelections.target_body_fat_range = "";
      onboardingSelections.target_body_fat_mid = 0;
      renderBodyFatCards();
      updateOnboardingButtons();
      return;
    }

    const targetBodyFatCard = event.target.closest("[data-target-body-fat-range]");
    if (targetBodyFatCard) {
      onboardingSelections.target_body_fat_range = targetBodyFatCard.dataset.targetBodyFatRange;
      onboardingSelections.target_body_fat_mid = Number(targetBodyFatCard.dataset.targetBodyFatMid);
      renderTargetBodyFatCards();
      updateOnboardingButtons();
      return;
    }

    const editProfileButton = event.target.closest("#editProfileButton");
    if (editProfileButton) {
      startOnboarding(0, "full");
      return;
    }

    const settingsEditProfile = event.target.closest("#settingsEditProfile");
    if (settingsEditProfile) {
      startOnboarding(0, "full");
      return;
    }

    const settingsEditGoals = event.target.closest("#settingsEditGoals");
    if (settingsEditGoals) {
      startOnboarding(2, "goals");
      return;
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
    updateOnboardingButtons();
  });

  mealForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const log = createLogFromForm(new FormData(mealForm));
    const logs = readLogs();
    logs.push(log);
    await writeLogs(logs);
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

  todayList.addEventListener("click", (event) => {
    const card = event.target.closest(".entry-card");
    if (!card) return;

    if (event.target.closest(".entry-delete")) {
      card.querySelector(".delete-confirm").classList.remove("hidden-soft");
      card.querySelector(".edit-log-form").classList.add("hidden-soft");
      return;
    }

    if (event.target.closest(".delete-no")) {
      card.querySelector(".delete-confirm").classList.add("hidden-soft");
      return;
    }

    if (event.target.closest(".delete-yes")) {
      deleteLog(card.dataset.logId);
      return;
    }

    if (event.target.closest(".entry-edit")) {
      card.querySelector(".edit-log-form").classList.toggle("hidden-soft");
      card.querySelector(".delete-confirm").classList.add("hidden-soft");
      return;
    }

    if (event.target.closest(".edit-cancel")) {
      card.querySelector(".edit-log-form").classList.add("hidden-soft");
    }
  });

  todayList.addEventListener("submit", (event) => {
    if (event.target.classList.contains("edit-log-form")) {
      event.preventDefault();
      const card = event.target.closest(".entry-card");
      updateLog(card.dataset.logId, event.target);
    }
  });

  quickAddToggle.addEventListener("click", () => {
    quickAddForm.classList.toggle("hidden-soft");
  });

  quickAddForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = new FormData(quickAddForm).get("quickName").trim();
    if (name) {
      await quickAdd(name);
      quickAddForm.reset();
      quickAddForm.classList.add("hidden-soft");
      showToast("Saved. Small notes count too.");
    }
  });

  mealPlanForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await generateMealPlan();
  });

  planDisplay.addEventListener("click", async (event) => {
    const dayButton = event.target.closest("[data-plan-day]");
    if (dayButton) {
      selectedPlanDay = Number(dayButton.dataset.planDay);
      renderMealPlan(readMealPlan());
      return;
    }

    if (event.target.closest("#regeneratePlanButton") || event.target.closest("#bottomRegeneratePlanButton")) {
      localStorage.removeItem(MEAL_PLAN_KEY);
      renderMealPlanView();
      return;
    }

    const groceryToggle = event.target.closest(".grocery-toggle");
    if (groceryToggle) {
      groceryToggle.closest(".grocery-section").classList.toggle("open");
      return;
    }

    if (event.target.closest("#downloadPlanButton")) {
      window.print();
      return;
    }

    const mealCard = event.target.closest(".plan-meal-card");
    if (event.target.closest(".recipe-toggle") && mealCard) {
      mealCard.classList.toggle("open");
      return;
    }

    if (event.target.closest(".log-plan-meal") && mealCard) {
      const plan = readMealPlan();
      const meal = plan?.days?.[selectedPlanDay]?.meals?.[Number(mealCard.dataset.planMealIndex)];
      if (meal) {
        await logPlanMeal(meal);
      }
      return;
    }

    if (event.target.closest("#copyGroceryButton")) {
      const list = (readMealPlan()?.grocery_list || []).join("\n");
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(list);
        showToast("Grocery list copied.");
      } else {
        showToast("Copy is not available in this browser.");
      }
    }
  });

  planDisplay.addEventListener("change", (event) => {
    if (event.target.classList.contains("grocery-check")) {
      const checks = readGroceryChecks();
      checks[event.target.dataset.groceryIndex] = event.target.checked;
      writeGroceryChecks(checks);
      event.target.closest("label").classList.toggle("checked", event.target.checked);
    }
  });

  planDisplay.addEventListener("submit", async (event) => {
    if (event.target.id === "weightUpdateForm") {
      event.preventDefault();
      const weightKg = new FormData(event.target).get("weightKg");
      await updateWeightAndRecalculate(weightKg);
    }
  });

  insightsButton.addEventListener("click", getInsights);

  sizzleForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = sizzleInput.value.trim();
    if (!message) return;
    sizzleInput.value = "";
    await sendSizzleMessage(message);
  });

  clearSizzleChat.addEventListener("click", () => {
    saveCurrentChatSession();
    localStorage.removeItem(SIZZLE_KEY);
    viewingArchivedChat = false;
    archivedChatMessages = [];
    renderChatSessionsDropdown();
    renderSizzleMessages();
  });

  previousChatsButton.addEventListener("click", () => {
    renderChatSessionsDropdown();
    chatSessionsDropdown.classList.toggle("hidden-soft");
  });

  chatSessionsDropdown.addEventListener("click", (event) => {
    const sessionButton = event.target.closest("[data-chat-session-index]");
    if (!sessionButton) return;
    const session = readChatSessions()[Number(sessionButton.dataset.chatSessionIndex)];
    if (!session) return;
    viewingArchivedChat = true;
    archivedChatMessages = session.messages || [];
    chatSessionsDropdown.classList.add("hidden-soft");
    renderSizzleMessages();
  });

  backToCurrentChat.addEventListener("click", () => {
    viewingArchivedChat = false;
    archivedChatMessages = [];
    renderSizzleMessages();
  });

  themeFiery.addEventListener("click", () => applyTheme("fiery"));
  themeOcean.addEventListener("click", () => applyTheme("ocean"));

  settingsLogoutButton.addEventListener("click", () => {
    if (!logoutArmed) {
      logoutArmed = true;
      logoutConfirmMessage.classList.remove("hidden-soft");
      window.setTimeout(() => {
        logoutArmed = false;
        logoutConfirmMessage.classList.add("hidden-soft");
      }, 5000);
      return;
    }
    clearAuth();
    showAuth("login");
  });

  resetAllDataButton.addEventListener("click", () => {
    clearAllLocalData();
    showAuth("login");
  });

  exportLogsButton.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(readLogs(), null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "fuelflow_logs.json";
    link.click();
    URL.revokeObjectURL(link.href);
  });

  document.querySelectorAll(".onboarding-next").forEach((button) => {
    button.addEventListener("click", async () => {
      if (onboardingMode === "goals" && onboardingStep === 2) {
        await finishUserOnboarding();
        return;
      }
      setOnboardingStep(Math.min(5, onboardingStep + 1));
    });
  });

  finishOnboarding.addEventListener("click", finishUserOnboarding);
}

async function init() {
  applyTheme(localStorage.getItem(THEME_KEY) || "fiery");
  quoteText.textContent = randomItem(quotes);
  renderMoodGroups();
  renderExplore();
  restorePlanSelections();
  renderMealPlanView();
  renderChatSessionsDropdown();
  renderSizzleMessages();
  bindEvents();
  await verifyExistingSession();
}

init();
