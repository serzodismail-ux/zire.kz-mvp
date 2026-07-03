function saveNote(form) {
  const text = form.note.value.trim();
  if (!text) return;
  state.notes.push({ id: crypto.randomUUID(), date: new Date().toLocaleDateString("ru-RU"), text });
  form.reset();
  saveState();
  render();
}

function saveAssignments(form) {
  const selected = new Set([...form.querySelectorAll("input[name='task']:checked")].map((input) => input.value));
  state.tasks.forEach((task) => {
    task.assigned = selected.has(task.id);
  });
  saveState();
  render();
}

function resetDemo() {
  localStorage.removeItem(STORAGE_KEY);
  state = structuredClone(initialState);
  gameSession = {};
  saveState();
  render();
}

function render() {
  const path = route();
  let html = "";
  if (path === "/") html = landing();
  else if (path === "/child") html = childPage();
  else if (path === "/child/games/emotions") html = emotionsGame();
  else if (path === "/child/games/words") html = wordsGame();
  else if (path === "/child/games/attention") html = attentionGame();
  else if (path === "/child/games/social-story") html = socialGame();
  else if (path === "/child/aac") html = aacPage();
  else if (path === "/child/rewards") html = rewardsPage();
  else if (path === "/parent") html = parentPage();
  else if (path === "/parent/instructions") html = instructionsPage();
  else if (path === "/specialist") html = specialistPage();
  else if (path === "/about") html = aboutPage();
  else html = landing();
  document.getElementById("app").innerHTML = html;
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const target = button.dataset.go;
  if (target) go(target);
  if (button.dataset.action === "reset") resetDemo();
  if (button.dataset.action === "speak") speakPhrase();
  if (button.dataset.emotion) handleEmotion(button.dataset.emotion);
  if (button.dataset.word) handleWord(button.dataset.word);
  if (button.dataset.attention) handleAttention(button.dataset.attention);
  if (button.dataset.social) handleSocial(button.dataset.social);
  if (button.dataset.aac) selectAac(button.dataset.aac);
  if (button.dataset.child) {
    state.selectedSpecialistChild = button.dataset.child;
    saveState();
    render();
  }
});

document.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.target;
  if (form.dataset.form === "note") saveNote(form);
  if (form.dataset.form === "assign") saveAssignments(form);
});

window.addEventListener("hashchange", render);
render();
