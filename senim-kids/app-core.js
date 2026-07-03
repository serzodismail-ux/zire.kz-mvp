const STORAGE_KEY = "senim-kids-mvp-v1";
const todayKey = () => new Date().toISOString().slice(0, 10);

const defaultTasks = [
  {
    id: "emotions",
    title: "Эмоции",
    category: "emotions",
    description: "Узнай эмоцию",
    status: "not_started",
    starsReward: 25,
    assigned: true,
    route: "/child/games/emotions",
    icon: "😊",
  },
  {
    id: "words",
    title: "Речь и слова",
    category: "speech",
    description: "Подбери слово к картинке",
    status: "not_started",
    starsReward: 25,
    assigned: true,
    route: "/child/games/words",
    icon: "🗣️",
  },
  {
    id: "attention",
    title: "Внимание",
    category: "attention",
    description: "Найди лишний предмет",
    status: "not_started",
    starsReward: 25,
    assigned: true,
    route: "/child/games/attention",
    icon: "🔎",
  },
  {
    id: "social",
    title: "Социальные навыки",
    category: "social",
    description: "Социальная история",
    status: "not_started",
    starsReward: 25,
    assigned: true,
    route: "/child/games/social-story",
    icon: "🤝",
  },
  {
    id: "aac",
    title: "Карточки общения",
    category: "aac",
    description: "Попроси с помощью карточки",
    status: "not_started",
    starsReward: 25,
    assigned: true,
    route: "/child/aac",
    icon: "💬",
  },
];

const defaultProgress = [
  ["Пн", 2, 5, 48, 64, 50, 42],
  ["Вт", 3, 5, 54, 70, 58, 49],
  ["Ср", 4, 5, 60, 78, 62, 54],
  ["Чт", 3, 5, 58, 74, 70, 56],
  ["Пт", 4, 5, 66, 82, 76, 64],
  ["Сб", 5, 5, 72, 88, 80, 70],
  ["Вс", 3, 5, 68, 86, 78, 66],
].map(([date, completedTasks, totalTasks, speechScore, emotionScore, attentionScore, socialScore]) => ({
  date,
  completedTasks,
  totalTasks,
  speechScore,
  emotionScore,
  attentionScore,
  socialScore,
}));

const specialistChildren = [
  {
    id: "sasha",
    name: "Саша П.",
    age: 7,
    goals: ["речь", "коммуникация", "эмоции", "внимание"],
    level: "Домашняя программа 2",
    activity: "4 занятия за неделю",
  },
  {
    id: "aliya",
    name: "Алия К.",
    age: 5,
    goals: ["AAC", "совместное внимание"],
    level: "Стартовая программа",
    activity: "3 занятия за неделю",
  },
  {
    id: "timur",
    name: "Тимур Н.",
    age: 8,
    goals: ["социальные истории", "саморегуляция"],
    level: "Программа 3",
    activity: "5 занятий за неделю",
  },
];

const rewardsCatalog = [
  ["first", "Первое занятие", "Завершить любое задание"],
  ["streak3", "3 дня подряд", "Сохранить серию занятий"],
  ["emotion-master", "Мастер эмоций", "Завершить игру про эмоции"],
  ["words", "Слова и картинки", "Завершить игру со словами"],
  ["attention", "Внимательный исследователь", "Завершить задание на внимание"],
  ["communication", "Коммуникация", "Использовать AAC-карточки"],
];

const initialState = {
  childProfile: {
    id: "sasha",
    name: "Саша",
    age: 7,
    stars: 80,
    streak: 3,
    goals: ["речь", "коммуникация", "эмоции", "внимание"],
    lastActiveDate: "",
  },
  tasks: defaultTasks,
  progress: defaultProgress,
  notes: [
    {
      id: "n1",
      date: "Сегодня",
      text: "Саша лучше выбирал эмоции, когда варианты были крупными и без лишнего фона.",
    },
  ],
  selectedSpecialistChild: "sasha",
  gameStats: {
    emotionsCorrect: 0,
    wordsCorrect: 0,
    attentionCorrect: 0,
    socialCorrect: 0,
    aacUses: 0,
    wordsErrors: 1,
  },
};

let state = loadState();
let gameSession = {};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return structuredClone(initialState);
    return {
      ...structuredClone(initialState),
      ...saved,
      childProfile: { ...initialState.childProfile, ...saved.childProfile },
      gameStats: { ...initialState.gameStats, ...saved.gameStats },
      tasks: defaultTasks.map((task) => ({ ...task, ...(saved.tasks || []).find((item) => item.id === task.id) })),
    };
  } catch {
    return structuredClone(initialState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function route() {
  const hash = window.location.hash.replace(/^#/, "");
  return hash || "/";
}

function go(path) {
  window.location.hash = path;
}

function levelFromStars(stars) {
  if (stars >= 500) return 4;
  if (stars >= 250) return 3;
  if (stars >= 100) return 2;
  return 1;
}

function assignedTasks() {
  return state.tasks.filter((task) => task.assigned);
}

function completeTask(id) {
  const task = state.tasks.find((item) => item.id === id);
  if (!task || task.status === "completed") return;
  task.status = "completed";
  state.childProfile.stars += task.starsReward;
  markDailyActivity();
  updateTodayProgress(task.category);
  unlockDailyBonusIfNeeded();
  saveState();
}

function addStars(amount) {
  state.childProfile.stars += amount;
  markDailyActivity();
  saveState();
}

function markDailyActivity() {
  const today = todayKey();
  if (state.childProfile.lastActiveDate !== today) {
    state.childProfile.streak += 1;
    state.childProfile.lastActiveDate = today;
  }
}

function updateTodayProgress(category) {
  const today = state.progress[state.progress.length - 1];
  today.completedTasks = Math.min(today.totalTasks, today.completedTasks + 1);
  if (category === "speech") today.speechScore = Math.min(100, today.speechScore + 5);
  if (category === "emotions") today.emotionScore = Math.min(100, today.emotionScore + 5);
  if (category === "attention") today.attentionScore = Math.min(100, today.attentionScore + 5);
  if (category === "social" || category === "aac") today.socialScore = Math.min(100, today.socialScore + 5);
}

function unlockDailyBonusIfNeeded() {
  const allDone = assignedTasks().every((task) => task.status === "completed");
  if (allDone && !state.dailyBonusPaid) {
    state.childProfile.stars += 50;
    state.dailyBonusPaid = true;
  }
}

function rewardUnlocked(id) {
  const tasks = Object.fromEntries(state.tasks.map((task) => [task.id, task.status === "completed"]));
  return (
    (id === "first" && state.tasks.some((task) => task.status === "completed")) ||
    (id === "streak3" && state.childProfile.streak >= 3) ||
    (id === "emotion-master" && tasks.emotions) ||
    (id === "words" && tasks.words) ||
    (id === "attention" && tasks.attention) ||
    (id === "communication" && (tasks.aac || state.gameStats.aacUses > 0))
  );
}

function activeRole() {
  const path = route();
  if (path.startsWith("/child")) return "child";
  if (path.startsWith("/parent")) return "parent";
  if (path.startsWith("/specialist")) return "specialist";
  return "home";
}

function shell(content, childBottomNav = false) {
  const path = route();
  return `
    <div class="shell">
      <header class="topbar">
        <button class="brand" data-go="/" aria-label="На главную">
          <span class="brand-mark">✦</span>
          <span>
            <p class="brand-title">Senim Kids</p>
            <p class="brand-subtitle">AI-платформа домашней поддержки и развития детей с РАС</p>
          </span>
        </button>
        <nav class="nav" aria-label="Основная навигация">
          ${navButton("/", "Главная", path === "/")}
          ${navButton("/child", "Ребёнок", path.startsWith("/child"))}
          ${navButton("/parent", "Родитель", path.startsWith("/parent"))}
          ${navButton("/specialist", "Специалист", path.startsWith("/specialist"))}
          ${navButton("/about", "О проекте", path === "/about")}
        </nav>
        <div class="role-switch" aria-label="Переключатель ролей">
          ${roleButton("Ребёнок", "/child", activeRole() === "child")}
          ${roleButton("Родитель", "/parent", activeRole() === "parent")}
          ${roleButton("Специалист", "/specialist", activeRole() === "specialist")}
        </div>
      </header>
      <main class="main">${content}</main>
      ${childBottomNav ? bottomNav(path) : ""}
      <footer class="disclaimer">
        <div class="container">
          Senim Kids не ставит диагноз и не заменяет очную диагностику или медицинскую помощь. Платформа помогает родителям и специалистам сопровождать развитие ребёнка дома.
        </div>
      </footer>
    </div>
  `;
}

function navButton(path, label, active) {
  return `<button class="${active ? "active" : ""}" data-go="${path}">${label}</button>`;
}

function roleButton(label, path, active) {
  return `<button class="${active ? "active" : ""}" data-go="${path}">${label}</button>`;
}

function bottomNav(path) {
  return `
    <nav class="bottom-nav" aria-label="Детская навигация">
      <button class="${path === "/child" ? "active" : ""}" data-go="/child">Сегодня</button>
      <button class="${path.includes("/games") ? "active" : ""}" data-go="/child">Игры</button>
      <button class="${path === "/child/aac" ? "active" : ""}" data-go="/child/aac">Карточки</button>
      <button class="${path === "/child/rewards" ? "active" : ""}" data-go="/child/rewards">Награды</button>
      <button data-go="/parent">Профиль</button>
    </nav>
  `;
}
