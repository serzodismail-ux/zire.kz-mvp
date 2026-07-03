function rewardsPage() {
  return shell(`
    <section class="app-page">
      <div class="container">
        <div class="page-head">
          <div>
            <p class="eyebrow">Награды</p>
            <h1 class="page-title">Твои достижения</h1>
            <p class="copy">Награды открываются за занятия, серию дней и карточки общения.</p>
          </div>
          <button class="btn secondary" data-go="/child">Назад</button>
        </div>
        <div class="grid three">
          ${rewardsCatalog.map(([id, title, description]) => {
            const unlocked = rewardUnlocked(id);
            return `<article class="card reward-card ${unlocked ? "unlocked" : "locked"}"><div class="icon-bubble">${unlocked ? "🏅" : "🔒"}</div><h3>${title}</h3><p class="copy">${description}</p><span class="status ${unlocked ? "done" : ""}">${unlocked ? "открыто" : "закрыто"}</span></article>`;
          }).join("")}
        </div>
      </div>
    </section>
  `, true);
}

function parentPage() {
  return shell(`
    <section class="app-page">
      <div class="container">
        <div class="page-head">
          <div>
            <p class="eyebrow">Кабинет родителя</p>
            <h1 class="page-title">Домашний план Саши</h1>
            <p class="copy">Короткие задания, инструкции и заметки для специалиста.</p>
          </div>
          <button class="btn secondary" data-go="/parent/instructions">Инструкции</button>
        </div>
        <div class="dashboard-layout">
          <div class="grid">
            <article class="card">
              <h3>Профиль ребёнка</h3>
              <p class="copy">Саша, 7 лет. Цели: ${state.childProfile.goals.join(", ")}.</p>
              <div class="grid three">
                ${metric("⭐", state.childProfile.stars, "звёзд")}
                ${metric("🌱", `Уровень ${levelFromStars(state.childProfile.stars)}`, "уровень")}
                ${metric("🔥", `${state.childProfile.streak} дня`, "серия")}
              </div>
            </article>
            <article class="card">
              <h3>План на сегодня</h3>
              <div class="grid">${assignedTasks().map(parentTaskRow).join("")}</div>
            </article>
            <article class="card">
              <h3>Прогресс за неделю</h3>
              ${chart("completedTasks", "totalTasks")}
            </article>
          </div>
          <aside class="grid">
            <article class="card yellow">
              <div class="icon-bubble">💡</div>
              <h3>Рекомендации</h3>
              <ul class="check-list"><li>Использовать короткие фразы.</li><li>Давать время на ответ.</li><li>Хвалить за попытку.</li><li>Повторять задания 5-10 минут.</li></ul>
            </article>
            <article class="card">
              <h3>Заметки родителя</h3>
              <form class="note-form" data-form="note">
                <textarea name="note" placeholder="Например: сегодня лучше получилось с карточками эмоций"></textarea>
                <button class="btn mint" type="submit">Сохранить заметку</button>
              </form>
              <div class="grid" style="margin-top:14px">${state.notes.map(noteCard).join("")}</div>
            </article>
          </aside>
        </div>
      </div>
    </section>
  `);
}

function parentTaskRow(task) {
  return `<div class="task-card"><div class="icon-bubble">${task.icon}</div><div><strong>${task.title}</strong><p class="copy">${task.description}</p></div><span class="status ${task.status === "completed" ? "done" : ""}">${task.status === "completed" ? "выполнено" : "в плане"}</span></div>`;
}

function noteCard(note) {
  return `<article class="card" style="box-shadow:none"><strong>${note.date}</strong><p class="copy">${note.text}</p></article>`;
}

function instructionsPage() {
  const blocks = [
    ["Как заниматься дома", ["5-10 минут", "короткие инструкции", "спокойный тон", "не ругать за ошибки", "хвалить за попытку"]],
    ["Как использовать карточки общения", ["показать карточку", "произнести слово", "дать ребёнку выбрать", "повторять в бытовых ситуациях"]],
    ["Как поддерживать мотивацию", ["маленькие цели", "награды", "перерывы", "повторение"]],
    ["Когда обратиться к специалисту", ["резкое ухудшение поведения", "сильная тревога", "агрессия или самоповреждение", "потеря навыков", "сомнения родителей"]],
  ];
  return shell(`
    <section class="app-page"><div class="container"><div class="page-head"><div><p class="eyebrow">Инструкции</p><h1 class="page-title">Поддержка дома</h1></div><button class="btn secondary" data-go="/parent">Назад</button></div><div class="grid two">${blocks.map(([title, items]) => `<article class="card"><h3>${title}</h3><ul class="check-list">${items.map((item) => `<li>${item}</li>`).join("")}</ul></article>`).join("")}</div></div></section>
  `);
}

function specialistPage() {
  const selected = specialistChildren.find((child) => child.id === state.selectedSpecialistChild) || specialistChildren[0];
  const completion = Math.round((assignedTasks().filter((task) => task.status === "completed").length / Math.max(assignedTasks().length, 1)) * 100);
  return shell(`
    <section class="app-page"><div class="container"><div class="page-head"><div><p class="eyebrow">Панель специалиста</p><h1 class="page-title">Динамика и назначения</h1><p class="copy">Профессиональный dashboard с демо-данными и заметками родителя.</p></div><span class="status">${completion}% активности</span></div>
      <div class="dashboard-layout"><aside class="grid"><article class="card"><h3>Дети</h3><div class="child-list">${specialistChildren.map((child) => `<button class="${child.id === selected.id ? "active" : ""}" data-child="${child.id}"><span><strong>${child.name}</strong><br><span class="copy">${child.age} лет</span></span><span>›</span></button>`).join("")}</div></article><article class="card"><h3>Назначить задания</h3><form data-form="assign">${state.tasks.map((task) => `<label class="checkbox-row"><input type="checkbox" name="task" value="${task.id}" ${task.assigned ? "checked" : ""}> ${task.title}</label>`).join("")}<button class="btn mint" type="submit">Сохранить назначения</button></form></article></aside>
      <div class="grid"><article class="card"><h3>${selected.name}</h3><p class="copy">${selected.age} лет · ${selected.level} · ${selected.activity}</p><p class="copy">Цели: ${selected.goals.join(", ")}.</p></article><article class="card"><h3>Графики навыков</h3><div class="grid two">${skillMeter("Речь и коммуникация", latestProgress().speechScore)}${skillMeter("Эмоции", latestProgress().emotionScore)}${skillMeter("Внимание", latestProgress().attentionScore)}${skillMeter("Социальные навыки", latestProgress().socialScore)}</div></article><article class="card"><h3>План наблюдения на неделю</h3><div class="care-plan">${carePlanItem("Фокус 1", "Закрепить просьбы через AAC-карточки в бытовых ситуациях.")}${carePlanItem("Фокус 2", "Оставить задания по эмоциям как сильную сторону и повысить сложность постепенно.")}${carePlanItem("Фокус 3", "Для речи использовать выбор из 2-3 вариантов, без длинных инструкций.")}</div></article><article class="card"><h3>Выполненные задания</h3><p class="copy">Назначено: ${assignedTasks().length}. Выполнено: ${assignedTasks().filter((task) => task.status === "completed").length}. Активность: ${completion}%.</p>${chart("completedTasks", "totalTasks")}</article><article class="card"><h3>Заметки родителей</h3><div class="grid">${state.notes.map(noteCard).join("") || "<p class='copy'>Пока нет заметок.</p>"}</div></article><article class="card mint"><div class="icon-bubble">AI</div><h3>AI-анализ прогресса</h3><p class="copy">AI не ставит диагноз. Он помогает специалисту увидеть динамику и подсветить зоны внимания. Решения принимает специалист.</p><ul class="check-list">${aiInsights(completion).map((item) => `<li>${item}</li>`).join("")}</ul></article></div></div></div></section>
  `);
}

function carePlanItem(label, text) {
  return `<div class="care-plan-item"><span>${label}</span><p>${text}</p></div>`;
}

function latestProgress() {
  return state.progress[state.progress.length - 1];
}

function skillMeter(label, value) {
  return `<div><div class="metric-card"><strong>${label}</strong><span>${value}%</span></div><div class="progress-bar"><span style="width:${value}%"></span></div></div>`;
}

function chart(valueKey, totalKey) {
  const max = totalKey ? 100 : Math.max(...state.progress.map((item) => item[valueKey]), 1);
  return `<div class="chart">${state.progress.map((item) => { const pct = totalKey ? (item[valueKey] / item[totalKey]) * 100 : (item[valueKey] / max) * 100; return `<div class="bar"><div class="bar-fill" style="height:${Math.max(12, pct)}%"></div><span>${item.date}</span></div>`; }).join("")}</div>`;
}

function aiInsights(completion) {
  const insights = [];
  if (completion > 80) insights.push("Высокая регулярность занятий.");
  if (completion < 40) insights.push("Низкая регулярность, стоит уменьшить нагрузку.");
  if (state.gameStats.emotionsCorrect >= Math.max(state.gameStats.wordsCorrect, state.gameStats.attentionCorrect)) insights.push("Эмоции развиваются стабильно.");
  if (state.gameStats.wordsErrors >= 2) insights.push("Рекомендуется усилить блок речи и карточек AAC.");
  if (state.notes.length) insights.push(`Учесть заметку родителя: "${state.notes[state.notes.length - 1].text}"`);
  insights.push("Рекомендуется сохранить короткие визуальные задания и мягкую обратную связь.");
  return insights;
}

function aboutPage() {
  return shell(`<section class="app-page"><div class="container"><div class="grid two"><div><p class="eyebrow">О проекте</p><h1 class="page-title">Senim Kids</h1><p class="lead">Цифровая платформа домашней поддержки развития детей с РАС.</p><p class="copy">Она помогает родителям выполнять короткие ежедневные задания дома, ребёнку - развивать речь, коммуникацию, эмоции, внимание и социальные навыки через игру, а специалисту - видеть динамику и корректировать индивидуальную программу.</p></div><article class="card yellow"><div class="icon-bubble">!</div><h3>Важно</h3><ul class="check-list"><li>платформа не ставит диагноз;</li><li>не заменяет врача и очную диагностику;</li><li>не является медицинским изделием;</li><li>рекомендации носят поддерживающий характер;</li><li>индивидуальный план должен подтверждаться специалистом.</li></ul></article></div></div></section>`);
}
