// Dummy-Daten
let wishList = [
  { text: "Kopfhörer", reserved: false },
  { text: "Buch", reserved: false },
  { text: "Spielkonsole", reserved: true }
];

// Prüfen, ob Admin über URL
const urlParams = new URLSearchParams(window.location.search);
const isAdmin = urlParams.get('admin') === 'true';
if(isAdmin) {
  document.getElementById('admin-panel').style.display = 'block';
}

// Funktion, um Liste anzuzeigen
function renderList() {
  const listEl = document.getElementById('wish-list');
  listEl.innerHTML = '';
  wishList.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = item.text;

    if(isAdmin) {
      li.classList.add('reserved'); // Admin sieht Reservierungen nicht
    } else {
      if(item.reserved) li.classList.add('reserved');
      const btn = document.createElement('button');
      btn.textContent = item.reserved ? "Reserviert" : "Reservieren";
      btn.disabled = item.reserved;
      btn.onclick = () => {
        item.reserved = true;
        renderList();
      }
      li.appendChild(btn);
    }

    listEl.appendChild(li);
  });
}

// Neues Element hinzufügen (nur Admin)
if(isAdmin) {
  document.getElementById('add-button').onclick = () => {
    const newItem = document.getElementById('new-item').value.trim();
    if(newItem) {
      wishList.push({ text: newItem, reserved: false });
      document.getElementById('new-item').value = '';
      renderList();
    }
  }
}

// Initial render
renderList();
