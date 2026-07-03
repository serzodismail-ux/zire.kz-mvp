function landing() {
  return shell(`
    <section class="hero section">
      <div class="container hero-stage">
        <div class="hero-content">
          <span class="eyebrow">MVP для домашнего сопровождения между консультациями</span>
          <h1>Senim Kids</h1>
          <p class="lead">AI-платформа, где ребёнок проходит короткие визуальные задания, родитель получает понятный домашний план, а специалист видит динамику и корректирует программу.</p>
          <div class="actions">
            <button class="btn mint" data-go="/child">Открыть детское демо</button>
            <button class="btn secondary" data-go="/specialist">Панель специалиста</button>
            <button class="btn secondary" data-go="/parent">Режим родителя</button>
          </div>
          <div class="trust-row" aria-label="Ключевые принципы">
            <span>Без диагнозов</span>
            <span>5-10 минут в день</span>
            <span>Мягкая обратная связь</span>
          </div>
        </div>
        ${heroProductPreview()}
      </div>
    </section>
    <section class="section proof-band">
      <div class="container proof-grid">
        ${proofItem("3 роли", "ребёнок, родитель, специалист")}
        ${proofItem("5 заданий", "игры + AAC-карточки")}
        ${proofItem("localStorage", "прогресс сохраняется")}
        ${proofItem("AI-анализ", "демо-выводы по данным")}
      </div>
    </section>
    <section class="section">
      <div class="container grid two">
        <div>
          <h2>Почему это актуально</h2>
          <p class="copy">Детям с РАС часто нужны предсказуемые, визуальные и повторяющиеся задания. Родителям важно понимать, чем заниматься дома, а специалистам - видеть динамику между консультациями.</p>
        </div>
        <div class="grid">
          ${infoCard("🧩", "Индивидуальный темп", "Задания короткие, понятные и без перегруза экрана.")}
          ${infoCard("📈", "Динамика навыков", "Прогресс по речи, эмоциям, вниманию и социальным навыкам виден в кабинетах.")}
          ${infoCard("🏠", "Домашная поддержка", "План помогает заниматься регулярно по 5-10 минут в день.")}
        </div>
      </div>
    </section>
    <section class="section tight">
      <div class="container">
        <div class="section-heading">
          <div>
            <span class="eyebrow">Не просто лендинг</span>
            <h2>Внутри уже есть продуктовый сценарий</h2>
          </div>
          <p class="copy">Демо показывает полный цикл: назначение задания специалистом, выполнение ребёнком, заметка родителя и аналитика для следующей корректировки.</p>
        </div>
        <div class="grid three">
          ${audienceCard("Ребёнок", "Крупные карточки, короткие инструкции, звёзды и спокойная поддержка без наказаний.", "😊")}
          ${audienceCard("Родитель", "План на день, инструкции, рекомендации и заметки, которые сразу видит специалист.", "🏠")}
          ${audienceCard("Специалист", "Динамика навыков, активность, назначения и AI-подсказки без медицинских диагнозов.", "📊")}
        </div>
      </div>
    </section>
    <section class="section tight">
      <div class="container">
        <h2>Как работает Senim Kids</h2>
        <div class="grid four">
          ${stepCard("1", "Ребёнок играет", "Проходит задания и получает звёзды.")}
          ${stepCard("2", "Родитель видит план", "Получает инструкции и сохраняет заметки.")}
          ${stepCard("3", "Специалист смотрит прогресс", "Назначает задания и корректирует программу.")}
          ${stepCard("4", "AI подсвечивает сигналы", "Дает поддерживающий анализ без диагнозов.")}
        </div>
      </div>
    </section>
    <section class="section tight">
      <div class="container">
        <h2>Ключевые функции</h2>
        <div class="grid four">
          ${featureCard("Индивидуальная программа", "Персональный план заданий для ребёнка.")}
          ${featureCard("AAC-карточки", "Визуальные фразы с озвучиванием.")}
          ${featureCard("Игровые занятия", "Эмоции, слова, внимание и социальные истории.")}
          ${featureCard("Геймификация", "Звёзды, уровни, серия дней и награды.")}
          ${featureCard("Кабинет родителя", "План, инструкции, рекомендации и заметки.")}
          ${featureCard("Панель специалиста", "Дети, назначения, графики и анализ.")}
          ${featureCard("AI-анализ", "Имитация выводов на основе прогресса.")}
          ${featureCard("LocalStorage", "Данные демо сохраняются после перезагрузки.")}
        </div>
      </div>
    </section>
    <section class="section tight">
      <div class="container grid two">
        <div>
          <span class="eyebrow">Безопасная позиция</span>
          <h2>AI помогает увидеть сигналы, но решение остаётся за специалистом</h2>
          <p class="copy">Платформа не ставит диагноз и не заменяет очную помощь. Она собирает домашнюю активность, показывает динамику и помогает подготовить более предметный разговор со специалистом.</p>
        </div>
        <div class="signal-panel">
          ${signalRow("Высокая регулярность", "если выполнено больше 80% заданий", "good")}
          ${signalRow("Снизить нагрузку", "если активность ниже 40%", "warn")}
          ${signalRow("Усилить речь и AAC", "если ошибки в словах повторяются", "focus")}
        </div>
      </div>
    </section>
  `);
}

function heroProductPreview() {
  const completed = assignedTasks().filter((task) => task.status === "completed").length;
  return `
    <aside class="product-preview" aria-label="Демо интерфейс Senim Kids">
      <div class="preview-top">
        <span class="preview-dot"></span>
        <strong>Сегодня у Саши</strong>
        <span class="status done">${completed}/${assignedTasks().length}</span>
      </div>
      <div class="preview-child">
        <div class="robot-face">AI</div>
        <div>
          <strong>Следующее задание</strong>
          <p>Найди радостное лицо</p>
        </div>
      </div>
      <div class="preview-choices">
        <span>😊<small>радость</small></span>
        <span>😔<small>грусть</small></span>
        <span>😌<small>спокойно</small></span>
      </div>
      <div class="preview-bars">
        ${skillMeter("Эмоции", latestProgress().emotionScore)}
        ${skillMeter("Речь", latestProgress().speechScore)}
      </div>
    </aside>
  `;
}

function proofItem(value, label) {
  return `<div><strong>${value}</strong><span>${label}</span></div>`;
}

function audienceCard(title, text, icon) {
  return `<article class="card audience-card"><div class="icon-bubble">${icon}</div><h3>${title}</h3><p class="copy">${text}</p></article>`;
}

function signalRow(title, text, tone) {
  return `<div class="signal-row ${tone}"><strong>${title}</strong><span>${text}</span></div>`;
}

function infoCard(icon, title, text) {
  return `<article class="card"><div class="icon-bubble">${icon}</div><h3>${title}</h3><p class="copy">${text}</p></article>`;
}

function stepCard(num, title, text) {
  return `<article class="card mint"><div class="icon-bubble">${num}</div><h3>${title}</h3><p class="copy">${text}</p></article>`;
}

function featureCard(title, text) {
  return `<article class="card"><h3>${title}</h3><p class="copy">${text}</p></article>`;
}

function childPage() {
  const child = state.childProfile;
  const completed = assignedTasks().filter((task) => task.status === "completed").length;
  const total = assignedTasks().length || 1;
  return shell(`
    <section class="app-page">
      <div class="container">
        <div class="page-head">
          <div>
            <p class="eyebrow">Сегодняшний план</p>
            <h1 class="page-title">Привет, ${child.name}!</h1>
            <p class="copy">Выбери задание. Можно пробовать спокойно, без спешки.</p>
          </div>
          <button class="btn reset-button" data-action="reset">Сбросить демо</button>
        </div>
        <div class="grid four">
          ${metric("⭐", child.stars, "звёзд")}
          ${metric("🌱", `Уровень ${levelFromStars(child.stars)}`, "программа")}
          ${metric("🔥", `${child.streak} дня`, "серия занятий")}
          ${metric("✅", `${completed}/${total}`, "план сегодня")}
        </div>
        <div class="session-strip">
          ${sessionStep("1", "Сначала", "Выбери одну карточку")}
          ${sessionStep("2", "Потом", "Попробуй спокойно")}
          ${sessionStep("3", "После", "Получи звёзды и отдых")}
        </div>
        <div class="card" style="margin:18px 0">
          <div class="metric-card">
            <div>
              <h3>План на сегодня</h3>
              <p class="copy">Заверши хотя бы одно задание, чтобы сохранить серию дня.</p>
            </div>
            <button class="btn yellow" data-go="${assignedTasks()[0]?.route || "/child/aac"}">Начать занятие</button>
          </div>
          <div class="progress-bar" aria-label="Прогресс дня"><span style="width:${Math.round((completed / total) * 100)}%"></span></div>
        </div>
        <div class="grid">
          ${assignedTasks().map(taskCard).join("")}
        </div>
      </div>
    </section>
  `, true);
}

function sessionStep(number, label, text) {
  return `<div class="session-step"><span>${number}</span><strong>${label}</strong><small>${text}</small></div>`;
}

function metric(icon, value, label) {
  return `<article class="card metric-card"><div><div class="metric-value">${value}</div><div class="metric-label">${label}</div></div><div class="icon-bubble">${icon}</div></article>`;
}

function taskCard(task) {
  const done = task.status === "completed";
  const progress = task.status === "in_progress";
  return `
    <article class="task-card ${done ? "completed" : ""}">
      <div class="icon-bubble ${done ? "soft-mint" : ""}">${task.icon}</div>
      <div>
        <h3>${task.title}</h3>
        <p class="copy">${task.description}</p>
      </div>
      <div class="actions" style="margin:0; justify-content:flex-end">
        <span class="status ${done ? "done" : progress ? "progress" : ""}">${done ? "выполнено" : progress ? "в процессе" : "не начато"}</span>
        <button class="btn ${done ? "secondary" : "mint"}" data-go="${task.route}">${done ? "Повторить" : "Открыть"}</button>
      </div>
    </article>
  `;
}
