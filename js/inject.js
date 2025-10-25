async function inject(id, file) {
  const el = document.getElementById(id);
  if (!el) return;
  const res = await fetch(file);
  if (res.ok) el.innerHTML = await res.text();
}

document.addEventListener("DOMContentLoaded", () => {
  inject("header", "./components/header.html");
  inject("footer", "./components/footer.html");
  inject("header", "../components/header.html");
  inject("footer", "../components/footer.html");
});
