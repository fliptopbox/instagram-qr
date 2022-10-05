const ig = document.querySelector(".instagram");
ig.onchange = handleChange;
ig.onkeyup = handleChange;

function handleChange(e) {
  const { value } = e.target;
  const handle = `${value}`.trim().replace(/@/g);
  const instaURL = `https://www.instagram.com/${handle}/`;
  console.log(instaURL);
  makeQrUrl(instaURL);
}

function makeQrUrl(value, size = 240) {
  const text = value;
  const url = `https://chart.googleapis.com/chart?cht=qr&chl=${text}&chs=${size}x${size}&chld=L|0`;
  const qr = document.querySelector(".qr-code");

  qr.src = url;
  return url;
}

(() => {
  const qs = window.location.search;

  if (qs) {
    const entries = qs
      .split(/[?&]/g)
      .filter((s) => s)
      .map((s) => s.split("="));

    console.assert(entries.lenght !== 2, "Nothing to do here");
    if (!entries.length === 2) return;

    const o = Object.fromEntries(entries);

    document.querySelector(".fullname").value = o.fn;
    document.querySelector(".instagram").value = o.ig;
    makeQrUrl(o.ig);


    console.log(o);
  }
})();
