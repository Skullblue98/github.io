// Prüfen Admin
const urlParams = new URLSearchParams(window.location.search);
const isAdmin = urlParams.get('admin') === 'true';
if(isAdmin) document.getElementById('admin-panel').style.display = 'block';

// Firestore Referenz
const wishListRef = db.collection("wishlists").doc("default"); // einfache Demo-Liste

// Wünsche aus Firestore laden
function loadList() {
  wishListRef.get().then(doc => {
    if(doc.exists) {
      renderList(doc.data().items);
    } else {
      // Initial leere Liste
      wishListRef.set({ items: [] });
      renderList([]);
    }
  });
}

// Liste rendern
function renderList(items) {
  const listEl = document.getElementById('wish-list');
  listEl.innerHTML = '';
  items.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = item.text;

    if(isAdmin) {
      li.classList.add('reserved'); // Admin sieht Reservierungen nicht
    } else {
      if(item.reserved) li.classList.add('reserved');
      const btn = document.createElement('button');
      btn.textContent = item.reserved ? "Reserviert" : "Reservieren";
      btn.disabled = item.reserved;
      btn.onclick = () => reserveItem(index);
      li.appendChild(btn);
    }

    listEl.appendChild(li);
  });
}

// Admin: neuen Wunsch hinzufügen
if(isAdmin) {
  document.getElementById('add-button').onclick = () => {
    const newItem = document.getElementById('new-item').value.trim();
    if(!newItem) return;

    wishListRef.get().then(doc => {
      const items = doc.data().items || [];
      items.push({ text: newItem, reserved: false });
      wishListRef.set({ items }).then(() => loadList());
    });

    document.getElementById('new-item').value = '';
  }
}

// Besucher: Wunsch reservieren
function reserveItem(index) {
  wishListRef.get().then(doc => {
    const items = doc.data().items;
    items[index].reserved = true;
    wishListRef.set({ items }).then(() => loadList());
  });
}

// Initial load
loadList();
