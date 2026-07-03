function gameLayout(title, body) {
  return shell(`
    <section class="app-page game-shell">
      <div class="game-panel">
        <div class="game-title-row">
          <button class="btn secondary" data-go="/child">Назад</button>
          <span class="status">⭐ ${state.childProfile.stars}</span>
        </div>
        <h1 class="game-prompt">${title}</h1>
        ${body}
      </div>
    </section>
  `, true);
}

function emotionsGame() {
  const rounds = [
    { target: "радостное лицо", answer: "радость", hint: "Посмотри на улыбку." },
    { target: "грустное лицо", answer: "грусть", hint: "Посмотри на опущенные уголки губ." },
    { target: "спокойное лицо", answer: "спокойствие", hint: "Лицо ровное и тихое." },
  ];
  if (!gameSession.emotions) gameSession.emotions = { round: 0, correct: 0, feedback: "Выбери эмоцию", done: false };
  const session = gameSession.emotions;
  const current = rounds[session.round % rounds.length];
  const choices = [
    ["радость", "😊"],
    ["грусть", "😔"],
    ["злость", "😠"],
    ["спокойствие", "😌"],
  ];
  return gameLayout(`Найди ${current.target}`, `
    <div class="choice-grid">
      ${choices.map(([label, icon]) => `<button class="choice-card" data-emotion="${label}"><span class="choice-emoji">${icon}</span><strong>${label}</strong></button>`).join("")}
    </div>
    <div class="feedback ${session.done ? "good" : ""}">${session.feedback} · ${session.correct}/3</div>
  `);
}

function handleEmotion(label) {
  const session = gameSession.emotions;
  const rounds = [
    { answer: "радость", hint: "Попробуй ещё раз. Посмотри на улыбку." },
    { answer: "грусть", hint: "Попробуй ещё раз. Посмотри на выражение лица." },
    { answer: "спокойствие", hint: "Попробуй ещё раз. Найди спокойное лицо." },
  ];
  const current = rounds[session.round % rounds.length];
  if (label === current.answer) {
    addStars(10);
    state.gameStats.emotionsCorrect += 1;
    session.correct += 1;
    session.round += 1;
    session.feedback = "Отлично! Получено +10 звёзд";
    if (session.correct >= 3) {
      session.done = true;
      completeTask("emotions");
      session.feedback = "Ты справился! Задание выполнено";
    }
  } else {
    session.feedback = current.hint;
  }
  saveState();
  render();
}

const wordRounds = [
  { word: "мяч", answer: "мяч", options: [["мяч", "⚽"], ["кот", "🐱"], ["дом", "🏠"]] },
  { word: "мама", answer: "мама", options: [["мама", "👩"], ["вода", "💧"], ["машина", "🚗"]] },
  { word: "дом", answer: "дом", options: [["яблоко", "🍎"], ["дом", "🏠"], ["кот", "🐱"]] },
  { word: "вода", answer: "вода", options: [["вода", "💧"], ["мяч", "⚽"], ["машина", "🚗"]] },
  { word: "яблоко", answer: "яблоко", options: [["кот", "🐱"], ["яблоко", "🍎"], ["дом", "🏠"]] },
];

function wordsGame() {
  if (!gameSession.words) gameSession.words = { round: 0, correct: 0, errors: 0, feedback: "Найди картинку", reveal: false };
  const session = gameSession.words;
  const current = wordRounds[session.round % wordRounds.length];
  return gameLayout(`Найди: ${current.word}`, `
    <div class="choice-grid">
      ${current.options.map(([label, icon]) => `<button class="choice-card ${session.reveal && label === current.answer ? "reveal" : ""}" data-word="${label}"><span class="choice-emoji">${icon}</span><strong>${label}</strong></button>`).join("")}
    </div>
    <div class="feedback">${session.feedback} · ${session.correct}/5</div>
  `);
}

function handleWord(label) {
  const session = gameSession.words;
  const current = wordRounds[session.round % wordRounds.length];
  if (label === current.answer) {
    addStars(10);
    state.gameStats.wordsCorrect += 1;
    session.correct += 1;
    session.round += 1;
    session.errors = 0;
    session.reveal = false;
    session.feedback = "Молодец! Получено +10 звёзд";
    if (session.correct >= 5) {
      completeTask("words");
      session.feedback = "Ты справился! Слова выполнены";
    }
  } else {
    state.gameStats.wordsErrors += 1;
    session.errors += 1;
    session.reveal = session.errors >= 2;
    session.feedback = session.reveal ? "Давай попробуем ещё раз. Подсказка подсвечена" : "Давай попробуем ещё раз";
  }
  saveState();
  render();
}

const attentionRounds = [
  { title: "Найди лишний предмет", answer: "машина", options: [["яблоко", "🍎"], ["банан", "🍌"], ["груша", "🍐"], ["машина", "🚗"]] },
  { title: "Что не транспорт?", answer: "мишка", options: [["автобус", "🚌"], ["машина", "🚗"], ["самолёт", "✈️"], ["мишка", "🧸"]] },
  { title: "Что не игрушка?", answer: "вода", options: [["кубик", "🧊"], ["мяч", "⚽"], ["кукла", "🧸"], ["вода", "💧"]] },
];

function attentionGame() {
  if (!gameSession.attention) gameSession.attention = { round: 0, correct: 0, feedback: "Выбери лишний предмет" };
  const session = gameSession.attention;
  const current = attentionRounds[session.round % attentionRounds.length];
  return gameLayout(current.title, `
    <div class="choice-grid">
      ${current.options.map(([label, icon]) => `<button class="choice-card" data-attention="${label}"><span class="choice-emoji">${icon}</span><strong>${label}</strong></button>`).join("")}
    </div>
    <div class="feedback">${session.feedback} · ${session.correct}/3</div>
  `);
}

function handleAttention(label) {
  const session = gameSession.attention;
  const current = attentionRounds[session.round % attentionRounds.length];
  if (label === current.answer) {
    addStars(10);
    state.gameStats.attentionCorrect += 1;
    session.correct += 1;
    session.round += 1;
    session.feedback = "Ты нашёл лишний предмет! +10 звёзд";
    if (session.correct >= 3) {
      completeTask("attention");
      session.feedback = "Ты справился! Внимание выполнено";
    }
  } else {
    session.feedback = "Попробуй ещё раз. Посмотри, что отличается";
  }
  saveState();
  render();
}

const socialStories = [
  { situation: "Саша хочет игрушку. Что можно сказать?", answer: "Можно, пожалуйста?", options: ["Дай!", "Можно, пожалуйста?", "Уйди!"], explain: "Когда мы просим спокойно, другим легче нас понять." },
  { situation: "Саше нужна помощь. Что можно сказать?", answer: "Помоги мне, пожалуйста", options: ["Помоги мне, пожалуйста", "Не буду!", "Отдай!"], explain: "Просить помощь можно короткой спокойной фразой." },
  { situation: "Саша пришёл на занятие. Как поздороваться?", answer: "Здравствуйте", options: ["Здравствуйте", "Уйди", "Дай"], explain: "Приветствие помогает начать общение." },
  { situation: "Игрушка занята. Что поможет подождать?", answer: "Я подожду", options: ["Я подожду", "Моя!", "Убери!"], explain: "Можно подождать очередь и потом попросить." },
  { situation: "Саша устал. Что можно сказать?", answer: "Я устал, нужен отдых", options: ["Я устал, нужен отдых", "Ничего", "Кричать"], explain: "Сообщить об усталости - хороший способ попросить паузу." },
];

function socialGame() {
  if (!gameSession.social) gameSession.social = { round: 0, correct: 0, feedback: "Выбери ответ", explanation: "" };
  const session = gameSession.social;
  const current = socialStories[session.round % socialStories.length];
  return gameLayout(current.situation, `
    <div class="grid">
      ${current.options.map((option) => `<button class="choice-card" data-social="${option}"><strong>${option}</strong></button>`).join("")}
    </div>
    <div class="feedback">${session.feedback}${session.explanation ? `<br><span class="copy">${session.explanation}</span>` : ""}</div>
  `);
}

function handleSocial(answer) {
  const session = gameSession.social;
  const current = socialStories[session.round % socialStories.length];
  session.explanation = current.explain;
  if (answer === current.answer) {
    addStars(10);
    state.gameStats.socialCorrect += 1;
    session.correct += 1;
    session.round += 1;
    session.feedback = "Отлично! +10 звёзд";
    if (session.correct >= 3) {
      completeTask("social");
      session.feedback = "Ты справился! Истории выполнены";
    }
  } else {
    session.feedback = "Попробуй мягкую фразу";
  }
  saveState();
  render();
}

const aacGroups = [
  ["Хочу", [["пить", "💧", "Я хочу пить"], ["есть", "🍽️", "Я хочу есть"], ["играть", "🧸", "Я хочу играть"], ["отдыхать", "🛋️", "Я хочу отдыхать"]]],
  ["Эмоции", [["радостно", "😊", "Мне радостно"], ["грустно", "😔", "Мне грустно"], ["злюсь", "😠", "Я злюсь"], ["устал", "😴", "Я устал"]]],
  ["Люди", [["мама", "👩", "Мама"], ["папа", "👨", "Папа"], ["врач", "🩺", "Врач"], ["учитель", "👩‍🏫", "Учитель"]]],
  ["Помощь", [["помоги", "🤝", "Помоги мне"], ["больно", "🩹", "Мне больно"], ["не хочу", "✋", "Я не хочу"], ["ещё", "➕", "Хочу ещё"]]],
];

function aacPage() {
  if (!gameSession.aac) gameSession.aac = { phrase: "Выбери карточку", selected: "" };
  const session = gameSession.aac;
  return shell(`
    <section class="app-page">
      <div class="container">
        <div class="page-head">
          <div>
            <p class="eyebrow">AAC-карточки</p>
            <h1 class="page-title">Карточки общения</h1>
            <p class="copy">Нажми карточку, чтобы собрать фразу. Можно озвучить её.</p>
          </div>
          <button class="btn secondary" data-go="/child">Назад</button>
        </div>
        ${aacGroups.map(([group, cards]) => `<h3>${group}</h3><div class="aac-grid" style="margin-bottom:20px">${cards.map(([label, icon, phrase]) => `<button class="aac-card ${session.selected === phrase ? "selected" : ""}" data-aac="${phrase}"><span class="choice-emoji">${icon}</span><strong>${label}</strong></button>`).join("")}</div>`).join("")}
        <div class="aac-phrase"><strong>${session.phrase}</strong><button class="btn yellow" data-action="speak">Озвучить</button></div>
      </div>
    </section>
  `, true);
}

function selectAac(phrase) {
  if (!gameSession.aac) gameSession.aac = {};
  gameSession.aac.phrase = phrase;
  gameSession.aac.selected = phrase;
  state.gameStats.aacUses += 1;
  addStars(10);
  if (state.gameStats.aacUses >= 3) completeTask("aac");
  saveState();
  render();
}

function speakPhrase() {
  const phrase = gameSession.aac?.phrase;
  if (!phrase || phrase === "Выбери карточку") return;
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.lang = "ru-RU";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }
}
