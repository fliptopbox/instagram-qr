const ig = document.querySelector(".instagram");
ig.onchange = handleChange;
ig.onkeyup = handleChange;

function handleChange(e) {
  const { value } = e.target;
  const handle = `${value}`.trim().replace(/@/g);
  updateElements(instaURL);
}

function makeQrUrl(value, size = 240) {
  const text = value;
  const url = `https://chart.googleapis.com/chart?cht=qr&chl=${text}&chs=${size}x${size}&chld=L|0`;
  return url;
}

async function loadTSVdata() {
  // this sheet MUST be published and public to fetch the data
  const url = [
    "https://docs.google.com/spreadsheets/",
    "d/e/2PACX-1vR6vVS5hQKmU_hk9jOt5gSbIAzm-FS_A_gy72cfrHC2Db4iJQ8VoU9fmXGzsAGV0Jtdg-4Do1oKlJfM/",
    "pub?gid=447450263&single=true&output=tsv",
  ].join("");

  const data = await fetch(url);
  const text = await data.text();
  const array = text
    .split(/[\n\r]+/g)
    .slice(1)
    .map((row) => row.split(/\t/))
    .filter(([fn, sn, ig]) => ig && fn)
    .sort(([a], [b]) => (a > b ? 1 : -1));

  return array;
}

function updateElements(handle, name) {
  const url = `https://www.instagram.com/${handle}/`;

  // Name is Optional argument
  if (name) document.querySelector(".fullname").value = name;

  // Link to the Instagram account
  document.querySelector(".instagram-link").href = url;

  // This is a querstring load action, so update both name and url
  if (url && name) document.querySelector(".instagram").value = handle;

  // Update the QR image
  document.querySelector(".qr-code").src = makeQrUrl(url);
}

function loadQuerystring() {
  const qs = window.location.search;

  if (!qs) return;

  const entries = qs
    .split(/[?&]/g)
    .filter((s) => s)
    .map((s) => s.split("="));

  console.assert(entries.length !== 2, "Nothing to do here");
  if (!entries.length === 2) return;

  const { fn, ig } = Object.fromEntries(entries);
  updateElements(ig, fn);
}

function appendModelData(array) {
  const ul = document.querySelector("#models");
  const list = array
    .map(
      ([fn, _, ig]) => `
      <li>
        <a href="/?ig=${ig}&fn=${fn}">${fn}</a> 
        <em>(@${ig})</em>
      </li>`
    )
    .join("\n");

  ul.innerHTML = list || "<li>Empty</li>";
}

function bindToggleTrigger() {
  const toggle = document.querySelector(".menu-icon");
  const m = document.querySelector("#models");

  toggle.onclick = (e) => {
    e.stopImmediatePropagation();
    m.classList.toggle("hidden");
    document.body.addEventListener(
      "click", //
      () => m.classList.add("hidden"),
      { once: true }
    );
  };
}

(async () => {
  loadQuerystring();

  const sesh = sessionStorage.models || null;
  const models = sesh ? JSON.parse(sesh) : await loadTSVdata();

  appendModelData(models);
  bindToggleTrigger();

  if (!sesh) {
    console.log("Cache Gsheet as session data");
    sessionStorage.models = JSON.stringify(models);
  }
})();
