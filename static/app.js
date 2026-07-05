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
const HABIT_TYPE_KEY = "fuelflow_habit_quick_type";
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
    description: "Tall, narrow frame, long limbs",
  },
  {
    key: "Skinny Fat",
    description: "Slim frame with softer midsection",
  },
  {
    key: "Mesomorph",
    description: "Athletic V-taper, responds well to training",
  },
  {
    key: "Endomorph",
    description: "Rounder, wider, fuller build",
  },
  {
    key: "Athletic/Fit",
    description: "Muscular and visibly defined",
  },
  {
    key: "Stocky/Powerbuilt",
    description: "Wide, thick, strong frame",
  },
];

const bodyFatRanges = {
  Male: [
    { label: "Very Lean", range: "8-12%", mid: 10, shape: 0, description: "Sharp definition, narrow waist" },
    { label: "Lean", range: "13-17%", mid: 15, shape: 1, description: "Athletic with light abs" },
    { label: "Average", range: "18-22%", mid: 20, shape: 2, description: "Smooth torso, slight curve" },
    { label: "Above Average", range: "23-27%", mid: 25, shape: 3, description: "Fuller waist and hips" },
    { label: "High", range: "28-33%", mid: 30.5, shape: 4, description: "Rounder overall shape" },
    { label: "Very High", range: "34%+", mid: 34, shape: 5, description: "Largest, softest silhouette" },
  ],
  Female: [
    { label: "Very Lean", range: "15-19%", mid: 17, shape: 0, description: "Defined hourglass, lean waist" },
    { label: "Lean", range: "20-24%", mid: 22, shape: 1, description: "Athletic curves, light definition" },
    { label: "Average", range: "25-29%", mid: 27, shape: 2, description: "Soft, balanced silhouette" },
    { label: "Above Average", range: "30-34%", mid: 32, shape: 3, description: "Fuller hips and midsection" },
    { label: "High", range: "35-39%", mid: 37, shape: 4, description: "Rounder apple shape" },
    { label: "Very High", range: "40%+", mid: 40, shape: 5, description: "Largest, softest silhouette" },
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
const authQuoteText = document.querySelector("#authQuoteText");
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
const recommendedActionCard = document.querySelector("#recommendedActionCard");
const dailyWellbeingCard = document.querySelector("#dailyWellbeingCard");
const habitQuickLogCard = document.querySelector("#habitQuickLogCard");
const socialPlannerCard = document.querySelector("#socialPlannerCard");
const homeMoodText = document.querySelector("#homeMoodText");
const homeEnergyText = document.querySelector("#homeEnergyText");
const homeFocusText = document.querySelector("#homeFocusText");
const todayInsightCard = document.querySelector("#todayInsightCard");
const homeLearningCards = document.querySelector("#homeLearningCards");
const cuisineSpotlight = document.querySelector("#cuisineSpotlight");
const communityStoryCard = document.querySelector("#communityStoryCard");
const quickSizzleCheckIn = document.querySelector("#quickSizzleCheckIn");
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
const generateUnifiedReportButton = document.querySelector("#generateUnifiedReport");
const refreshUnifiedHistoryButton = document.querySelector("#refreshUnifiedHistory");
const unifiedReportEmpty = document.querySelector("#unifiedReportEmpty");
const unifiedReportLoading = document.querySelector("#unifiedReportLoading");
const unifiedReportContent = document.querySelector("#unifiedReportContent");
const unifiedReportFocus = document.querySelector("#unifiedReportFocus");
const unifiedReportSummary = document.querySelector("#unifiedReportSummary");
const unifiedReportActions = document.querySelector("#unifiedReportActions");
const unifiedReportSectionGrid = document.querySelector("#unifiedReportSectionGrid");
const unifiedReportHistory = document.querySelector("#unifiedReportHistory");
const generateAnalyticsReportButton = document.querySelector("#generateAnalyticsReport");
const refreshAnalyticsHistoryButton = document.querySelector("#refreshAnalyticsHistory");
const analyticsEmpty = document.querySelector("#analyticsEmpty");
const analyticsLoading = document.querySelector("#analyticsLoading");
const analyticsContent = document.querySelector("#analyticsContent");
const analyticsMetricGrid = document.querySelector("#analyticsMetricGrid");
const analyticsSummaryText = document.querySelector("#analyticsSummaryText");
const analyticsRecommendations = document.querySelector("#analyticsRecommendations");
const analyticsReportHistory = document.querySelector("#analyticsReportHistory");
const generateTimingReportButton = document.querySelector("#generateTimingReport");
const refreshTimingHistoryButton = document.querySelector("#refreshTimingHistory");
const timingEmpty = document.querySelector("#timingEmpty");
const timingLoading = document.querySelector("#timingLoading");
const timingContent = document.querySelector("#timingContent");
const timingMetricGrid = document.querySelector("#timingMetricGrid");
const timingSummaryText = document.querySelector("#timingSummaryText");
const timingSuggestions = document.querySelector("#timingSuggestions");
const timingReportHistory = document.querySelector("#timingReportHistory");
const generateRecoveryReportButton = document.querySelector("#generateRecoveryReport");
const refreshRecoveryHistoryButton = document.querySelector("#refreshRecoveryHistory");
const recoveryEmpty = document.querySelector("#recoveryEmpty");
const recoveryLoading = document.querySelector("#recoveryLoading");
const recoveryContent = document.querySelector("#recoveryContent");
const recoveryMetricGrid = document.querySelector("#recoveryMetricGrid");
const recoverySummaryText = document.querySelector("#recoverySummaryText");
const recoverySuggestions = document.querySelector("#recoverySuggestions");
const recoveryReportHistory = document.querySelector("#recoveryReportHistory");
const generateHabitReportButton = document.querySelector("#generateHabitReport");
const refreshHabitHistoryButton = document.querySelector("#refreshHabitHistory");
const habitEmpty = document.querySelector("#habitEmpty");
const habitLoading = document.querySelector("#habitLoading");
const habitContent = document.querySelector("#habitContent");
const habitMetricGrid = document.querySelector("#habitMetricGrid");
const habitSummaryText = document.querySelector("#habitSummaryText");
const habitSuggestions = document.querySelector("#habitSuggestions");
const habitReportHistory = document.querySelector("#habitReportHistory");
const generateSocialReportButton = document.querySelector("#generateSocialReport");
const refreshSocialHistoryButton = document.querySelector("#refreshSocialHistory");
const socialEmpty = document.querySelector("#socialEmpty");
const socialLoading = document.querySelector("#socialLoading");
const socialContent = document.querySelector("#socialContent");
const socialMetricGrid = document.querySelector("#socialMetricGrid");
const socialSummaryText = document.querySelector("#socialSummaryText");
const socialSuggestions = document.querySelector("#socialSuggestions");
const socialReportHistory = document.querySelector("#socialReportHistory");
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
const sizzleMemorySettings = document.querySelector("#sizzleMemorySettings");
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
let wellbeingCache = {
  daily_checkins: [],
  sleep_logs: [],
  recovery_logs: [],
};
let habitEventsCache = [];
let planAdherenceCache = [];
let mealPlanHistoryCache = [];
let activeUnifiedReport = null;
let activeWeeklySection = "overview";
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
  wellbeingCache = { daily_checkins: [], sleep_logs: [], recovery_logs: [] };
  habitEventsCache = [];
}

function clearAllLocalData() {
  localStorage.clear();
  logsCache = [];
  wellbeingCache = { daily_checkins: [], sleep_logs: [], recovery_logs: [] };
  habitEventsCache = [];
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

async function saveWellbeingCheckIn(payload) {
  const response = await apiFetch("/api/wellbeing/checkin", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Could not save your check-in yet.");
  }
  wellbeingCache = await response.json();
  return wellbeingCache;
}

async function loadWellbeingFromServer(days = 30) {
  if (!getToken()) return;
  const response = await apiFetch(`/api/wellbeing/checkins?days=${days}`);
  if (!response.ok) {
    wellbeingCache = { daily_checkins: [], sleep_logs: [], recovery_logs: [] };
    return;
  }
  wellbeingCache = await response.json();
}

async function saveHabitEvent(payload) {
  const response = await apiFetch("/api/habits/event", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Could not save that event yet.");
  }
  await loadHabitEventsFromServer();
  return response.json();
}

async function loadHabitEventsFromServer(days = 30) {
  if (!getToken()) return;
  const response = await apiFetch(`/api/habits/events?days=${days}`);
  if (!response.ok) {
    habitEventsCache = [];
    return;
  }
  const data = await response.json();
  habitEventsCache = data.events || [];
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

async function loadLatestMealPlanFromServer() {
  if (!getToken()) return null;
  const response = await apiFetch("/api/plan/latest");
  if (!response.ok) return null;
  const data = await response.json();
  if (data.plan) {
    writeMealPlan(data.plan);
    return data.plan;
  }
  return null;
}

async function loadMealPlanHistory() {
  if (!getToken()) return [];
  const response = await apiFetch("/api/plan/history");
  if (!response.ok) {
    mealPlanHistoryCache = [];
    return [];
  }
  const data = await response.json();
  mealPlanHistoryCache = data.plans || [];
  return mealPlanHistoryCache;
}

async function loadPlanAdherence(planId = null) {
  if (!getToken()) return [];
  const query = planId ? `?plan_id=${encodeURIComponent(planId)}&days=90` : "?days=90";
  const response = await apiFetch(`/api/plan/adherence${query}`);
  if (!response.ok) {
    planAdherenceCache = [];
    return [];
  }
  const data = await response.json();
  planAdherenceCache = data.records || [];
  return planAdherenceCache;
}

function planAdherenceKey(plan, day, mealIndex) {
  return [
    plan?._server_id || "",
    plan?._created_at || "",
    day || "",
    mealIndex,
  ].join("|");
}

function getAdherenceForMeal(plan, day, mealIndex) {
  const key = planAdherenceKey(plan, day, mealIndex);
  return planAdherenceCache.find((record) => {
    return planAdherenceKey(
      { _server_id: record.plan_id, _created_at: record.plan_created_at },
      record.day,
      record.meal_index,
    ) === key;
  });
}

async function markPlanMealStatus(plan, day, mealIndex, meal, status) {
  const response = await apiFetch("/api/plan/adherence", {
    method: "POST",
    body: JSON.stringify({
      plan_id: plan?._server_id || null,
      plan_created_at: plan?._created_at || "",
      day,
      meal_index: mealIndex,
      meal_name: meal?.name || "",
      meal_type: meal?.meal_type || "",
      status,
      notes: status === "swapped" ? "User marked this meal as swapped." : "",
    }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Could not update plan status.");
  }
  const data = await response.json();
  planAdherenceCache = data.records || planAdherenceCache;
  renderMealPlan(plan);
  return data;
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
  const response = await apiFetch("/api/plan/save", {
    method: "POST",
    body: JSON.stringify({ plan_data: plan }),
  });
  if (response.ok) {
    const data = await response.json().catch(() => ({}));
    if (data.plan_id) {
      plan._server_id = data.plan_id;
      plan._created_at = data.created_at || plan._created_at || new Date().toISOString();
      writeMealPlan(plan);
    }
    await loadMealPlanHistory();
  }
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
    loadUnifiedReportHistory();
  }

  if (viewName === "sizzle") {
    loadSizzleHistoryFromServer().then(() => renderSizzleMessages());
    renderSizzleMessages();
  }

  if (viewName === "settings") {
    renderSettings();
    loadSizzleMemories();
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

  if (readUser()) {
    renderHomeCoachMotivation(readUser());
  }
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
  renderHomePersonalization();
}

function getWellbeingRecord(collection, date = getTodayKey()) {
  return (wellbeingCache?.[collection] || []).find((item) => {
    return item.checkin_date === date || item.sleep_date === date || item.log_date === date;
  }) || {};
}

function getTodayWellbeing() {
  return {
    daily: getWellbeingRecord("daily_checkins"),
    sleep: getWellbeingRecord("sleep_logs"),
    recovery: getWellbeingRecord("recovery_logs"),
  };
}

function sliderValue(value, fallback = 5) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function renderWellbeingSlider(name, label, value, low, high) {
  const safeValue = sliderValue(value);
  return `
    <label class="wellbeing-slider">
      <span>${escapeHtml(label)} <strong data-wellbeing-value="${escapeHtml(name)}">${safeValue}/10</strong></span>
      <input class="wellbeing-range" name="${escapeHtml(name)}" type="range" min="1" max="10" value="${safeValue}" data-value-target="${escapeHtml(name)}">
      <small>${escapeHtml(low)} · ${escapeHtml(high)}</small>
    </label>
  `;
}

function renderDailyWellbeingCard() {
  if (!dailyWellbeingCard) return;
  const { daily, sleep, recovery } = getTodayWellbeing();
  const completed = Boolean(daily.id || sleep.id || recovery.id);
  const sleepHours = sleep.duration_minutes ? (Number(sleep.duration_minutes) / 60).toFixed(1) : "";
  const selectedMood = daily.mood || "🙂";
  const moodOptions = ["😔", "😐", "🙂", "😊", "🔥"];

  dailyWellbeingCard.innerHTML = `
    <div class="home-card-heading">
      <div>
        <p class="eyebrow flame">Daily wellbeing check-in</p>
        <h3>${completed ? "Today's check-in is saved" : "Thirty seconds for tomorrow-you"}</h3>
      </div>
      <span>${completed ? "Saved" : "New"}</span>
    </div>
    <form id="wellbeingCheckInForm" class="wellbeing-form">
      <div class="wellbeing-question">
        <span>How did you sleep?</span>
        <div class="wellbeing-inline">
          <label>Hours <input name="sleepHours" type="number" min="0" max="14" step="0.25" value="${escapeHtml(sleepHours)}" placeholder="7.5"></label>
          <label>Quality <input name="sleep_quality" type="range" min="1" max="10" value="${sliderValue(sleep.quality)}" class="wellbeing-range" data-value-target="sleep_quality"></label>
          <strong data-wellbeing-value="sleep_quality">${sliderValue(sleep.quality)}/10</strong>
        </div>
      </div>
      <div class="wellbeing-time-row">
        <label>Bedtime <input name="bedtime" type="time" value="${escapeHtml(sleep.bedtime || "")}"></label>
        <label>Wake time <input name="wake_time" type="time" value="${escapeHtml(sleep.wake_time || "")}"></label>
        <label>Wake-ups <input name="interruptions" type="number" min="0" max="10" value="${escapeHtml(sleep.interruptions ?? 0)}"></label>
      </div>
      <div class="daily-mood-pills wellbeing-moods" aria-label="Wellbeing mood">
        ${moodOptions.map((mood) => `
          <button class="${selectedMood === mood ? "active" : ""}" type="button" data-wellbeing-mood="${escapeHtml(mood)}">${escapeHtml(mood)}</button>
        `).join("")}
      </div>
      <input type="hidden" name="mood" value="${escapeHtml(selectedMood)}">
      <div class="wellbeing-grid">
        ${renderWellbeingSlider("energy", "How is your energy today?", daily.energy, "Low", "Strong")}
        ${renderWellbeingSlider("stress", "How stressed are you?", daily.stress, "Calm", "High")}
        ${renderWellbeingSlider("cravings", "Any cravings today?", daily.cravings, "Quiet", "Loud")}
        ${renderWellbeingSlider("readiness", "How recovered do you feel?", recovery.readiness, "Heavy", "Ready")}
      </div>
      <details class="wellbeing-more">
        <summary>Optional recovery details</summary>
        <div class="wellbeing-grid">
          ${renderWellbeingSlider("soreness", "Soreness", recovery.soreness, "Fresh", "Sore")}
          ${renderWellbeingSlider("fatigue", "Fatigue", recovery.fatigue, "Light", "Heavy")}
          ${renderWellbeingSlider("hydration", "Hydration", recovery.hydration, "Low", "Great")}
        </div>
        <label class="wellbeing-note">Notes <textarea name="notes" rows="2" placeholder="Anything your body is telling you today?">${escapeHtml(daily.notes || recovery.notes || "")}</textarea></label>
      </details>
      <button class="gradient-button compact" type="submit">${completed ? "Update check-in" : "Save check-in"}</button>
      <p class="analytics-muted">Supportive signal only. No pressure, no diagnosis.</p>
    </form>
  `;
}

async function submitWellbeingCheckIn(form) {
  const formData = new FormData(form);
  const sleepHours = Number(formData.get("sleepHours") || 0);
  const payload = {
    checkin_date: getTodayKey(),
    sleep_date: getTodayKey(),
    mood: formData.get("mood") || "🙂",
    energy: Number(formData.get("energy") || 5),
    stress: Number(formData.get("stress") || 5),
    cravings: Number(formData.get("cravings") || 5),
    notes: formData.get("notes")?.trim() || "",
    bedtime: formData.get("bedtime") || "",
    wake_time: formData.get("wake_time") || "",
    duration_minutes: Math.round(Math.max(0, sleepHours) * 60),
    sleep_quality: Number(formData.get("sleep_quality") || 5),
    interruptions: Number(formData.get("interruptions") || 0),
    sleep_notes: formData.get("notes")?.trim() || "",
    soreness: Number(formData.get("soreness") || 5),
    fatigue: Number(formData.get("fatigue") || 5),
    readiness: Number(formData.get("readiness") || 5),
    hydration: Number(formData.get("hydration") || 5),
    recovery_notes: formData.get("notes")?.trim() || "",
  };
  await saveWellbeingCheckIn(payload);
  renderHomePersonalization();
  updateInsightsState();
  showToast("Check-in saved. Tiny signal, big awareness.");
}

const habitTypeConfig = {
  smoking: {
    label: "Smoking",
    icon: "🚬",
    quantityLabel: "Amount",
    quantityPlaceholder: "1",
    intensityLabel: "Craving intensity",
    contextLabel: "Context",
    contextPlaceholder: "After work, with friends...",
    notesPlaceholder: "Anything useful to remember?",
    triggers: ["Stress", "After meal", "Social", "Bored", "Alcohol", "Work break"],
    moods: ["😔", "😐", "🙂", "😤", "😴"],
  },
  craving: {
    label: "Craving",
    icon: "⚡",
    quantityLabel: "Craving type",
    quantityPlaceholder: "Sweet, salty, nicotine...",
    intensityLabel: "Intensity",
    contextLabel: "Context",
    contextPlaceholder: "Evening, studying, commute...",
    notesPlaceholder: "What would support you right now?",
    triggers: ["Stress", "Low sleep", "Long gap", "Evening", "Social", "Emotion"],
    moods: ["😔", "😐", "🙂", "😤", "😴"],
  },
  alcohol: {
    label: "Alcohol",
    icon: "🍺",
    quantityLabel: "Drinks",
    quantityPlaceholder: "1",
    intensityLabel: "Pull/intensity",
    contextLabel: "Drink type",
    contextPlaceholder: "Beer, wine, cocktail...",
    notesPlaceholder: "Plan for tomorrow-you?",
    triggers: ["Social", "Weekend", "Stress", "Celebration", "Dinner out", "Bored"],
    moods: ["😊", "😐", "😔", "🔥", "😴"],
  },
};

function selectedHabitType() {
  return localStorage.getItem(HABIT_TYPE_KEY) || "craving";
}

function renderHabitQuickLog() {
  if (!habitQuickLogCard) return;
  const type = selectedHabitType();
  const config = habitTypeConfig[type] || habitTypeConfig.craving;
  const todayEvents = habitEventsCache.filter((event) => dateKey(event.timestamp) === getTodayKey());
  habitQuickLogCard.innerHTML = `
    <div class="home-card-heading">
      <div>
        <p class="eyebrow flame">Quick habit log</p>
        <h3>Notice the pattern, then choose your next move</h3>
      </div>
      <span>${todayEvents.length} today</span>
    </div>
    <form id="habitQuickLogForm" class="habit-form" data-habit-type="${escapeHtml(type)}">
      <div class="habit-type-pills">
        ${Object.entries(habitTypeConfig).map(([key, item]) => `
          <button class="${key === type ? "active" : ""}" type="button" data-habit-type-option="${escapeHtml(key)}">${escapeHtml(item.icon)} ${escapeHtml(item.label)}</button>
        `).join("")}
      </div>
      <div class="habit-form-grid">
        <label>
          ${escapeHtml(config.quantityLabel)}
          <input name="quantity" type="${type === "craving" ? "text" : "number"}" min="0" step="0.5" placeholder="${escapeHtml(config.quantityPlaceholder)}">
        </label>
        <label>
          ${escapeHtml(config.intensityLabel)} <strong data-habit-intensity-value>5/10</strong>
          <input class="habit-intensity-range" name="intensity" type="range" min="1" max="10" value="5">
        </label>
      </div>
      <div class="habit-trigger-row">
        ${config.triggers.map((trigger, index) => `
          <button class="${index === 0 ? "active" : ""}" type="button" data-habit-trigger="${escapeHtml(trigger)}">${escapeHtml(trigger)}</button>
        `).join("")}
      </div>
      <input type="hidden" name="trigger" value="${escapeHtml(config.triggers[0])}">
      <div class="habit-form-grid">
        <label>
          ${escapeHtml(config.contextLabel)}
          <input name="context" type="text" placeholder="${escapeHtml(config.contextPlaceholder)}">
        </label>
        <label>
          Mood
          <select name="mood">
            ${config.moods.map((mood) => `<option>${escapeHtml(mood)}</option>`).join("")}
          </select>
        </label>
      </div>
      <label>
        Notes
        <input name="notes" type="text" placeholder="${escapeHtml(config.notesPlaceholder)}">
      </label>
      <button class="gradient-button compact" type="submit">Log without judgment</button>
      <p class="analytics-muted">This is data, not a verdict. Better decisions start with seeing the pattern.</p>
    </form>
  `;
}

async function submitHabitQuickLog(form) {
  const formData = new FormData(form);
  const type = form.dataset.habitType || "craving";
  const rawQuantity = formData.get("quantity");
  const numericQuantity = Number(rawQuantity);
  const payload = {
    event_type: type,
    timestamp: new Date().toISOString(),
    quantity: Number.isFinite(numericQuantity) ? numericQuantity : 1,
    intensity: Number(formData.get("intensity") || 5),
    trigger: formData.get("trigger") || "Not specified",
    context: type === "craving" ? String(rawQuantity || formData.get("context") || "").trim() : formData.get("context") || "",
    mood: formData.get("mood") || "",
    notes: formData.get("notes") || "",
  };
  if (type === "alcohol" && !payload.context) {
    payload.context = "Drink";
  }
  await saveHabitEvent(payload);
  renderHabitQuickLog();
  updateInsightsState();
  showToast("Logged. Awareness is a win.");
}

function renderSocialPlanner(plan = null) {
  if (!socialPlannerCard) return;
  socialPlannerCard.innerHTML = `
    <div class="home-card-heading">
      <div>
        <p class="eyebrow flame">Drink smarter & social eating</p>
        <h3>Planning a social moment?</h3>
      </div>
      <span>Flexible</span>
    </div>
    <form id="socialPlannerForm" class="habit-form social-form">
      <div class="habit-form-grid">
        <label>
          Event
          <select name="event_type">
            <option>party tonight</option>
            <option>wedding</option>
            <option>vacation</option>
            <option>clubbing</option>
            <option>dinner outing</option>
            <option>drinks with friends</option>
          </select>
        </label>
        <label>
          Drink
          <select name="drink_type">
            <option value="beer">Beer</option>
            <option value="wine">Wine</option>
            <option value="whiskey">Whiskey</option>
            <option value="vodka">Vodka</option>
            <option value="gin">Gin</option>
            <option value="rum">Rum</option>
            <option value="cocktails">Cocktails</option>
          </select>
        </label>
      </div>
      <div class="habit-form-grid">
        <label>
          Planned drinks
          <input name="planned_drinks" type="number" min="0" max="20" step="0.5" value="2">
        </label>
        <label>
          Context
          <input name="context" type="text" placeholder="Dinner, dancing, match night...">
        </label>
      </div>
      <button class="gradient-button compact" type="submit">Build my plan</button>
      <p class="analytics-muted">Enjoy the moment. FuelFlow helps you plan, adjust, and recover.</p>
    </form>
    <div id="socialPlanResult" class="${plan ? "social-plan-result" : "hidden-soft"}">
      ${plan ? renderSocialPlanResult(plan) : ""}
    </div>
  `;
}

function renderSocialPlanResult(plan) {
  const drink = plan.selected_drink || {};
  const sections = [
    ["Before", plan.before_event || []],
    ["During", plan.during_event || []],
    ["After", plan.after_event || []],
  ];
  return `
    <article class="drink-reference-strip">
      <span>${escapeHtml(drink.label || "Drink")}</span>
      <strong>${escapeHtml(plan.estimated_calorie_impact ?? 0)} kcal planned</strong>
      <small>${escapeHtml(drink.alcohol_content || "ABV varies")} Â· ${escapeHtml(drink.goal_compatibility_score ?? 0)}/100 alignment</small>
    </article>
    <div class="social-plan-grid">
      ${sections.map(([title, items]) => `
        <article class="social-phase-card">
          <h4>${escapeHtml(title)}</h4>
          ${(items || []).slice(0, 4).map((item) => `<p>${escapeHtml(item)}</p>`).join("")}
        </article>
      `).join("")}
    </div>
    <article class="social-phase-card">
      <h4>Smart adjustments</h4>
      ${(plan.smart_meal_adjustments || []).map((item) => `<p>${escapeHtml(item)}</p>`).join("")}
      <strong>${escapeHtml(plan.supportive_note || "One social moment does not define your progress.")}</strong>
    </article>
    <article class="social-phase-card">
      <h4>Lower-calorie swaps</h4>
      ${(plan.alternatives?.lower_calorie || []).slice(0, 3).map((item) => `<p>${escapeHtml(item)}</p>`).join("")}
      <h4>Goal-friendly options</h4>
      ${(plan.alternatives?.goal_friendly || []).slice(0, 2).map((item) => `<p>${escapeHtml(item)}</p>`).join("")}
    </article>
  `;
}

async function submitSocialPlanner(form) {
  const formData = new FormData(form);
  const button = form.querySelector("button[type='submit']");
  button.disabled = true;
  try {
    const response = await apiFetch("/api/social/plan", {
      method: "POST",
      body: JSON.stringify({
        event_type: formData.get("event_type"),
        drink_type: formData.get("drink_type"),
        planned_drinks: Number(formData.get("planned_drinks") || 0),
        context: formData.get("context") || "",
        user_profile: readUser() || {},
      }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "Could not build your plan yet.");
    }
    const plan = await response.json();
    const result = socialPlannerCard.querySelector("#socialPlanResult");
    result.classList.remove("hidden-soft");
    result.innerHTML = renderSocialPlanResult(plan);
    showToast("Social plan ready. Enjoy it with intention.");
  } catch (error) {
    showToast(error.message || "Social planner paused. Try again.");
  } finally {
    button.disabled = false;
  }
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

function getTodaysLogs() {
  return readLogs()
    .filter((log) => isToday(log.timestamp))
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

function getRecentLogs(days = 7) {
  const start = new Date();
  start.setDate(start.getDate() - (days - 1));
  start.setHours(0, 0, 0, 0);
  return readLogs()
    .filter((log) => new Date(log.timestamp) >= start)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

function averageEnergy(logs) {
  const values = logs
    .map((log) => Number(log.energy))
    .filter((value) => Number.isFinite(value) && value > 0);
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function getHomeMoodLabel() {
  const dailyMood = readDailyMoodData()[getTodayKey()]?.mood;
  if (dailyMood) return dailyMood;
  const wellbeingMood = getWellbeingRecord("daily_checkins")?.mood;
  if (wellbeingMood) return wellbeingMood;
  const latest = [...getTodaysLogs()].reverse().find((log) => log.moodAfter?.emoji || log.moodAfter?.label);
  if (latest?.moodAfter?.emoji) {
    return `${latest.moodAfter.emoji} ${latest.moodAfter.label || ""}`.trim();
  }
  return "Check in when ready";
}

function getHomeFocus(user, todaysLogs, recentLogs) {
  const goal = String(user?.goal || "").toLowerCase();
  const todayEnergy = averageEnergy(todaysLogs);
  const alcoholToday = todaysLogs.some((log) => log.alcohol);
  const lateRecent = recentLogs.some((log) => {
    const hour = new Date(log.timestamp).getHours();
    return hour >= 22 || hour < 4;
  });

  if (!todaysLogs.length) return "Log one honest meal";
  if (alcoholToday) return "Hydrate and steady your next meal";
  if (todayEnergy && todayEnergy < 6) return "Choose steady energy";
  if (goal.includes("gain")) return "Consistent protein intake";
  if (goal.includes("lose")) return "Simple meals, steady rhythm";
  if (goal.includes("energy")) return "Protect meal timing";
  if (lateRecent) return "Plan your evening snack";
  return "Keep the rhythm going";
}

function getHomeInsight(user, todaysLogs, recentLogs) {
  if (!recentLogs.length) {
    return {
      title: "Start with one useful signal",
      text: "Log your next meal with mood and energy. One honest entry gives FuelFlow something real to reflect back to you.",
      tag: "First step",
    };
  }

  const moodImproved = recentLogs.filter((log) => {
    const before = log.moodBefore?.label;
    const after = log.moodAfter?.label;
    return before && after && before !== after && after !== "Stressed" && after !== "Angry";
  }).length;
  const avgEnergy = averageEnergy(recentLogs);
  const alcoholLogs = recentLogs.filter((log) => log.alcohol).length;
  const lateLogs = recentLogs.filter((log) => {
    const hour = new Date(log.timestamp).getHours();
    return hour >= 22 || hour < 4;
  }).length;
  const loggedDays = new Set(recentLogs.map((log) => dateKey(log.timestamp))).size;

  if (alcoholLogs) {
    return {
      title: "Alcohol is a recovery signal",
      text: `${alcoholLogs} recent log${alcoholLogs > 1 ? "s included" : " included"} alcohol. No judgment here: pair the next day with water, protein, and an easier meal rhythm.`,
      tag: "Recovery",
    };
  }
  if (lateLogs) {
    return {
      title: "Your evenings are worth planning",
      text: `${lateLogs} recent meal${lateLogs > 1 ? "s were" : " was"} logged late. A planned evening snack may support energy better than waiting until you're drained.`,
      tag: "Timing",
    };
  }
  if (moodImproved >= Math.ceil(recentLogs.length / 3)) {
    return {
      title: "Food is supporting your mood",
      text: "Several recent meals ended with a better emotional state. Notice what those meals had in common: timing, comfort, protein, or simply eating before you were depleted.",
      tag: "Mood",
    };
  }
  if (avgEnergy >= 7) {
    return {
      title: "Your energy base looks strong",
      text: `Your recent average energy is ${avgEnergy.toFixed(1)}/10. Keep repeating the meal patterns that make your day feel steadier.`,
      tag: "Energy",
    };
  }
  return {
    title: "Consistency is becoming visible",
    text: `You logged meals on ${loggedDays} day${loggedDays === 1 ? "" : "s"} recently. That awareness is the foundation FuelFlow uses to guide your next move.`,
    tag: "Consistency",
  };
}

function getHomeMotivationText(user, streak, todaysLogs, recentLogs) {
  const goal = user?.goal || "your goal";
  if (!todaysLogs.length) {
    return `${user?.name || "You"}, today does not need to be perfect. Start with one meal, one mood check, and one honest note. That is how ${goal.toLowerCase()} becomes something you practice, not something you chase.`;
  }
  if (streak >= 30) {
    return `${streak} days of showing up is not luck. This is an identity now: someone who pays attention, adjusts, and keeps becoming stronger with food.`;
  }
  if (streak >= 7) {
    return `${streak} days in, and the pattern is clear: you keep coming back. Protect that rhythm today with one steady choice that supports ${goal.toLowerCase()}.`;
  }
  if (recentLogs.length >= 5) {
    return "You are building useful evidence about yourself. Keep the bar simple today: eat, notice, log, and let the pattern teach you.";
  }
  return "Momentum is built in small honest reps. You have already started today; now make the next choice a little easier for tomorrow-you.";
}

function renderDailyPulse(user) {
  const todaysLogs = getTodaysLogs();
  const recentLogs = getRecentLogs();
  const streak = calculateStreak(readLogs());
  const hasLoggedToday = todaysLogs.length > 0;
  const energy = averageEnergy(todaysLogs);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  homeHeading.textContent = `${greeting} ${user?.name ? user.name : ""} 🔥`.replace("  ", " ");
  homeSubheading.textContent = hasLoggedToday
    ? "Here is your food, mood, and energy pulse for today."
    : "Let's create one useful signal today. No pressure, just awareness.";
  homeMotivation.classList.remove("hidden-soft");
  streakText.textContent = hasLoggedToday ? `Day ${Math.max(streak, 1)} streak` : "Start today's streak 🔥";
  homeMoodText.textContent = getHomeMoodLabel();
  homeEnergyText.textContent = energy ? `${energy.toFixed(1)}/10 average` : "No meals yet";
  homeFocusText.textContent = getHomeFocus(user, todaysLogs, recentLogs);
}

function renderHomeInsight(user) {
  const insight = getHomeInsight(user, getTodaysLogs(), getRecentLogs());
  todayInsightCard.innerHTML = `
    <div class="home-card-heading">
      <div>
        <p class="eyebrow flame">Today's Insight</p>
        <h3>${escapeHtml(insight.title)}</h3>
      </div>
      <span>${escapeHtml(insight.tag)}</span>
    </div>
    <p>${escapeHtml(insight.text)}</p>
  `;
}

function renderRecommendedAction(user) {
  if (!recommendedActionCard) return;
  const todaysLogs = getTodaysLogs();
  const wellbeing = getTodayWellbeing();
  const hasCheckIn = Boolean(wellbeing.daily.id || wellbeing.sleep.id || wellbeing.recovery.id);
  let title = "Log one honest meal";
  let text = "Start with one useful signal: what you ate, how you felt, and your energy afterward.";
  let button = `<button class="gradient-button compact" type="button" data-nav-target="log">Log Meal</button>`;
  if (!hasCheckIn) {
    title = "Do your 30-second check-in";
    text = "Sleep, energy, stress, and cravings help FuelFlow coach the rest of your day with more care.";
    button = `<button class="gradient-button compact sizzle-context-button" type="button" data-sizzle-prompt="Give me one small daily focus based on my goal and wellbeing today.">Ask Sizzle for today's focus</button>`;
  } else if (todaysLogs.length) {
    title = "Ask Sizzle what to do next";
    text = `You've created signals today. Let Sizzle turn them into one practical next move for ${escapeHtml(user?.goal || "your goal")}.`;
    button = `<button class="gradient-button compact sizzle-context-button" type="button" data-sizzle-prompt="Based on my logs and check-in today, what is the one thing I should do next?">What Should I Do Next?</button>`;
  }
  recommendedActionCard.innerHTML = `
    <div class="home-card-heading">
      <div>
        <p class="eyebrow flame">Recommended action</p>
        <h3>${escapeHtml(title)}</h3>
      </div>
      <span>Today</span>
    </div>
    <p>${text}</p>
    <div class="sizzle-action-row">${button}</div>
  `;
}

function renderHomeCoachMotivation(user) {
  const streak = calculateStreak(readLogs());
  dailyQuoteText.textContent = getHomeMotivationText(user, streak, getTodaysLogs(), getRecentLogs());
}

function renderHomeLearning() {
  const learningItems = exploreItems.filter((item) => !item.highlight).slice(0, 4);
  homeLearningCards.innerHTML = learningItems.map((item, index) => `
    <article class="learning-card">
      <span>${escapeHtml(item.icon)}</span>
      <p class="eyebrow flame">${index === 0 ? "Today's Article" : "Nutrition Education"}</p>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description)}</p>
      <strong>${escapeHtml(item.benefit || "A small lesson for real life eating.")}</strong>
    </article>
  `).join("");
}

function renderCuisineSpotlight() {
  const cuisineItems = exploreItems.filter((item) => {
    const title = item.title.toLowerCase();
    return !item.highlight && !title.includes("budget") && !title.includes("athlete") && !title.includes("drinking");
  });
  const item = cuisineItems[Math.floor(Date.now() / 86400000) % cuisineItems.length] || exploreItems[1];
  cuisineSpotlight.innerHTML = `
    <div class="home-card-heading">
      <div>
        <p class="eyebrow flame">Global Cuisine Spotlight</p>
        <h3>${escapeHtml(item.title)}</h3>
      </div>
      <span>${escapeHtml(item.icon)}</span>
    </div>
    <p>${escapeHtml(item.description)}</p>
    <div class="spotlight-list">
      ${(item.details || []).slice(0, 3).map((detail) => `<span>${escapeHtml(detail)}</span>`).join("")}
    </div>
    <p class="spotlight-lesson">${escapeHtml(item.benefit || "Nutrition lesson: simple, satisfying meals are easier to repeat.")}</p>
  `;
}

function renderCommunityStory() {
  const supportItem = exploreItems.find((item) => item.highlight);
  const stories = supportItem?.stories || [];
  const story = stories[Math.floor(Date.now() / 86400000) % Math.max(stories.length, 1)] || {};
  communityStoryCard.innerHTML = `
    <div class="home-card-heading">
      <div>
        <p class="eyebrow flame">Community Story</p>
        <h3>${escapeHtml(story.name || "A FuelFlow member")}</h3>
      </div>
      <span>💛</span>
    </div>
    <p>"${escapeHtml(story.text || "Small, kind habits can change how food feels day by day.")}"</p>
    <small>${escapeHtml(supportItem?.note || "Stories are illustrative and represent common experiences.")}</small>
  `;
}

function renderHomePersonalization() {
  const user = readUser();
  if (!user) {
    homeHeading.textContent = "Good morning 🔥";
    homeSubheading.textContent = "Your supportive check-in for food, mood, energy, and momentum.";
    homeMotivation.classList.add("hidden-soft");
    dailyMoodCheckIn.classList.add("hidden-soft");
    recommendedActionCard.innerHTML = "";
    dailyWellbeingCard.innerHTML = "";
    habitQuickLogCard.innerHTML = "";
    socialPlannerCard.innerHTML = "";
    homeProgress.classList.add("hidden-soft");
    journeyCard.classList.add("hidden-soft");
    profileCard.classList.add("hidden-soft");
    return;
  }

  renderDailyPulse(user);
  renderDailyMoodCheckIn();
  renderRecommendedAction(user);
  renderDailyWellbeingCard();
  renderHabitQuickLog();
  renderSocialPlanner();
  renderHomeInsight(user);
  renderHomeCoachMotivation(user);
  renderHomeLearning();
  renderCuisineSpotlight();
  renderCommunityStory();
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

function bodySvg(content, label = "body reference", fixedGradientId = "") {
  bodySvg.counter = (bodySvg.counter || 0) + 1;
  const gradientId = fixedGradientId || `bodyGrad${bodySvg.counter}`;
  const scopedContent = content.replaceAll("url(#bodyGrad)", `url(#${gradientId})`);
  return `
    <svg width="100%" height="80" viewBox="0 0 80 140" role="img" aria-label="${escapeHtml(label)}">
      <defs>
        <linearGradient id="${gradientId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#FF8C00"/>
          <stop offset="100%" stop-color="#FF4500"/>
        </linearGradient>
      </defs>
      ${scopedContent}
    </svg>
  `;
}

function lineRect(x, y, w, h, rx = 1) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="#2A0B00" opacity="0.42"/>`;
}

function getBodyTypeSvg(type) {
  const figures = {
    "Ectomorph": `
      <circle cx="40" cy="15" r="10" fill="url(#bodyGrad)"/>
      <rect x="37" y="24" width="6" height="8" rx="2" fill="url(#bodyGrad)"/>
      <ellipse cx="40" cy="35" rx="14" ry="6" fill="url(#bodyGrad)"/>
      <path d="M28 36 C31 46 31 62 31 75 L49 75 C49 62 49 46 52 36 Z" fill="url(#bodyGrad)"/>
      <rect x="23" y="37" width="6" height="44" rx="3" fill="url(#bodyGrad)"/>
      <rect x="51" y="37" width="6" height="44" rx="3" fill="url(#bodyGrad)"/>
      <ellipse cx="40" cy="77" rx="14" ry="5" fill="url(#bodyGrad)"/>
      <rect x="31" y="80" width="8" height="60" rx="4" fill="url(#bodyGrad)"/>
      <rect x="41" y="80" width="8" height="60" rx="4" fill="url(#bodyGrad)"/>
    `,
    "Skinny Fat": `
      <circle cx="40" cy="15" r="10" fill="url(#bodyGrad)"/>
      <rect x="37" y="24" width="6" height="8" rx="2" fill="url(#bodyGrad)"/>
      <ellipse cx="40" cy="35" rx="16" ry="6" fill="url(#bodyGrad)"/>
      <path d="M26 36 C32 46 32 68 29 78 L51 78 C48 68 48 46 54 36 Z" fill="url(#bodyGrad)"/>
      <ellipse cx="40" cy="61" rx="18" ry="14" fill="url(#bodyGrad)"/>
      <rect x="21" y="39" width="7" height="45" rx="3.5" fill="url(#bodyGrad)"/>
      <rect x="52" y="39" width="7" height="45" rx="3.5" fill="url(#bodyGrad)"/>
      <ellipse cx="40" cy="80" rx="18" ry="6" fill="url(#bodyGrad)"/>
      <rect x="29" y="84" width="10" height="56" rx="5" fill="url(#bodyGrad)"/>
      <rect x="41" y="84" width="10" height="56" rx="5" fill="url(#bodyGrad)"/>
    `,
    "Mesomorph": `
      <circle cx="40" cy="15" r="10" fill="url(#bodyGrad)"/>
      <rect x="36" y="24" width="8" height="8" rx="2" fill="url(#bodyGrad)"/>
      <ellipse cx="40" cy="36" rx="24" ry="7" fill="url(#bodyGrad)"/>
      <path d="M16 38 L64 38 C61 52 55 63 52 65 L28 65 C25 63 19 52 16 38 Z" fill="url(#bodyGrad)"/>
      <ellipse cx="33" cy="45" rx="7" ry="5" fill="#2A0B00" opacity="0.25"/>
      <ellipse cx="47" cy="45" rx="7" ry="5" fill="#2A0B00" opacity="0.25"/>
      ${lineRect(31, 52, 18, 2, 1)}${lineRect(32, 58, 16, 2, 1)}${lineRect(34, 64, 12, 2, 1)}
      <path d="M25 66 L55 66 L57 78 L23 78 Z" fill="url(#bodyGrad)"/>
      <path d="M17 41 C8 51 9 69 18 83 C24 78 24 57 28 43 Z" fill="url(#bodyGrad)"/>
      <path d="M63 41 C72 51 71 69 62 83 C56 78 56 57 52 43 Z" fill="url(#bodyGrad)"/>
      <path d="M25 80 C35 82 38 101 36 140 L25 140 C25 118 20 95 25 80 Z" fill="url(#bodyGrad)"/>
      <path d="M55 80 C45 82 42 101 44 140 L55 140 C55 118 60 95 55 80 Z" fill="url(#bodyGrad)"/>
    `,
    "Endomorph": `
      <circle cx="40" cy="12" r="9" fill="url(#bodyGrad)"/>
      <rect x="37" y="20" width="6" height="6" rx="2" fill="url(#bodyGrad)"/>
      <ellipse cx="40" cy="30" rx="18" ry="6" fill="url(#bodyGrad)"/>
      <rect x="24" y="30" width="32" height="12" rx="4" fill="url(#bodyGrad)"/>
      <ellipse cx="40" cy="58" rx="22" ry="18" fill="url(#bodyGrad)"/>
      <ellipse cx="40" cy="74" rx="19" ry="7" fill="url(#bodyGrad)"/>
      <ellipse cx="17" cy="50" rx="6" ry="16" fill="url(#bodyGrad)"/>
      <ellipse cx="63" cy="50" rx="6" ry="16" fill="url(#bodyGrad)"/>
      <ellipse cx="32" cy="100" rx="8" ry="18" fill="url(#bodyGrad)"/>
      <ellipse cx="48" cy="100" rx="8" ry="18" fill="url(#bodyGrad)"/>
    `,
    "Athletic/Fit": `
      <circle cx="40" cy="15" r="10" fill="url(#bodyGrad)"/>
      <rect x="36" y="24" width="8" height="8" rx="2" fill="url(#bodyGrad)"/>
      <path d="M12 36 C20 26 60 26 68 36 C62 42 57 43 52 40 L28 40 C23 43 18 42 12 36 Z" fill="url(#bodyGrad)"/>
      <path d="M18 39 L62 39 C58 55 52 70 49 73 L31 73 C28 70 22 55 18 39 Z" fill="url(#bodyGrad)"/>
      <ellipse cx="32" cy="46" rx="8" ry="5" fill="#2A0B00" opacity="0.3"/>
      <ellipse cx="48" cy="46" rx="8" ry="5" fill="#2A0B00" opacity="0.3"/>
      ${lineRect(30, 54, 20, 2, 1)}${lineRect(31, 60, 18, 2, 1)}${lineRect(32, 66, 16, 2, 1)}${lineRect(34, 72, 12, 2, 1)}
      <path d="M13 42 C4 54 6 76 17 90 C24 82 25 56 29 43 Z" fill="url(#bodyGrad)"/>
      <path d="M67 42 C76 54 74 76 63 90 C56 82 55 56 51 43 Z" fill="url(#bodyGrad)"/>
      <ellipse cx="18" cy="61" rx="7" ry="12" fill="url(#bodyGrad)"/>
      <ellipse cx="62" cy="61" rx="7" ry="12" fill="url(#bodyGrad)"/>
      <path d="M26 78 C38 80 39 101 36 140 L23 140 C24 119 18 94 26 78 Z" fill="url(#bodyGrad)"/>
      <path d="M54 78 C42 80 41 101 44 140 L57 140 C56 119 62 94 54 78 Z" fill="url(#bodyGrad)"/>
      ${lineRect(30, 93, 3, 34, 1)}${lineRect(47, 93, 3, 34, 1)}
    `,
    "Stocky/Powerbuilt": `
      <circle cx="40" cy="11" r="9" fill="url(#bodyGrad)"/>
      <rect x="36" y="19" width="8" height="6" rx="2" fill="url(#bodyGrad)"/>
      <rect x="14" y="24" width="52" height="10" rx="4" fill="url(#bodyGrad)"/>
      <ellipse cx="16" cy="28" rx="6" ry="8" fill="url(#bodyGrad)"/>
      <ellipse cx="64" cy="28" rx="6" ry="8" fill="url(#bodyGrad)"/>
      <rect x="20" y="34" width="40" height="32" rx="3" fill="url(#bodyGrad)"/>
      <rect x="22" y="64" width="36" height="10" rx="3" fill="url(#bodyGrad)"/>
      <rect x="8" y="26" width="12" height="36" rx="4" fill="url(#bodyGrad)"/>
      <rect x="60" y="26" width="12" height="36" rx="4" fill="url(#bodyGrad)"/>
      <rect x="22" y="74" width="14" height="36" rx="3" fill="url(#bodyGrad)"/>
      <rect x="44" y="74" width="14" height="36" rx="3" fill="url(#bodyGrad)"/>
    `,
  };
  const fixedIds = {
    "Endomorph": "bodyGradEndo",
    "Stocky/Powerbuilt": "bodyGradStocky",
  };
  return bodySvg(figures[type] || figures.Mesomorph, `${type} body type`, fixedIds[type] || "");
}

function getBodyFatSvg(shape = 2, sex = "Male", label = "body") {
  const female = sex === "Female";
  const maleFigures = [
    `
      <circle cx="40" cy="15" r="10" fill="url(#bodyGrad)"/><rect x="36" y="24" width="8" height="8" rx="2" fill="url(#bodyGrad)"/>
      <ellipse cx="40" cy="36" rx="25" ry="7" fill="url(#bodyGrad)"/><path d="M15 39 L65 39 C60 57 53 73 49 76 L31 76 C27 73 20 57 15 39 Z" fill="url(#bodyGrad)"/>
      <rect x="12" y="42" width="10" height="47" rx="5" fill="url(#bodyGrad)"/><rect x="58" y="42" width="10" height="47" rx="5" fill="url(#bodyGrad)"/>
      <rect x="25" y="78" width="12" height="62" rx="6" fill="url(#bodyGrad)"/><rect x="43" y="78" width="12" height="62" rx="6" fill="url(#bodyGrad)"/>
      ${lineRect(30, 49, 20, 2)}${lineRect(31, 56, 18, 2)}${lineRect(32, 63, 16, 2)}${lineRect(39, 47, 2, 29)}${lineRect(18, 59, 3, 19)}${lineRect(59, 59, 3, 19)}${lineRect(29, 96, 3, 30)}${lineRect(48, 96, 3, 30)}
    `,
    `
      <circle cx="40" cy="15" r="10" fill="url(#bodyGrad)"/><rect x="36" y="24" width="8" height="8" rx="2" fill="url(#bodyGrad)"/>
      <ellipse cx="40" cy="36" rx="23" ry="7" fill="url(#bodyGrad)"/><path d="M18 39 L62 39 C58 55 53 70 50 74 L30 74 C27 70 22 55 18 39 Z" fill="url(#bodyGrad)"/>
      <rect x="14" y="43" width="10" height="46" rx="5" fill="url(#bodyGrad)"/><rect x="56" y="43" width="10" height="46" rx="5" fill="url(#bodyGrad)"/>
      <rect x="26" y="78" width="13" height="62" rx="6" fill="url(#bodyGrad)"/><rect x="41" y="78" width="13" height="62" rx="6" fill="url(#bodyGrad)"/>
      ${lineRect(31, 52, 18, 2)}${lineRect(33, 60, 14, 2)}${lineRect(39, 51, 2, 21)}${lineRect(17, 61, 3, 16)}${lineRect(60, 61, 3, 16)}
    `,
    `
      <circle cx="40" cy="15" r="10" fill="url(#bodyGrad)"/><rect x="36" y="24" width="8" height="8" rx="2" fill="url(#bodyGrad)"/>
      <ellipse cx="40" cy="36" rx="20" ry="7" fill="url(#bodyGrad)"/><path d="M21 40 C27 34 53 34 59 40 L56 78 C52 90 28 90 24 78 Z" fill="url(#bodyGrad)"/>
      <ellipse cx="40" cy="68" rx="17" ry="13" fill="url(#bodyGrad)"/>
      <rect x="15" y="43" width="11" height="48" rx="6" fill="url(#bodyGrad)"/><rect x="54" y="43" width="11" height="48" rx="6" fill="url(#bodyGrad)"/>
      <rect x="26" y="84" width="14" height="56" rx="7" fill="url(#bodyGrad)"/><rect x="40" y="84" width="14" height="56" rx="7" fill="url(#bodyGrad)"/>
    `,
    `
      <circle cx="40" cy="15" r="10" fill="url(#bodyGrad)"/><rect x="35" y="24" width="10" height="8" rx="3" fill="url(#bodyGrad)"/>
      <ellipse cx="40" cy="36" rx="19" ry="7" fill="url(#bodyGrad)"/><path d="M21 39 C28 35 52 35 59 39 L60 82 C54 94 26 94 20 82 Z" fill="url(#bodyGrad)"/>
      <ellipse cx="40" cy="68" rx="23" ry="18" fill="url(#bodyGrad)"/><ellipse cx="40" cy="88" rx="23" ry="8" fill="url(#bodyGrad)"/>
      <rect x="12" y="43" width="13" height="50" rx="7" fill="url(#bodyGrad)"/><rect x="55" y="43" width="13" height="50" rx="7" fill="url(#bodyGrad)"/>
      <rect x="25" y="91" width="15" height="49" rx="7" fill="url(#bodyGrad)"/><rect x="40" y="91" width="15" height="49" rx="7" fill="url(#bodyGrad)"/>
    `,
    `
      <circle cx="40" cy="15" r="11" fill="url(#bodyGrad)"/><rect x="35" y="25" width="10" height="7" rx="3" fill="url(#bodyGrad)"/>
      <ellipse cx="40" cy="36" rx="20" ry="8" fill="url(#bodyGrad)"/><ellipse cx="40" cy="67" rx="30" ry="30" fill="url(#bodyGrad)"/>
      <ellipse cx="40" cy="95" rx="27" ry="9" fill="url(#bodyGrad)"/><rect x="9" y="42" width="15" height="54" rx="8" fill="url(#bodyGrad)"/><rect x="56" y="42" width="15" height="54" rx="8" fill="url(#bodyGrad)"/>
      <rect x="24" y="98" width="16" height="42" rx="8" fill="url(#bodyGrad)"/><rect x="40" y="98" width="16" height="42" rx="8" fill="url(#bodyGrad)"/>
    `,
    `
      <circle cx="40" cy="15" r="12" fill="url(#bodyGrad)"/><rect x="34" y="26" width="12" height="7" rx="3" fill="url(#bodyGrad)"/>
      <ellipse cx="40" cy="37" rx="22" ry="9" fill="url(#bodyGrad)"/><ellipse cx="40" cy="72" rx="36" ry="36" fill="url(#bodyGrad)"/>
      <ellipse cx="40" cy="103" rx="31" ry="11" fill="url(#bodyGrad)"/><rect x="5" y="43" width="17" height="58" rx="9" fill="url(#bodyGrad)"/><rect x="58" y="43" width="17" height="58" rx="9" fill="url(#bodyGrad)"/>
      <rect x="22" y="105" width="18" height="35" rx="9" fill="url(#bodyGrad)"/><rect x="40" y="105" width="18" height="35" rx="9" fill="url(#bodyGrad)"/>
    `,
  ];
  const femaleFigures = [
    `
      <circle cx="40" cy="15" r="10" fill="url(#bodyGrad)"/><rect x="36" y="24" width="8" height="8" rx="2" fill="url(#bodyGrad)"/>
      <ellipse cx="40" cy="36" rx="18" ry="7" fill="url(#bodyGrad)"/><path d="M24 39 C29 32 51 32 56 39 C53 53 51 65 55 78 C47 86 33 86 25 78 C29 65 27 53 24 39 Z" fill="url(#bodyGrad)"/>
      <ellipse cx="32" cy="47" rx="6" ry="5" fill="url(#bodyGrad)"/><ellipse cx="48" cy="47" rx="6" ry="5" fill="url(#bodyGrad)"/>
      <ellipse cx="40" cy="82" rx="24" ry="10" fill="url(#bodyGrad)"/><rect x="16" y="43" width="9" height="47" rx="5" fill="url(#bodyGrad)"/><rect x="55" y="43" width="9" height="47" rx="5" fill="url(#bodyGrad)"/>
      <rect x="25" y="88" width="13" height="52" rx="6" fill="url(#bodyGrad)"/><rect x="42" y="88" width="13" height="52" rx="6" fill="url(#bodyGrad)"/>
      ${lineRect(32, 55, 16, 2)}${lineRect(34, 63, 12, 2)}${lineRect(39, 53, 2, 22)}
    `,
    `
      <circle cx="40" cy="15" r="10" fill="url(#bodyGrad)"/><rect x="36" y="24" width="8" height="8" rx="2" fill="url(#bodyGrad)"/>
      <ellipse cx="40" cy="36" rx="18" ry="7" fill="url(#bodyGrad)"/><path d="M23 39 C29 33 51 33 57 39 C54 54 52 67 57 81 C48 90 32 90 23 81 C28 67 26 54 23 39 Z" fill="url(#bodyGrad)"/>
      <ellipse cx="32" cy="48" rx="6" ry="5" fill="url(#bodyGrad)"/><ellipse cx="48" cy="48" rx="6" ry="5" fill="url(#bodyGrad)"/>
      <ellipse cx="40" cy="85" rx="25" ry="11" fill="url(#bodyGrad)"/><rect x="15" y="43" width="10" height="48" rx="5" fill="url(#bodyGrad)"/><rect x="55" y="43" width="10" height="48" rx="5" fill="url(#bodyGrad)"/>
      <rect x="25" y="91" width="14" height="49" rx="7" fill="url(#bodyGrad)"/><rect x="41" y="91" width="14" height="49" rx="7" fill="url(#bodyGrad)"/>
      ${lineRect(33, 58, 14, 2)}${lineRect(39, 57, 2, 17)}
    `,
    `
      <circle cx="40" cy="15" r="10" fill="url(#bodyGrad)"/><rect x="36" y="24" width="8" height="8" rx="2" fill="url(#bodyGrad)"/>
      <ellipse cx="40" cy="36" rx="17" ry="7" fill="url(#bodyGrad)"/><path d="M22 40 C29 35 51 35 58 40 C56 55 56 68 60 82 C52 96 28 96 20 82 C24 68 24 55 22 40 Z" fill="url(#bodyGrad)"/>
      <ellipse cx="40" cy="69" rx="18" ry="15" fill="url(#bodyGrad)"/><ellipse cx="40" cy="89" rx="27" ry="12" fill="url(#bodyGrad)"/>
      <rect x="14" y="43" width="12" height="50" rx="6" fill="url(#bodyGrad)"/><rect x="54" y="43" width="12" height="50" rx="6" fill="url(#bodyGrad)"/>
      <rect x="24" y="96" width="15" height="44" rx="7" fill="url(#bodyGrad)"/><rect x="41" y="96" width="15" height="44" rx="7" fill="url(#bodyGrad)"/>
    `,
    `
      <circle cx="40" cy="15" r="10" fill="url(#bodyGrad)"/><rect x="35" y="24" width="10" height="8" rx="3" fill="url(#bodyGrad)"/>
      <ellipse cx="40" cy="37" rx="18" ry="8" fill="url(#bodyGrad)"/><ellipse cx="40" cy="68" rx="24" ry="25" fill="url(#bodyGrad)"/>
      <ellipse cx="40" cy="94" rx="30" ry="12" fill="url(#bodyGrad)"/><rect x="11" y="43" width="14" height="53" rx="7" fill="url(#bodyGrad)"/><rect x="55" y="43" width="14" height="53" rx="7" fill="url(#bodyGrad)"/>
      <rect x="23" y="100" width="17" height="40" rx="8" fill="url(#bodyGrad)"/><rect x="40" y="100" width="17" height="40" rx="8" fill="url(#bodyGrad)"/>
    `,
    `
      <circle cx="40" cy="15" r="11" fill="url(#bodyGrad)"/><rect x="35" y="25" width="10" height="7" rx="3" fill="url(#bodyGrad)"/>
      <ellipse cx="40" cy="37" rx="19" ry="8" fill="url(#bodyGrad)"/><ellipse cx="40" cy="70" rx="31" ry="31" fill="url(#bodyGrad)"/>
      <ellipse cx="40" cy="100" rx="31" ry="13" fill="url(#bodyGrad)"/><rect x="8" y="43" width="16" height="56" rx="8" fill="url(#bodyGrad)"/><rect x="56" y="43" width="16" height="56" rx="8" fill="url(#bodyGrad)"/>
      <rect x="22" y="106" width="18" height="34" rx="9" fill="url(#bodyGrad)"/><rect x="40" y="106" width="18" height="34" rx="9" fill="url(#bodyGrad)"/>
    `,
    `
      <circle cx="40" cy="15" r="12" fill="url(#bodyGrad)"/><rect x="34" y="26" width="12" height="7" rx="3" fill="url(#bodyGrad)"/>
      <ellipse cx="40" cy="38" rx="21" ry="9" fill="url(#bodyGrad)"/><ellipse cx="40" cy="75" rx="36" ry="36" fill="url(#bodyGrad)"/>
      <ellipse cx="40" cy="107" rx="34" ry="13" fill="url(#bodyGrad)"/><rect x="5" y="44" width="18" height="59" rx="9" fill="url(#bodyGrad)"/><rect x="57" y="44" width="18" height="59" rx="9" fill="url(#bodyGrad)"/>
      <rect x="21" y="112" width="19" height="28" rx="9" fill="url(#bodyGrad)"/><rect x="40" y="112" width="19" height="28" rx="9" fill="url(#bodyGrad)"/>
    `,
  ];
  const figures = female ? femaleFigures : maleFigures;
  return bodySvg(figures[shape] || figures[2], `${label} body fat reference`);
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

function formatMetricValue(value, fallback = "0") {
  return value === undefined || value === null || Number.isNaN(value) ? fallback : String(value);
}

function renderScoreBar(score) {
  const safeScore = Math.max(0, Math.min(100, Number(score || 0)));
  return `
    <div class="score-track" aria-label="Score ${safeScore} out of 100">
      <div class="score-fill" style="width: ${safeScore}%"></div>
    </div>
  `;
}

function renderEnergyRows(rows = []) {
  if (!rows.length) {
    return `<p class="analytics-muted">No energy scores by meal type yet.</p>`;
  }
  return rows.map((row) => {
    const energy = Number(row.average_energy || 0);
    return `
      <div class="energy-type-row">
        <span>${escapeHtml(row.meal_type)}</span>
        <div class="mini-energy-track"><div style="width: ${Math.max(0, Math.min(100, energy * 10))}%"></div></div>
        <strong>${energy.toFixed(1)}/10</strong>
      </div>
    `;
  }).join("");
}

function renderAnalyticsReport(report) {
  if (!report?.metrics) return;
  const metrics = report.metrics;
  analyticsContent.classList.remove("hidden-soft");
  analyticsEmpty.classList.add("hidden-soft");

  const mood = metrics.mood_uplift || {};
  const consistency = metrics.meal_consistency || {};
  const alcohol = metrics.alcohol_impact || {};
  const lateNight = metrics.late_night_eating || {};
  const goal = metrics.goal_alignment || {};

  analyticsMetricGrid.innerHTML = `
    <article class="card analytics-card highlight">
      <span class="analytics-label">Mood uplift</span>
      <strong>${formatMetricValue(mood.percentage)}%</strong>
      <p>${formatMetricValue(mood.sample_size)} meals had mood data. ${formatMetricValue(mood.same_or_better_percentage)}% stayed steady or improved.</p>
      ${renderScoreBar(mood.percentage)}
    </article>
    <article class="card analytics-card wide">
      <span class="analytics-label">Average energy by meal type</span>
      ${renderEnergyRows(metrics.energy_by_meal_type || [])}
    </article>
    <article class="card analytics-card">
      <span class="analytics-label">Alcohol impact</span>
      <strong>${formatMetricValue(alcohol.energy_delta, "0")} pts</strong>
      <p>${formatMetricValue(alcohol.alcohol_logs)} alcohol logs, ${formatMetricValue(alcohol.total_drinks)} drinks. Energy with alcohol: ${formatMetricValue(alcohol.average_energy_with_alcohol)}/10 vs ${formatMetricValue(alcohol.average_energy_without_alcohol)}/10 without.</p>
    </article>
    <article class="card analytics-card">
      <span class="analytics-label">Meal consistency</span>
      <strong>${formatMetricValue(consistency.score)}/100</strong>
      <p>${formatMetricValue(consistency.days_logged)} of ${formatMetricValue(consistency.days_analyzed, "7")} days logged, averaging ${formatMetricValue(consistency.meals_per_active_day)} meals on active days.</p>
      ${renderScoreBar(consistency.score)}
    </article>
    <article class="card analytics-card">
      <span class="analytics-label">Late-night eating</span>
      <strong>${formatMetricValue(lateNight.count)}</strong>
      <p>${formatMetricValue(lateNight.percentage)}% of logs happened between ${escapeHtml(lateNight.threshold || "10 PM to 4 AM")}.</p>
    </article>
    <article class="card analytics-card highlight">
      <span class="analytics-label">Goal alignment</span>
      <strong>${formatMetricValue(goal.score)}/100</strong>
      <p>${escapeHtml(goal.note || "Keep building consistency around your goal.")}</p>
      ${renderScoreBar(goal.score)}
    </article>
  `;

  analyticsSummaryText.textContent = report.summary || "Your report is ready. Keep logging and FuelFlow will keep sharpening the patterns.";
  analyticsRecommendations.innerHTML = (report.recommendations || [])
    .slice(0, 3)
    .map((item) => `<span>${escapeHtml(item)}</span>`)
    .join("");
}

async function loadAnalyticsReportHistory() {
  if (!analyticsReportHistory || !getToken()) return;
  analyticsReportHistory.innerHTML = `<p class="analytics-muted">Loading previous reports...</p>`;
  try {
    const response = await apiFetch("/api/analytics/reports");
    if (!response.ok) {
      throw new Error("Could not load report history.");
    }
    const data = await response.json();
    const reports = data.reports || [];
    if (!reports.length) {
      analyticsReportHistory.innerHTML = `<p class="analytics-muted">No reports yet. Generate your first weekly report above.</p>`;
      return;
    }
    analyticsReportHistory.innerHTML = reports.map((report, index) => {
      const created = new Date(report.created_at).toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const score = report.metrics?.goal_alignment?.score ?? 0;
      const activeClass = index === 0 ? " latest" : "";
      return `
        <button class="report-history-item${activeClass}" type="button" data-report-index="${index}">
          <span>${escapeHtml(created)}${index === 0 ? " - latest" : ""}</span>
          <strong>Goal alignment: ${escapeHtml(score)}/100</strong>
          <p>${escapeHtml(report.summary || "Saved behavioral report")}</p>
        </button>
      `;
    }).join("");
    analyticsReportHistory.dataset.reports = JSON.stringify(reports);
    renderAnalyticsReport(reports[0]);
  } catch (error) {
    analyticsReportHistory.innerHTML = `<p class="analytics-muted">${escapeHtml(error.message || "Report history paused.")}</p>`;
  }
}

async function generateBehavioralReport() {
  const logs = readLogs();
  if (logs.length < 3) {
    analyticsEmpty.classList.remove("hidden-soft");
    analyticsContent.classList.add("hidden-soft");
    showToast("Log at least 3 meals to unlock your behavioral dashboard.");
    return;
  }

  generateAnalyticsReportButton.disabled = true;
  analyticsLoading.classList.remove("hidden-soft");
  analyticsEmpty.classList.add("hidden-soft");

  try {
    const response = await apiFetch("/api/analytics/report", {
      method: "POST",
      body: JSON.stringify({ days: 7 }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "FuelFlow could not build your report yet.");
    }
    const report = await response.json();
    renderAnalyticsReport(report);
    await loadAnalyticsReportHistory();
    showToast("Your behavioral report is ready.");
  } catch (error) {
    showToast(error.message || "Something paused. Please try again.");
  } finally {
    generateAnalyticsReportButton.disabled = false;
    analyticsLoading.classList.add("hidden-soft");
  }
}

function renderTimingImpactRows(metrics = {}) {
  const energy = metrics.energy_impact || {};
  const mood = metrics.mood_impact || {};
  return `
    <div class="timing-impact-list">
      <span>Earlier first meal energy <strong>${formatMetricValue(energy.early_first_meal_avg_energy)}/10</strong></span>
      <span>Later first meal energy <strong>${formatMetricValue(energy.later_first_meal_avg_energy)}/10</strong></span>
      <span>Steady gaps mood shift <strong>${formatMetricValue(mood.steady_gap_avg_mood_delta)}</strong></span>
      <span>Long gaps mood shift <strong>${formatMetricValue(mood.long_gap_avg_mood_delta)}</strong></span>
    </div>
  `;
}

function renderTimingReport(report) {
  if (!report?.metrics) return;
  const metrics = report.metrics;
  const averages = metrics.average_times || {};
  const gaps = metrics.gaps || {};
  const consistency = metrics.consistency || {};
  const lateNight = metrics.late_night || {};
  const breakfast = metrics.breakfast_consistency || {};
  const weekSplit = metrics.weekday_vs_weekend || {};

  timingContent.classList.remove("hidden-soft");
  timingEmpty.classList.add("hidden-soft");

  timingMetricGrid.innerHTML = `
    <article class="card analytics-card highlight">
      <span class="analytics-label">Timing consistency</span>
      <strong>${formatMetricValue(consistency.score)}/100</strong>
      <p>${formatMetricValue(consistency.days_analyzed, "7")} days analyzed. First meal varies by ~${formatMetricValue(consistency.first_meal_variability_minutes)} min.</p>
      ${renderScoreBar(consistency.score)}
    </article>
    <article class="card analytics-card">
      <span class="analytics-label">First meal rhythm</span>
      <strong>${escapeHtml(averages.first_meal?.label || "Not enough data")}</strong>
      <p>Breakfast average: ${escapeHtml(averages.breakfast?.label || "Not enough data")}. Breakfast logged on ${formatMetricValue(breakfast.days_with_breakfast)} days.</p>
    </article>
    <article class="card analytics-card">
      <span class="analytics-label">Last meal rhythm</span>
      <strong>${escapeHtml(averages.last_meal?.label || "Not enough data")}</strong>
      <p>Dinner average: ${escapeHtml(averages.dinner?.label || "Not enough data")}. Last meal varies by ~${formatMetricValue(consistency.last_meal_variability_minutes)} min.</p>
    </article>
    <article class="card analytics-card">
      <span class="analytics-label">Meal gaps</span>
      <strong>${formatMetricValue(gaps.average_gap_hours)}h avg</strong>
      <p>Longest gap: ${formatMetricValue(gaps.longest_gap_hours)}h from ${escapeHtml(gaps.longest_gap_from || "meal")} to ${escapeHtml(gaps.longest_gap_to || "meal")}.</p>
    </article>
    <article class="card analytics-card">
      <span class="analytics-label">Late-night eating</span>
      <strong>${formatMetricValue(lateNight.count)}</strong>
      <p>${formatMetricValue(lateNight.frequency_percentage)}% of logs happened between ${escapeHtml(lateNight.threshold || "10 PM to 4 AM")}.</p>
    </article>
    <article class="card analytics-card">
      <span class="analytics-label">Weekday vs weekend</span>
      <strong>${escapeHtml(weekSplit.weekday_first_meal || "Not enough data")}</strong>
      <p>Weekend first meal: ${escapeHtml(weekSplit.weekend_first_meal || "Not enough data")}. Weekday last meal: ${escapeHtml(weekSplit.weekday_last_meal || "Not enough data")}.</p>
    </article>
    <article class="card analytics-card wide">
      <span class="analytics-label">Timing impact on energy & mood</span>
      ${renderTimingImpactRows(metrics)}
    </article>
    <article class="card analytics-card">
      <span class="analytics-label">Breakfast consistency</span>
      <strong>${formatMetricValue(breakfast.before_9am_percentage)}%</strong>
      <p>Of breakfast logs happened by 9 AM. This helps Sizzle spot morning energy patterns.</p>
    </article>
  `;

  timingSummaryText.textContent = report.summary || "Your timing report is ready. Keep logging and FuelFlow will sharpen the rhythm.";
  timingSuggestions.innerHTML = (report.suggestions || [])
    .slice(0, 3)
    .map((item) => `<span>${escapeHtml(item)}</span>`)
    .join("");
}

async function loadTimingReportHistory() {
  if (!timingReportHistory || !getToken()) return;
  timingReportHistory.innerHTML = `<p class="analytics-muted">Loading timing reports...</p>`;
  try {
    const response = await apiFetch("/api/timing/reports");
    if (!response.ok) {
      throw new Error("Could not load timing report history.");
    }
    const data = await response.json();
    const reports = data.reports || [];
    if (!reports.length) {
      timingReportHistory.innerHTML = `<p class="analytics-muted">No timing reports yet. Generate your first rhythm report above.</p>`;
      return;
    }
    timingReportHistory.innerHTML = reports.map((report, index) => {
      const created = new Date(report.created_at).toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const score = report.metrics?.consistency?.score ?? 0;
      const firstMeal = report.metrics?.average_times?.first_meal?.label || "Not enough data";
      const activeClass = index === 0 ? " latest" : "";
      return `
        <button class="report-history-item${activeClass}" type="button" data-timing-report-index="${index}">
          <span>${escapeHtml(created)}${index === 0 ? " - latest" : ""}</span>
          <strong>Timing consistency: ${escapeHtml(score)}/100</strong>
          <p>Average first meal: ${escapeHtml(firstMeal)}</p>
        </button>
      `;
    }).join("");
    timingReportHistory.dataset.reports = JSON.stringify(reports);
    renderTimingReport(reports[0]);
  } catch (error) {
    timingReportHistory.innerHTML = `<p class="analytics-muted">${escapeHtml(error.message || "Timing history paused.")}</p>`;
  }
}

async function generateTimingReport() {
  const logs = readLogs();
  if (logs.length < 3) {
    timingEmpty.classList.remove("hidden-soft");
    timingContent.classList.add("hidden-soft");
    showToast("Log at least 3 meals to unlock your timing coach.");
    return;
  }

  generateTimingReportButton.disabled = true;
  timingLoading.classList.remove("hidden-soft");
  timingEmpty.classList.add("hidden-soft");

  try {
    const response = await apiFetch("/api/timing/report", {
      method: "POST",
      body: JSON.stringify({ days: 7 }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "FuelFlow could not build your timing report yet.");
    }
    const report = await response.json();
    renderTimingReport(report);
    await loadTimingReportHistory();
    showToast("Your food timing report is ready.");
  } catch (error) {
    showToast(error.message || "Something paused. Please try again.");
  } finally {
    generateTimingReportButton.disabled = false;
    timingLoading.classList.add("hidden-soft");
  }
}

function renderRecoveryReport(report) {
  if (!report?.metrics) return;
  const metrics = report.metrics;
  const sleep = metrics.sleep || {};
  const recovery = metrics.recovery || {};
  const stress = metrics.stress_cravings || {};
  const assoc = metrics.associations || {};

  recoveryContent.classList.remove("hidden-soft");
  recoveryEmpty.classList.add("hidden-soft");

  recoveryMetricGrid.innerHTML = `
    <article class="card analytics-card highlight">
      <span class="analytics-label">Sleep consistency</span>
      <strong>${formatMetricValue(sleep.consistency_score)}/100</strong>
      <p>Average sleep: ${formatMetricValue(sleep.average_duration_hours)}h. Average bedtime: ${escapeHtml(sleep.average_bedtime || "Not enough data")}.</p>
      ${renderScoreBar(sleep.consistency_score)}
    </article>
    <article class="card analytics-card">
      <span class="analytics-label">Sleep quality</span>
      <strong>${formatMetricValue(sleep.average_quality)}/10</strong>
      <p>Average wake time: ${escapeHtml(sleep.average_wake_time || "Not enough data")}. Sleep debt: ${formatMetricValue(sleep.average_sleep_debt_hours)}h.</p>
    </article>
    <article class="card analytics-card">
      <span class="analytics-label">Weekday vs weekend</span>
      <strong>${formatMetricValue(sleep.weekday_average_hours)}h</strong>
      <p>Weekday sleep vs ${formatMetricValue(sleep.weekend_average_hours)}h on weekends. Quality: ${formatMetricValue(sleep.weekday_quality)}/10 vs ${formatMetricValue(sleep.weekend_quality)}/10.</p>
    </article>
    <article class="card analytics-card highlight">
      <span class="analytics-label">Recovery score</span>
      <strong>${formatMetricValue(recovery.average_recovery_score)}/100</strong>
      <p>Readiness ${formatMetricValue(recovery.average_readiness)}/10, hydration ${formatMetricValue(recovery.average_hydration)}/10.</p>
      ${renderScoreBar(recovery.average_recovery_score)}
    </article>
    <article class="card analytics-card">
      <span class="analytics-label">Soreness & fatigue</span>
      <strong>${formatMetricValue(recovery.average_fatigue)}/10</strong>
      <p>Soreness ${formatMetricValue(recovery.average_soreness)}/10. Fatigue trend: ${escapeHtml(recovery.fatigue_trend?.direction || "steady")}.</p>
    </article>
    <article class="card analytics-card">
      <span class="analytics-label">Stress & cravings</span>
      <strong>${formatMetricValue(stress.average_cravings)}/10</strong>
      <p>Stress ${formatMetricValue(stress.average_stress)}/10. Cravings after poor sleep: ${formatMetricValue(stress.average_cravings_after_poor_sleep)}/10.</p>
    </article>
    <article class="card analytics-card wide">
      <span class="analytics-label">Sleep impact</span>
      <div class="timing-impact-list">
        <span>Energy after 7+ hours <strong>${formatMetricValue(assoc.energy_after_7h_sleep)}/10</strong></span>
        <span>Energy after short sleep <strong>${formatMetricValue(assoc.energy_after_short_sleep)}/10</strong></span>
        <span>First meal after consistent sleep <strong>${escapeHtml(assoc.first_meal_after_consistent_sleep || "Not enough data")}</strong></span>
        <span>First meal after inconsistent sleep <strong>${escapeHtml(assoc.first_meal_after_inconsistent_sleep || "Not enough data")}</strong></span>
      </div>
    </article>
    <article class="card analytics-card">
      <span class="analytics-label">Check-ins logged</span>
      <strong>${formatMetricValue(metrics.daily_checkins_count)}</strong>
      <p>${formatMetricValue(metrics.sleep_logs_count)} sleep logs and ${formatMetricValue(metrics.recovery_logs_count)} recovery logs in this report.</p>
    </article>
  `;

  recoverySummaryText.textContent = report.summary || "Your recovery report is ready. Keep checking in and FuelFlow will sharpen the patterns.";
  recoverySuggestions.innerHTML = (report.suggestions || [])
    .slice(0, 3)
    .map((item) => `<span>${escapeHtml(item)}</span>`)
    .join("");
}

async function loadRecoveryReportHistory() {
  if (!recoveryReportHistory || !getToken()) return;
  recoveryReportHistory.innerHTML = `<p class="analytics-muted">Loading recovery reports...</p>`;
  try {
    const response = await apiFetch("/api/recovery/reports");
    if (!response.ok) {
      throw new Error("Could not load recovery report history.");
    }
    const data = await response.json();
    const reports = data.reports || [];
    if (!reports.length) {
      recoveryReportHistory.innerHTML = `<p class="analytics-muted">No recovery reports yet. Generate your first wellbeing report above.</p>`;
      return;
    }
    recoveryReportHistory.innerHTML = reports.map((report, index) => {
      const created = new Date(report.created_at).toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const score = report.metrics?.recovery?.average_recovery_score ?? 0;
      const sleepHours = report.metrics?.sleep?.average_duration_hours ?? 0;
      const activeClass = index === 0 ? " latest" : "";
      return `
        <button class="report-history-item${activeClass}" type="button" data-recovery-report-index="${index}">
          <span>${escapeHtml(created)}${index === 0 ? " - latest" : ""}</span>
          <strong>Recovery: ${escapeHtml(score)}/100 · Sleep: ${escapeHtml(sleepHours)}h</strong>
          <p>${escapeHtml(report.summary || "Saved sleep and recovery report")}</p>
        </button>
      `;
    }).join("");
    recoveryReportHistory.dataset.reports = JSON.stringify(reports);
    renderRecoveryReport(reports[0]);
  } catch (error) {
    recoveryReportHistory.innerHTML = `<p class="analytics-muted">${escapeHtml(error.message || "Recovery history paused.")}</p>`;
  }
}

async function generateRecoveryReport() {
  const checkins = wellbeingCache.daily_checkins || [];
  const sleepLogs = wellbeingCache.sleep_logs || [];
  const recoveryLogs = wellbeingCache.recovery_logs || [];
  if (checkins.length + sleepLogs.length + recoveryLogs.length < 1) {
    recoveryEmpty.classList.remove("hidden-soft");
    recoveryContent.classList.add("hidden-soft");
    showToast("Complete one daily check-in to unlock recovery patterns.");
    return;
  }

  generateRecoveryReportButton.disabled = true;
  recoveryLoading.classList.remove("hidden-soft");
  recoveryEmpty.classList.add("hidden-soft");

  try {
    const response = await apiFetch("/api/recovery/report", {
      method: "POST",
      body: JSON.stringify({ days: 7 }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "FuelFlow could not build your recovery report yet.");
    }
    const report = await response.json();
    renderRecoveryReport(report);
    await loadRecoveryReportHistory();
    showToast("Your sleep and recovery report is ready.");
  } catch (error) {
    showToast(error.message || "Something paused. Please try again.");
  } finally {
    generateRecoveryReportButton.disabled = false;
    recoveryLoading.classList.add("hidden-soft");
  }
}

function renderHabitRows(rows = [], labelKey = "label", empty = "Not enough data yet.") {
  if (!rows.length) {
    return `<p class="analytics-muted">${escapeHtml(empty)}</p>`;
  }
  return `
    <div class="habit-mini-list">
      ${rows.slice(0, 4).map((row) => `
        <span>${escapeHtml(row[labelKey] || row.window || row.event_type || "Signal")} <strong>${escapeHtml(row.count ?? row.average_intensity ?? 0)}</strong></span>
      `).join("")}
    </div>
  `;
}

function renderHabitReport(report) {
  if (!report?.metrics) return;
  const metrics = report.metrics;
  const stress = metrics.stress_correlation || {};
  const sleep = metrics.sleep_correlation || {};
  const timing = metrics.meal_timing_correlation || {};
  const alcoholEnergy = metrics.alcohol_energy || {};
  const smokingTrend = metrics.smoking_frequency_trend || {};
  const alcoholTrend = metrics.alcohol_frequency_trend || {};

  habitContent.classList.remove("hidden-soft");
  habitEmpty.classList.add("hidden-soft");

  habitMetricGrid.innerHTML = `
    <article class="card analytics-card highlight">
      <span class="analytics-label">Events logged</span>
      <strong>${formatMetricValue(metrics.total_events)}</strong>
      <p>${formatMetricValue(metrics.days_analyzed, "7")} days analyzed. This is awareness, not a verdict.</p>
    </article>
    <article class="card analytics-card">
      <span class="analytics-label">Top triggers</span>
      ${renderHabitRows(metrics.most_common_triggers || [])}
    </article>
    <article class="card analytics-card">
      <span class="analytics-label">Strongest windows</span>
      ${renderHabitRows(metrics.strongest_craving_windows || [], "window", "No craving windows yet.")}
    </article>
    <article class="card analytics-card">
      <span class="analytics-label">Smoking trend</span>
      <strong>${escapeHtml(smokingTrend.direction || "steady")}</strong>
      <p>Earlier ${formatMetricValue(smokingTrend.earlier_count)} vs later ${formatMetricValue(smokingTrend.later_count)} events.</p>
    </article>
    <article class="card analytics-card">
      <span class="analytics-label">Alcohol trend</span>
      <strong>${escapeHtml(alcoholTrend.direction || "steady")}</strong>
      <p>Earlier ${formatMetricValue(alcoholTrend.earlier_count)} vs later ${formatMetricValue(alcoholTrend.later_count)} events.</p>
    </article>
    <article class="card analytics-card">
      <span class="analytics-label">Mood patterns</span>
      ${renderHabitRows(metrics.mood_correlations || [])}
    </article>
    <article class="card analytics-card wide">
      <span class="analytics-label">Stress, sleep & meal timing</span>
      <div class="timing-impact-list">
        <span>High-stress days <strong>${formatMetricValue(stress.events_on_high_stress_days)}</strong></span>
        <span>Poor-sleep days <strong>${formatMetricValue(sleep.events_after_poor_sleep)}</strong></span>
        <span>After long meal gaps <strong>${formatMetricValue(timing.events_after_long_meal_gap)}</strong></span>
        <span>Late-night events <strong>${formatMetricValue(timing.late_night_events)}</strong></span>
      </div>
    </article>
    <article class="card analytics-card">
      <span class="analytics-label">Alcohol recovery signal</span>
      <strong>${formatMetricValue(alcoholEnergy.next_day_energy_after_alcohol)}/10</strong>
      <p>Next-day energy after alcohol vs ${formatMetricValue(alcoholEnergy.energy_on_alcohol_free_days)}/10 on alcohol-free days.</p>
    </article>
  `;

  habitSummaryText.textContent = report.summary || "Your habit report is ready. Keep logging gently and FuelFlow will sharpen the patterns.";
  habitSuggestions.innerHTML = (report.suggestions || [])
    .slice(0, 3)
    .map((item) => `<span>${escapeHtml(item)}</span>`)
    .join("");
}

async function loadHabitReportHistory() {
  if (!habitReportHistory || !getToken()) return;
  habitReportHistory.innerHTML = `<p class="analytics-muted">Loading habit reports...</p>`;
  try {
    const response = await apiFetch("/api/habits/reports");
    if (!response.ok) {
      throw new Error("Could not load habit report history.");
    }
    const data = await response.json();
    const reports = data.reports || [];
    if (!reports.length) {
      habitReportHistory.innerHTML = `<p class="analytics-muted">No habit reports yet. Quick-log one event, then generate your first report.</p>`;
      return;
    }
    habitReportHistory.innerHTML = reports.map((report, index) => {
      const created = new Date(report.created_at).toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const total = report.metrics?.total_events ?? 0;
      const trigger = report.metrics?.most_common_triggers?.[0]?.label || "No trigger yet";
      const activeClass = index === 0 ? " latest" : "";
      return `
        <button class="report-history-item${activeClass}" type="button" data-habit-report-index="${index}">
          <span>${escapeHtml(created)}${index === 0 ? " - latest" : ""}</span>
          <strong>${escapeHtml(total)} events · ${escapeHtml(trigger)}</strong>
          <p>${escapeHtml(report.summary || "Saved habit intelligence report")}</p>
        </button>
      `;
    }).join("");
    habitReportHistory.dataset.reports = JSON.stringify(reports);
    renderHabitReport(reports[0]);
  } catch (error) {
    habitReportHistory.innerHTML = `<p class="analytics-muted">${escapeHtml(error.message || "Habit history paused.")}</p>`;
  }
}

async function generateHabitReport() {
  if (!habitEventsCache.length) {
    habitEmpty.classList.remove("hidden-soft");
    habitContent.classList.add("hidden-soft");
    showToast("Quick-log one habit event to unlock habit intelligence.");
    return;
  }

  generateHabitReportButton.disabled = true;
  habitLoading.classList.remove("hidden-soft");
  habitEmpty.classList.add("hidden-soft");

  try {
    const response = await apiFetch("/api/habits/report", {
      method: "POST",
      body: JSON.stringify({ days: 7 }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "FuelFlow could not build your habit report yet.");
    }
    const report = await response.json();
    renderHabitReport(report);
    await loadHabitReportHistory();
    showToast("Your habit intelligence report is ready.");
  } catch (error) {
    showToast(error.message || "Something paused. Please try again.");
  } finally {
    generateHabitReportButton.disabled = false;
    habitLoading.classList.add("hidden-soft");
  }
}

function renderSocialDrinkBreakdown(rows = []) {
  if (!rows.length) {
    return `<p class="analytics-muted">No drink breakdown yet.</p>`;
  }
  return `
    <div class="habit-mini-list">
      ${rows.slice(0, 4).map((row) => `
        <span>${escapeHtml(row.label || row.drink_type || "Drink")} <strong>${escapeHtml(row.quantity ?? 0)} · ${escapeHtml(row.estimated_calories ?? 0)} kcal</strong></span>
      `).join("")}
    </div>
  `;
}

function renderSocialReport(report) {
  if (!report?.metrics) return;
  const metrics = report.metrics;
  const recovery = metrics.recovery_quality || {};
  socialContent.classList.remove("hidden-soft");
  socialEmpty.classList.add("hidden-soft");

  socialMetricGrid.innerHTML = `
    <article class="card analytics-card highlight">
      <span class="analytics-label">Goal alignment</span>
      <strong>${formatMetricValue(metrics.goal_alignment_score)}/100</strong>
      <div class="score-track"><div class="score-fill" style="width:${Math.min(100, Number(metrics.goal_alignment_score || 0))}%"></div></div>
      <p>Flexible, real-life alignment with ${escapeHtml(metrics.goal || "your goal")}.</p>
    </article>
    <article class="card analytics-card">
      <span class="analytics-label">Drinking frequency</span>
      <strong>${escapeHtml(metrics.drinking_frequency_label || "0 days")}</strong>
      <p>Social signals in this report window.</p>
    </article>
    <article class="card analytics-card">
      <span class="analytics-label">Estimated calorie impact</span>
      <strong>${formatMetricValue(metrics.estimated_calorie_impact)}</strong>
      <p>Approximate alcohol calories. Useful for planning, not pressure.</p>
    </article>
    <article class="card analytics-card">
      <span class="analytics-label">Drink breakdown</span>
      ${renderSocialDrinkBreakdown(metrics.drink_breakdown || [])}
    </article>
    <article class="card analytics-card">
      <span class="analytics-label">Next-day energy</span>
      <strong>${formatMetricValue(recovery.average_next_day_energy)}/10</strong>
      <p>Alcohol-free check-in energy: ${formatMetricValue(recovery.alcohol_free_energy)}/10.</p>
    </article>
    <article class="card analytics-card">
      <span class="analytics-label">Recovery quality</span>
      <strong>${formatMetricValue(recovery.average_next_day_recovery)}/100</strong>
      <p>Average next-day recovery after logged drinking signals.</p>
    </article>
    <article class="card analytics-card wide">
      <span class="analytics-label">Improvement opportunities</span>
      <div class="timing-impact-list">
        ${(metrics.improvement_opportunities || []).slice(0, 4).map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
      </div>
    </article>
    <article class="card analytics-card">
      <span class="analytics-label">Reframe</span>
      <p>${escapeHtml(metrics.supportive_reframe || "Plan, enjoy, recover, and keep moving.")}</p>
    </article>
  `;

  socialSummaryText.textContent = report.summary || "Your social balance report is ready. Use it to plan the next social moment with flexibility.";
  socialSuggestions.innerHTML = (report.suggestions || [])
    .slice(0, 3)
    .map((item) => `<span>${escapeHtml(item)}</span>`)
    .join("");
}

async function loadSocialReportHistory() {
  if (!socialReportHistory || !getToken()) return;
  socialReportHistory.innerHTML = `<p class="analytics-muted">Loading social balance reports...</p>`;
  try {
    const response = await apiFetch("/api/social/reports");
    if (!response.ok) {
      throw new Error("Could not load social report history.");
    }
    const data = await response.json();
    const reports = data.reports || [];
    if (!reports.length) {
      socialReportHistory.innerHTML = `<p class="analytics-muted">No social balance reports yet. Generate one when you have alcohol or social signals.</p>`;
      return;
    }
    socialReportHistory.innerHTML = reports.map((report, index) => {
      const created = new Date(report.created_at).toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const frequency = report.metrics?.drinking_frequency_label || "0 days";
      const score = report.metrics?.goal_alignment_score ?? 0;
      const activeClass = index === 0 ? " latest" : "";
      return `
        <button class="report-history-item${activeClass}" type="button" data-social-report-index="${index}">
          <span>${escapeHtml(created)}${index === 0 ? " - latest" : ""}</span>
          <strong>${escapeHtml(frequency)} · ${escapeHtml(score)}/100 alignment</strong>
          <p>${escapeHtml(report.summary || "Saved social balance report")}</p>
        </button>
      `;
    }).join("");
    socialReportHistory.dataset.reports = JSON.stringify(reports);
    renderSocialReport(reports[0]);
  } catch (error) {
    socialReportHistory.innerHTML = `<p class="analytics-muted">${escapeHtml(error.message || "Social report history paused.")}</p>`;
  }
}

async function generateSocialReport() {
  const alcoholEvents = habitEventsCache.filter((event) => event.event_type === "alcohol");
  const alcoholLogs = readLogs().filter((log) => log.alcohol);
  if (!alcoholEvents.length && !alcoholLogs.length) {
    socialEmpty.classList.remove("hidden-soft");
    socialContent.classList.add("hidden-soft");
    showToast("Log an alcohol signal or plan a social night to unlock this report.");
    return;
  }

  generateSocialReportButton.disabled = true;
  socialLoading.classList.remove("hidden-soft");
  socialEmpty.classList.add("hidden-soft");

  try {
    const response = await apiFetch("/api/social/report", {
      method: "POST",
      body: JSON.stringify({ days: 7 }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "FuelFlow could not build your social report yet.");
    }
    const report = await response.json();
    renderSocialReport(report);
    await loadSocialReportHistory();
    showToast("Your social balance report is ready.");
  } catch (error) {
    showToast(error.message || "Something paused. Please try again.");
  } finally {
    generateSocialReportButton.disabled = false;
    socialLoading.classList.add("hidden-soft");
  }
}

function askSizzle(prompt) {
  switchView("sizzle");
  sizzleInput.value = prompt;
  sizzleInput.focus();
}

function renderUnifiedCards(section, metrics) {
  const sections = metrics?.sections || {};
  const overview = metrics?.overview || {};
  if (section === "food_mood") {
    const food = sections.food_mood || {};
    return `
      <article class="card analytics-card highlight"><span class="analytics-label">Mood uplift</span><strong>${formatMetricValue(food.mood_uplift_percentage)}%</strong><p>Meals followed by a better mood.</p></article>
      <article class="card analytics-card"><span class="analytics-label">Meal consistency</span><strong>${formatMetricValue(food.meal_consistency_score)}/100</strong><p>${formatMetricValue(food.total_logs)} logs this week.</p></article>
      <article class="card analytics-card"><span class="analytics-label">Average energy</span><strong>${formatMetricValue(food.average_energy)}/10</strong><p>Meal-level energy after eating.</p></article>
    `;
  }
  if (section === "timing") {
    const timing = sections.timing || {};
    return `
      <article class="card analytics-card highlight"><span class="analytics-label">Timing consistency</span><strong>${formatMetricValue(timing.consistency_score)}/100</strong><p>Your weekly meal rhythm.</p></article>
      <article class="card analytics-card"><span class="analytics-label">First meal</span><strong>${escapeHtml(timing.average_first_meal?.label || "No data")}</strong><p>Average first meal time.</p></article>
      <article class="card analytics-card"><span class="analytics-label">Late-night logs</span><strong>${formatMetricValue(timing.late_night?.count)}</strong><p>${escapeHtml(timing.late_night?.threshold || "10 PM to 4 AM")}.</p></article>
    `;
  }
  if (section === "recovery") {
    const recovery = sections.recovery || {};
    return `
      <article class="card analytics-card highlight"><span class="analytics-label">Recovery score</span><strong>${formatMetricValue(recovery.recovery?.average_recovery_score)}/100</strong><p>Readiness, soreness, fatigue, and hydration.</p></article>
      <article class="card analytics-card"><span class="analytics-label">Sleep</span><strong>${formatMetricValue(recovery.sleep?.average_duration_hours)}h</strong><p>Average logged sleep duration.</p></article>
      <article class="card analytics-card"><span class="analytics-label">Stress</span><strong>${formatMetricValue(recovery.daily?.average_stress)}/10</strong><p>Daily check-in average.</p></article>
    `;
  }
  if (section === "habits") {
    const habits = sections.habits || {};
    const trigger = habits.most_common_triggers?.[0]?.label || "No trigger yet";
    return `
      <article class="card analytics-card highlight"><span class="analytics-label">Quick signals</span><strong>${formatMetricValue(habits.total_events)}</strong><p>Habit events logged this week.</p></article>
      <article class="card analytics-card"><span class="analytics-label">Top trigger</span><strong>${escapeHtml(trigger)}</strong><p>Most common logged trigger.</p></article>
      <article class="card analytics-card"><span class="analytics-label">Late-night signals</span><strong>${formatMetricValue(habits.meal_timing_correlation?.late_night_events)}</strong><p>Patterns worth noticing, not judging.</p></article>
    `;
  }
  if (section === "social") {
    const social = sections.social || {};
    return `
      <article class="card analytics-card highlight"><span class="analytics-label">Social alignment</span><strong>${formatMetricValue(social.goal_alignment_score)}/100</strong><p>Real-life flexibility with your goals.</p></article>
      <article class="card analytics-card"><span class="analytics-label">Drinking frequency</span><strong>${escapeHtml(social.drinking_frequency_label || "0 days")}</strong><p>Logged social drinking signals.</p></article>
      <article class="card analytics-card"><span class="analytics-label">Calorie impact</span><strong>${formatMetricValue(social.estimated_calorie_impact)}</strong><p>Approximate planning signal.</p></article>
    `;
  }
  return `
    <article class="card analytics-card highlight"><span class="analytics-label">Weekly score</span><strong>${formatMetricValue(overview.score)}/100</strong><p>One compass across your FuelFlow signals.</p></article>
    <article class="card analytics-card"><span class="analytics-label">Plan adherence</span><strong>${formatMetricValue(overview.plan_adherence)}%</strong><p>Meals marked eaten or swapped.</p></article>
    <article class="card analytics-card"><span class="analytics-label">Recovery</span><strong>${formatMetricValue(overview.recovery_score)}/100</strong><p>Sleep and recovery check-in signal.</p></article>
    <article class="card analytics-card"><span class="analytics-label">Timing</span><strong>${formatMetricValue(overview.timing_consistency)}/100</strong><p>How steady your meal rhythm looked.</p></article>
    <article class="card analytics-card"><span class="analytics-label">Food consistency</span><strong>${formatMetricValue(overview.meal_consistency)}/100</strong><p>How much useful food data FuelFlow saw.</p></article>
    <article class="card analytics-card"><span class="analytics-label">Habit signals</span><strong>${formatMetricValue(overview.habit_events)}</strong><p>Quick signals logged without judgment.</p></article>
  `;
}

function renderUnifiedReport(report) {
  if (!report?.metrics) return;
  activeUnifiedReport = report;
  unifiedReportContent.classList.remove("hidden-soft");
  unifiedReportEmpty.classList.add("hidden-soft");
  unifiedReportFocus.textContent = report.focus ? `Next focus: ${report.focus}` : "Next focus: choose one repeatable action.";
  unifiedReportSummary.textContent = report.summary || "Your weekly report is ready.";
  unifiedReportActions.innerHTML = (report.actions || [])
    .slice(0, 3)
    .map((item) => `<span>${escapeHtml(item)}</span>`)
    .join("");
  document.querySelectorAll("[data-weekly-section]").forEach((button) => {
    button.classList.toggle("active", button.dataset.weeklySection === activeWeeklySection);
  });
  unifiedReportSectionGrid.innerHTML = renderUnifiedCards(activeWeeklySection, report.metrics);
}

async function loadUnifiedReportHistory() {
  if (!unifiedReportHistory || !getToken()) return;
  unifiedReportHistory.innerHTML = `<p class="analytics-muted">Loading weekly reports...</p>`;
  try {
    const response = await apiFetch("/api/weekly-report/history");
    if (!response.ok) throw new Error("Could not load weekly report history.");
    const data = await response.json();
    const reports = data.reports || [];
    if (!reports.length) {
      unifiedReportHistory.innerHTML = `<p class="analytics-muted">No unified reports yet. Generate your first weekly report above.</p>`;
      return;
    }
    unifiedReportHistory.innerHTML = reports.map((report, index) => {
      const created = new Date(report.created_at).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
      const score = report.metrics?.overview?.score ?? 0;
      return `
        <button class="report-history-item${index === 0 ? " latest" : ""}" type="button" data-unified-report-index="${index}">
          <span>${escapeHtml(created)}${index === 0 ? " - latest" : ""}</span>
          <strong>${escapeHtml(score)}/100 weekly score</strong>
          <p>${escapeHtml(report.summary || "Saved weekly report")}</p>
        </button>
      `;
    }).join("");
    unifiedReportHistory.dataset.reports = JSON.stringify(reports);
    renderUnifiedReport(reports[0]);
  } catch (error) {
    unifiedReportHistory.innerHTML = `<p class="analytics-muted">${escapeHtml(error.message || "Weekly history paused.")}</p>`;
  }
}

async function generateUnifiedReport() {
  generateUnifiedReportButton.disabled = true;
  unifiedReportLoading.classList.remove("hidden-soft");
  unifiedReportEmpty.classList.add("hidden-soft");
  try {
    const response = await apiFetch("/api/weekly-report/generate", {
      method: "POST",
      body: JSON.stringify({ days: 7 }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "FuelFlow could not build your weekly report yet.");
    }
    const report = await response.json();
    activeWeeklySection = "overview";
    renderUnifiedReport(report);
    await loadUnifiedReportHistory();
    showToast("Your unified weekly report is ready.");
  } catch (error) {
    showToast(error.message || "Something paused. Please try again.");
  } finally {
    generateUnifiedReportButton.disabled = false;
    unifiedReportLoading.classList.add("hidden-soft");
  }
}

function updateInsightsState() {
  insightsButton.classList.remove("hidden-soft");
  insightsEmpty.classList.add("hidden-soft");
  if (readLogs().length >= 3) {
    insightsHint.classList.add("hidden-soft");
  }
  analyticsEmpty.classList.toggle("hidden-soft", readLogs().length >= 3);
  timingEmpty.classList.toggle("hidden-soft", readLogs().length >= 3);
  const hasWellbeing = (wellbeingCache.daily_checkins || []).length + (wellbeingCache.sleep_logs || []).length + (wellbeingCache.recovery_logs || []).length > 0;
  recoveryEmpty.classList.toggle("hidden-soft", hasWellbeing);
  habitEmpty.classList.toggle("hidden-soft", habitEventsCache.length > 0);
}

function readSizzleHistory() {
  try {
    return JSON.parse(localStorage.getItem(SIZZLE_KEY)) || [];
  } catch {
    return [];
  }
}

function writeSizzleHistory(history) {
  localStorage.setItem(SIZZLE_KEY, JSON.stringify(history.slice(-100)));
}

async function loadSizzleHistoryFromServer() {
  if (!getToken()) return;
  try {
    const response = await apiFetch("/api/chat/history");
    if (!response.ok) return;
    const data = await response.json();
    const messages = (data.history || []).map((message) => ({
      role: message.role,
      content: message.content,
      timestamp: message.timestamp,
    }));
    writeSizzleHistory(messages);
  } catch {
    // Local chat cache remains available if server history cannot load.
  }
}

async function loadSizzleMemories() {
  if (!sizzleMemorySettings || !getToken()) return;
  sizzleMemorySettings.innerHTML = `
    <div class="settings-section-head">
      <h3>What Sizzle Remembers</h3>
      <p>Loading Sizzle's long-term coaching memory...</p>
    </div>
  `;
  try {
    const response = await apiFetch("/api/memories");
    if (!response.ok) {
      throw new Error("Could not load Sizzle memory.");
    }
    renderSizzleMemorySettings(await response.json());
  } catch (error) {
    sizzleMemorySettings.innerHTML = `
      <div class="settings-section-head">
        <h3>What Sizzle Remembers</h3>
        <p>${escapeHtml(error.message || "Memory controls paused.")}</p>
      </div>
    `;
  }
}

function renderSizzleMemorySettings(data = {}) {
  const memories = data.memories || [];
  const enabled = data.memory_enabled !== false;
  sizzleMemorySettings.innerHTML = `
    <div class="settings-section-head">
      <div>
        <h3>What Sizzle Remembers</h3>
        <p>Use memory to make Sizzle a long-term coach across conversations and devices.</p>
      </div>
      <label class="memory-toggle">
        <input id="sizzleMemoryToggle" type="checkbox" ${enabled ? "checked" : ""}>
        <span>${enabled ? "Memory on" : "Memory off"}</span>
      </label>
    </div>
    <div class="memory-actions">
      <button id="exportMemoriesButton" class="secondary-button compact" type="button">Export memories</button>
      <button id="deleteAllMemoriesButton" class="mini-danger" type="button">Delete all</button>
    </div>
    <div class="memory-list">
      ${memories.length ? memories.map((memory) => `
        <article class="memory-item" data-memory-id="${escapeHtml(memory.id)}">
          <div>
            <span>${escapeHtml(memory.memory_type || "memory")}</span>
            <p>${escapeHtml(memory.memory_text || "")}</p>
            <small>Confidence: ${Math.round(Number(memory.confidence_score || 0) * 100)}% · Source: ${escapeHtml(memory.source || "chat")}</small>
          </div>
          <button class="clear-chat-button delete-memory-button" type="button">Delete</button>
        </article>
      `).join("") : `<p class="analytics-muted">No memories yet. When you tell Sizzle durable things about your goals, preferences, challenges, or cravings, they can appear here.</p>`}
    </div>
  `;
  sizzleMemorySettings.dataset.memories = JSON.stringify(memories);
}

async function updateSizzleMemoryEnabled(enabled) {
  const response = await apiFetch("/api/memories/settings", {
    method: "POST",
    body: JSON.stringify({ enabled }),
  });
  if (!response.ok) {
    throw new Error("Could not update memory setting.");
  }
  renderSizzleMemorySettings(await response.json());
}

async function deleteSizzleMemory(memoryId) {
  const response = await apiFetch(`/api/memories/${memoryId}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error("Could not delete that memory.");
  }
  const data = await response.json();
  const current = await apiFetch("/api/memories").then((result) => result.json()).catch(() => ({ memory_enabled: true }));
  renderSizzleMemorySettings({ ...current, memories: data.memories || [] });
}

async function deleteAllSizzleMemories() {
  const response = await apiFetch("/api/memories", { method: "DELETE" });
  if (!response.ok) {
    throw new Error("Could not delete memories.");
  }
  const current = await apiFetch("/api/memories").then((result) => result.json()).catch(() => ({ memory_enabled: true, memories: [] }));
  renderSizzleMemorySettings(current);
}

function exportSizzleMemories() {
  let memories = [];
  try {
    memories = JSON.parse(sizzleMemorySettings.dataset.memories || "[]");
  } catch {
    memories = [];
  }
  const blob = new Blob([JSON.stringify(memories, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "fuelflow_sizzle_memories.json";
  link.click();
  URL.revokeObjectURL(link.href);
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
    if (Array.isArray(data.history)) {
      writeSizzleHistory(data.history.map((item) => ({ role: item.role, content: item.content, timestamp: item.timestamp })));
    } else {
      writeSizzleHistory([...nextHistory, { role: "assistant", content: data.reply || "I am here with you. Ask me one specific thing and we will work through it." }]);
    }
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
  const adherenceRecords = planAdherenceCache.filter((record) => {
    if (plan._server_id) return Number(record.plan_id) === Number(plan._server_id);
    return record.plan_created_at === plan._created_at;
  });
  const adherenceTotal = adherenceRecords.length;
  const followed = adherenceRecords.filter((record) => ["eaten", "swapped"].includes(record.status)).length;
  const adherenceRate = adherenceTotal ? Math.round((followed / adherenceTotal) * 100) : 0;

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
        <span class="metric-pill">Adherence ${escapeHtml(adherenceRate)}%</span>
      </div>
    </section>

    <section class="card plan-history-card">
      <div class="report-history-heading">
        <div>
          <p class="eyebrow flame">Synced plans</p>
          <h3>Previous meal plans</h3>
          <p>Restore a saved plan from this device or another login.</p>
        </div>
        <button id="refreshPlanHistoryButton" class="clear-chat-button" type="button">Refresh</button>
      </div>
      <div id="mealPlanHistoryList" class="report-history-list">
        ${renderMealPlanHistoryList(plan)}
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
      ${(day.meals || []).map((meal, index) => renderPlanMealCard(meal, index, plan, day.day)).join("")}
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
      <div class="sizzle-action-row">
        <button class="clear-chat-button sizzle-context-button" type="button" data-sizzle-prompt="Review my current meal plan and tell me what I should adjust first.">Ask Sizzle About This</button>
        <button class="clear-chat-button sizzle-context-button" type="button" data-sizzle-prompt="What should I do next to follow this meal plan without making it stressful?">What Should I Do Next?</button>
      </div>
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

function renderMealPlanHistoryList(activePlan) {
  if (!mealPlanHistoryCache.length) {
    return `<p class="analytics-muted">No previous server-saved plans yet.</p>`;
  }
  return mealPlanHistoryCache.slice(0, 5).map((plan, index) => {
    const summary = plan.plan_summary || {};
    const created = plan._created_at ? new Date(plan._created_at).toLocaleDateString([], { month: "short", day: "numeric" }) : "Saved plan";
    const isActive = activePlan?._server_id && Number(activePlan._server_id) === Number(plan._server_id);
    return `
      <button class="report-history-item ${isActive ? "latest" : ""}" type="button" data-restore-plan-index="${index}">
        <span>${escapeHtml(created)}${isActive ? " - active" : ""}</span>
        <strong>${escapeHtml(summary.plan_type || "Meal plan")} · ${escapeHtml(summary.daily_calories || 0)} kcal</strong>
        <p>${escapeHtml(summary.weekly_goal || "Saved FuelFlow meal plan")}</p>
      </button>
    `;
  }).join("");
}

function renderPlanMealCard(meal, index, plan, dayName) {
  const totalMacros = Math.max(1, Number(meal.protein_g || 0) + Number(meal.carbs_g || 0) + Number(meal.fat_g || 0));
  const proteinWidth = Math.round((Number(meal.protein_g || 0) / totalMacros) * 100);
  const carbsWidth = Math.round((Number(meal.carbs_g || 0) / totalMacros) * 100);
  const fatWidth = Math.max(0, 100 - proteinWidth - carbsWidth);
  const adherence = getAdherenceForMeal(plan, dayName, index);
  const status = adherence?.status || "";
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
        <div class="plan-meal-actions">
          <button class="secondary-button compact ask-recipe-button" type="button">Ask Sizzle for recipe</button>
          <button class="secondary-button compact log-plan-meal" type="button">Log this meal</button>
        </div>
      </div>
      <div class="plan-adherence-actions">
        ${["eaten", "swapped", "skipped"].map((item) => `
          <button class="${status === item ? "active" : ""}" type="button" data-plan-status="${item}">
            ${escapeHtml(item.charAt(0).toUpperCase() + item.slice(1))}
          </button>
        `).join("")}
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
      <p class="plan-meal-description">${escapeHtml(meal.description || "A practical meal built around your plan.")}</p>
      <p class="why-meal">Why this meal? ${escapeHtml(meal.why || "")}</p>
      <div class="sizzle-action-row">
        <button class="clear-chat-button sizzle-context-button" type="button" data-sizzle-prompt="Why does ${escapeHtml(meal.name || "this meal")} matter for my goal?">Why Does This Matter?</button>
        <button class="clear-chat-button sizzle-context-button" type="button" data-sizzle-prompt="I want to swap ${escapeHtml(meal.name || "this meal")}. Suggest a similar option that fits my plan.">Ask Sizzle to Swap</button>
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
    await loadLatestMealPlanFromServer();
    await loadMealPlanHistory();
    await loadPlanAdherence(readMealPlan()?._server_id || null);
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
  onboardingTrack.closest(".onboarding-card")?.scrollTo({ top: 0, behavior: "smooth" });
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
      <span>${escapeHtml(option.description)}</span>
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
        <span>${escapeHtml(option.description)}</span>
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
  await loadWellbeingFromServer();
  await loadHabitEventsFromServer();
  await loadLatestMealPlanFromServer();
  await loadMealPlanHistory();
  await loadPlanAdherence(readMealPlan()?._server_id || null);
  await loadSizzleHistoryFromServer();
  showMainApp();
  renderMoodGroups();
  renderExplore();
  restorePlanSelections();
  renderMealPlanView();
  renderChatSessionsDropdown();
  renderToday();
  renderHomePersonalization();
  updateInsightsState();
  renderSizzleMessages();
  renderSettings();
  switchView("home");
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
    await loadWellbeingFromServer();
    await loadHabitEventsFromServer();
    await loadLatestMealPlanFromServer();
    await loadMealPlanHistory();
    await loadPlanAdherence(readMealPlan()?._server_id || null);
    localStorage.removeItem(USER_KEY);
    showMainApp();
    renderMoodGroups();
    renderExplore();
    restorePlanSelections();
    renderMealPlanView();
    renderChatSessionsDropdown();
    renderToday();
    renderHomePersonalization();
    updateInsightsState();
    renderSizzleMessages();
    renderSettings();
    switchView("home");
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

  bodyTypeCards.addEventListener("click", (event) => {
    const bodyTypeCard = event.target.closest("[data-body-type]");
    if (!bodyTypeCard) return;
    onboardingSelections.body_type = bodyTypeCard.dataset.bodyType;
    renderBodyTypeCards();
    updateOnboardingButtons();
  });

  bodyFatCards.addEventListener("click", (event) => {
    const bodyFatCard = event.target.closest("[data-body-fat-range]");
    if (!bodyFatCard) return;
    onboardingSelections.body_fat_range = bodyFatCard.dataset.bodyFatRange;
    onboardingSelections.body_fat_mid = Number(bodyFatCard.dataset.bodyFatMid);
    onboardingSelections.target_body_fat_range = "";
    onboardingSelections.target_body_fat_mid = 0;
    renderBodyFatCards();
    updateOnboardingButtons();
  });

  targetBodyFatCards.addEventListener("click", (event) => {
    const targetBodyFatCard = event.target.closest("[data-target-body-fat-range]");
    if (!targetBodyFatCard) return;
    onboardingSelections.target_body_fat_range = targetBodyFatCard.dataset.targetBodyFatRange;
    onboardingSelections.target_body_fat_mid = Number(targetBodyFatCard.dataset.targetBodyFatMid);
    renderTargetBodyFatCards();
    updateOnboardingButtons();
  });

  navButtons.forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.navTarget));
  });

  quickSizzleCheckIn.addEventListener("click", () => {
    switchView("sizzle");
    sizzleInput.value = "Give me one small nutrition focus for today based on my goal and recent logs.";
    sizzleInput.focus();
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

    const sizzleContextButton = event.target.closest("[data-sizzle-prompt]");
    if (sizzleContextButton) {
      askSizzle(sizzleContextButton.dataset.sizzlePrompt);
      return;
    }

    const dynamicNavButton = event.target.closest("[data-nav-target]");
    if (dynamicNavButton && !dynamicNavButton.classList.contains("nav-item")) {
      switchView(dynamicNavButton.dataset.navTarget);
      return;
    }

    const wellbeingMoodButton = event.target.closest("[data-wellbeing-mood]");
    if (wellbeingMoodButton) {
      const form = wellbeingMoodButton.closest("#wellbeingCheckInForm");
      if (!form) return;
      form.querySelectorAll("[data-wellbeing-mood]").forEach((button) => {
        button.classList.toggle("active", button === wellbeingMoodButton);
      });
      form.elements.mood.value = wellbeingMoodButton.dataset.wellbeingMood;
      return;
    }

    const habitTypeButton = event.target.closest("[data-habit-type-option]");
    if (habitTypeButton) {
      localStorage.setItem(HABIT_TYPE_KEY, habitTypeButton.dataset.habitTypeOption);
      renderHabitQuickLog();
      return;
    }

    const habitTriggerButton = event.target.closest("[data-habit-trigger]");
    if (habitTriggerButton) {
      const form = habitTriggerButton.closest("#habitQuickLogForm");
      if (!form) return;
      form.querySelectorAll("[data-habit-trigger]").forEach((button) => {
        button.classList.toggle("active", button === habitTriggerButton);
      });
      form.elements.trigger.value = habitTriggerButton.dataset.habitTrigger;
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

    const deleteMemoryButton = event.target.closest(".delete-memory-button");
    if (deleteMemoryButton) {
      const memoryItem = deleteMemoryButton.closest("[data-memory-id]");
      if (!memoryItem) return;
      deleteSizzleMemory(memoryItem.dataset.memoryId)
        .then(() => showToast("Sizzle memory deleted."))
        .catch((error) => showToast(error.message || "Could not delete memory."));
      return;
    }

    const exportMemoriesButton = event.target.closest("#exportMemoriesButton");
    if (exportMemoriesButton) {
      exportSizzleMemories();
      return;
    }

    const deleteAllMemoriesButton = event.target.closest("#deleteAllMemoriesButton");
    if (deleteAllMemoriesButton) {
      deleteAllSizzleMemories()
        .then(() => showToast("All Sizzle memories deleted."))
        .catch((error) => showToast(error.message || "Could not delete memories."));
    }
  });

  document.addEventListener("change", (event) => {
    if (event.target.id === "sizzleMemoryToggle") {
      updateSizzleMemoryEnabled(event.target.checked)
        .then(() => showToast(event.target.checked ? "Sizzle memory is on." : "Sizzle memory is off."))
        .catch((error) => showToast(error.message || "Could not update memory."));
    }
  });

  document.addEventListener("input", (event) => {
    const range = event.target.closest(".wellbeing-range");
    if (range) {
      const target = document.querySelector(`[data-wellbeing-value="${range.dataset.valueTarget}"]`);
      if (target) {
        target.textContent = `${range.value}/10`;
      }
      return;
    }
    const habitRange = event.target.closest(".habit-intensity-range");
    if (habitRange) {
      const target = habitRange.closest("label")?.querySelector("[data-habit-intensity-value]");
      if (target) {
        target.textContent = `${habitRange.value}/10`;
      }
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

  document.addEventListener("submit", async (event) => {
    if (!["wellbeingCheckInForm", "habitQuickLogForm", "socialPlannerForm"].includes(event.target.id)) return;
    event.preventDefault();
    const button = event.target.querySelector("button[type='submit']");
    button.disabled = true;
    try {
      if (event.target.id === "wellbeingCheckInForm") {
        await submitWellbeingCheckIn(event.target);
      } else if (event.target.id === "habitQuickLogForm") {
        await submitHabitQuickLog(event.target);
      } else {
        await submitSocialPlanner(event.target);
      }
    } catch (error) {
      showToast(error.message || "Could not save that signal yet.");
    } finally {
      button.disabled = false;
    }
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
    if (event.target.closest("#refreshPlanHistoryButton")) {
      await loadMealPlanHistory();
      renderMealPlan(readMealPlan());
      return;
    }

    const restoreButton = event.target.closest("[data-restore-plan-index]");
    if (restoreButton) {
      const plan = mealPlanHistoryCache[Number(restoreButton.dataset.restorePlanIndex)];
      if (plan) {
        selectedPlanDay = 0;
        writeMealPlan(plan);
        await loadPlanAdherence(plan._server_id || null);
        renderMealPlanView();
        showToast("Meal plan restored.");
      }
      return;
    }

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
    const statusButton = event.target.closest("[data-plan-status]");
    if (statusButton && mealCard) {
      const plan = readMealPlan();
      const day = plan?.days?.[selectedPlanDay] || {};
      const mealIndex = Number(mealCard.dataset.planMealIndex);
      const meal = day.meals?.[mealIndex];
      if (plan && meal) {
        try {
          await markPlanMealStatus(plan, day.day, mealIndex, meal, statusButton.dataset.planStatus);
          showToast(`Marked ${statusButton.dataset.planStatus}.`);
        } catch (error) {
          showToast(error.message || "Could not update meal status.");
        }
      }
      return;
    }

    if (event.target.closest(".log-plan-meal") && mealCard) {
      const plan = readMealPlan();
      const meal = plan?.days?.[selectedPlanDay]?.meals?.[Number(mealCard.dataset.planMealIndex)];
      if (meal) {
        await logPlanMeal(meal);
        const day = plan?.days?.[selectedPlanDay] || {};
        await markPlanMealStatus(plan, day.day, Number(mealCard.dataset.planMealIndex), meal, "eaten").catch(() => {});
      }
      return;
    }

    if (event.target.closest(".ask-recipe-button") && mealCard) {
      const plan = readMealPlan();
      const meal = plan?.days?.[selectedPlanDay]?.meals?.[Number(mealCard.dataset.planMealIndex)];
      if (meal) {
        switchView("sizzle");
        sizzleInput.value = `Give me a detailed recipe for ${meal.name || "this meal"}`;
        sizzleInput.focus();
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

  generateAnalyticsReportButton.addEventListener("click", generateBehavioralReport);

  refreshAnalyticsHistoryButton.addEventListener("click", loadAnalyticsReportHistory);

  generateUnifiedReportButton.addEventListener("click", generateUnifiedReport);

  refreshUnifiedHistoryButton.addEventListener("click", loadUnifiedReportHistory);

  unifiedReportHistory.addEventListener("click", (event) => {
    const reportButton = event.target.closest("[data-unified-report-index]");
    if (!reportButton) return;
    try {
      const reports = JSON.parse(unifiedReportHistory.dataset.reports || "[]");
      const report = reports[Number(reportButton.dataset.unifiedReportIndex)];
      if (report) renderUnifiedReport(report);
    } catch {
      showToast("Could not open that weekly report.");
    }
  });

  document.querySelectorAll("[data-weekly-section]").forEach((button) => {
    button.addEventListener("click", () => {
      activeWeeklySection = button.dataset.weeklySection;
      if (activeUnifiedReport) renderUnifiedReport(activeUnifiedReport);
    });
  });

  generateTimingReportButton.addEventListener("click", generateTimingReport);

  refreshTimingHistoryButton.addEventListener("click", loadTimingReportHistory);

  generateRecoveryReportButton.addEventListener("click", generateRecoveryReport);

  refreshRecoveryHistoryButton.addEventListener("click", loadRecoveryReportHistory);

  generateHabitReportButton.addEventListener("click", generateHabitReport);

  refreshHabitHistoryButton.addEventListener("click", loadHabitReportHistory);

  generateSocialReportButton.addEventListener("click", generateSocialReport);

  refreshSocialHistoryButton.addEventListener("click", loadSocialReportHistory);

  analyticsReportHistory.addEventListener("click", (event) => {
    const reportButton = event.target.closest("[data-report-index]");
    if (!reportButton) return;
    try {
      const reports = JSON.parse(analyticsReportHistory.dataset.reports || "[]");
      const report = reports[Number(reportButton.dataset.reportIndex)];
      if (report) {
        renderAnalyticsReport(report);
      }
    } catch {
      showToast("Could not open that report.");
    }
  });

  timingReportHistory.addEventListener("click", (event) => {
    const reportButton = event.target.closest("[data-timing-report-index]");
    if (!reportButton) return;
    try {
      const reports = JSON.parse(timingReportHistory.dataset.reports || "[]");
      const report = reports[Number(reportButton.dataset.timingReportIndex)];
      if (report) {
        renderTimingReport(report);
      }
    } catch {
      showToast("Could not open that timing report.");
    }
  });

  recoveryReportHistory.addEventListener("click", (event) => {
    const reportButton = event.target.closest("[data-recovery-report-index]");
    if (!reportButton) return;
    try {
      const reports = JSON.parse(recoveryReportHistory.dataset.reports || "[]");
      const report = reports[Number(reportButton.dataset.recoveryReportIndex)];
      if (report) {
        renderRecoveryReport(report);
      }
    } catch {
      showToast("Could not open that recovery report.");
    }
  });

  habitReportHistory.addEventListener("click", (event) => {
    const reportButton = event.target.closest("[data-habit-report-index]");
    if (!reportButton) return;
    try {
      const reports = JSON.parse(habitReportHistory.dataset.reports || "[]");
      const report = reports[Number(reportButton.dataset.habitReportIndex)];
      if (report) {
        renderHabitReport(report);
      }
    } catch {
      showToast("Could not open that habit report.");
    }
  });

  socialReportHistory.addEventListener("click", (event) => {
    const reportButton = event.target.closest("[data-social-report-index]");
    if (!reportButton) return;
    try {
      const reports = JSON.parse(socialReportHistory.dataset.reports || "[]");
      const report = reports[Number(reportButton.dataset.socialReportIndex)];
      if (report) {
        renderSocialReport(report);
      }
    } catch {
      showToast("Could not open that social report.");
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
  if (quoteText) {
    quoteText.textContent = randomItem(quotes);
  }
  if (authQuoteText) {
    authQuoteText.textContent = "Become the best version of yourself.";
  }
  bindEvents();
  await verifyExistingSession();
}

init();
