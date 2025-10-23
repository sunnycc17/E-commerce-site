async function inject(id, file) {
  const el = document.getElementById(id);
  if (!el) return;
  const res = await fetch(file);
  if (res.ok) el.innerHTML = await res.text();
}

inject('header', '/components/header.html');
inject('footer', '/components/footer.html');
