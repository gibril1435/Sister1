const api = {
  mhs: '/api/mhs',
  mk: '/api/mk',
  dosen: '/api/dosen',
  kuliah: '/api/kuliah',
  all: '/api/all'
};

function qs(sel) { return document.querySelector(sel); }
function el(tag, attrs = {}, children = []) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') e.className = v; else if (k === 'text') e.textContent = v; else e.setAttribute(k, v);
  });
  children.forEach(c => e.appendChild(c));
  return e;
}

// Tabs
const tabButtons = document.querySelectorAll('nav.tabs button');
const tabs = document.querySelectorAll('section.tab');

function activateTab(name) {
  tabButtons.forEach(b => b.classList.toggle('active', b.dataset.tab === name));
  tabs.forEach(s => s.classList.toggle('active', s.id === `tab-${name}`));
  if (name === 'all') loadAll();
}

tabButtons.forEach(b => b.addEventListener('click', () => activateTab(b.dataset.tab)));

// Render helpers
function renderTable(container, columns, rows, onEdit, onDelete) {
  const table = typeof container === 'string' ? qs(container) : container;
  table.innerHTML = '';
  const thead = el('thead');
  const trh = el('tr');
  columns.forEach(c => trh.appendChild(el('th', { text: c })));
  if (onEdit || onDelete) trh.appendChild(el('th', { text: 'Actions' }));
  thead.appendChild(trh);
  const tbody = el('tbody');
  rows.forEach(r => {
    const tr = el('tr');
    columns.forEach(c => tr.appendChild(el('td', { text: r[c] })));
    if (onEdit || onDelete) {
      const editBtn = onEdit ? el('button', { class: 'btn', text: 'Edit' }) : null;
      const delBtn = onDelete ? el('button', { class: 'btn danger', text: 'Delete' }) : null;
      if (editBtn) editBtn.onclick = () => onEdit(r);
      if (delBtn) delBtn.onclick = () => onDelete(r);
      const cell = el('td');
      if (editBtn) cell.appendChild(editBtn);
      if (delBtn) cell.appendChild(delBtn);
      tr.appendChild(cell);
    }
    tbody.appendChild(tr);
  });
  table.appendChild(thead);
  table.appendChild(tbody);
}

// All tables
async function loadAll() {
  const data = await fetch(api.all).then(r=>r.json());
  renderTable('#table-all-mhs', ['NIM','Nama','Alamat'], data.mhs);
  renderTable('#table-all-mk', ['KodeMatkul','NamaMatkul','SKS','Semester'], data.mk);
  renderTable('#table-all-dosen', ['NIP','Nama','Alamat'], data.dosen);
  renderTable('#table-all-kuliah', ['NIM','NamaMhs','NIP','NamaDosen','KodeMatkul','NamaMatkul','Nilai'], data.kuliah);
}

// Mhs
async function loadMhs() {
  const res = await fetch(api.mhs); const rows = await res.json();
  renderTable('#table-mhs', ['NIM','Nama','Alamat'], rows, fillMhsForm, removeMhs);
}
function fillMhsForm(r){ const f = qs('#form-mhs'); f.NIM.value = r.NIM; f.Nama.value = r.Nama; f.Alamat.value = r.Alamat; }
async function removeMhs(r){ if(!confirm('Delete Mhs '+r.NIM+'?')) return; await fetch(`${api.mhs}/${encodeURIComponent(r.NIM)}`, { method: 'DELETE' }); loadMhs(); loadAll(); }
qs('#form-mhs').addEventListener('submit', async e => {
  e.preventDefault(); const f = e.target; const data = Object.fromEntries(new FormData(f));
  const exists = await fetch(api.mhs).then(r=>r.json()).then(rs=>rs.some(x=>x.NIM===data.NIM));
  if (exists) await fetch(`${api.mhs}/${encodeURIComponent(data.NIM)}`, { method: 'PUT', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(data) });
  else await fetch(api.mhs, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(data) });
  f.reset(); loadMhs(); loadAll();
});

// MK
async function loadMk(){ const rows = await fetch(api.mk).then(r=>r.json()); renderTable('#table-mk', ['KodeMatkul','NamaMatkul','SKS','Semester'], rows, fillMkForm, removeMk); }
function fillMkForm(r){ const f = qs('#form-mk'); f.KodeMatkul.value = r.KodeMatkul; f.NamaMatkul.value = r.NamaMatkul; f.SKS.value = r.SKS; f.Semester.value = r.Semester; }
async function removeMk(r){ if(!confirm('Delete MK '+r.KodeMatkul+'?')) return; await fetch(`${api.mk}/${encodeURIComponent(r.KodeMatkul)}`, { method: 'DELETE' }); loadMk(); loadAll(); }
qs('#form-mk').addEventListener('submit', async e => {
  e.preventDefault(); const f = e.target; const data = Object.fromEntries(new FormData(f));
  const exists = await fetch(api.mk).then(r=>r.json()).then(rs=>rs.some(x=>x.KodeMatkul===data.KodeMatkul));
  if (exists) await fetch(`${api.mk}/${encodeURIComponent(data.KodeMatkul)}`, { method: 'PUT', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(data) });
  else await fetch(api.mk, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(data) });
  f.reset(); loadMk(); loadAll();
});

// Dosen
async function loadDosen(){ const rows = await fetch(api.dosen).then(r=>r.json()); renderTable('#table-dosen', ['NIP','Nama','Alamat'], rows, fillDosenForm, removeDosen); }
function fillDosenForm(r){ const f = qs('#form-dosen'); f.NIP.value = r.NIP; f.Nama.value = r.Nama; f.Alamat.value = r.Alamat; }
async function removeDosen(r){ if(!confirm('Delete Dosen '+r.NIP+'?')) return; await fetch(`${api.dosen}/${encodeURIComponent(r.NIP)}`, { method: 'DELETE' }); loadDosen(); loadAll(); }
qs('#form-dosen').addEventListener('submit', async e => {
  e.preventDefault(); const f = e.target; const data = Object.fromEntries(new FormData(f));
  const exists = await fetch(api.dosen).then(r=>r.json()).then(rs=>rs.some(x=>x.NIP===data.NIP));
  if (exists) await fetch(`${api.dosen}/${encodeURIComponent(data.NIP)}`, { method: 'PUT', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(data) });
  else await fetch(api.dosen, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(data) });
  f.reset(); loadDosen(); loadAll();
});

// Kuliah
async function loadKuliah(){ const rows = await fetch(api.kuliah).then(r=>r.json()); renderTable('#table-kuliah', ['NIM','NamaMhs','NIP','NamaDosen','KodeMatkul','NamaMatkul','Nilai'], rows, fillKuliahForm, removeKuliah); }
function fillKuliahForm(r){ const f = qs('#form-kuliah'); f.NIM.value = r.NIM; f.NIP.value = r.NIP; f.KodeMatkul.value = r.KodeMatkul; f.Nilai.value = r.Nilai; }
async function removeKuliah(r){ if(!confirm('Delete Kuliah record?')) return; await fetch(`${api.kuliah}/${encodeURIComponent(r.NIM)}/${encodeURIComponent(r.NIP)}/${encodeURIComponent(r.KodeMatkul)}`, { method: 'DELETE' }); loadKuliah(); loadAll(); }
qs('#form-kuliah').addEventListener('submit', async e => {
  e.preventDefault(); const f = e.target; const data = Object.fromEntries(new FormData(f));
  const exists = await fetch(api.kuliah).then(r=>r.json()).then(rs=>rs.some(x=>x.NIM===data.NIM && x.NIP===data.NIP && x.KodeMatkul===data.KodeMatkul));
  if (exists) await fetch(`${api.kuliah}/${encodeURIComponent(data.NIM)}/${encodeURIComponent(data.NIP)}/${encodeURIComponent(data.KodeMatkul)}`, { method: 'PUT', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ Nilai: data.Nilai }) });
  else await fetch(api.kuliah, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(data) });
  f.reset(); loadKuliah(); loadAll();
});

// Initial loads
loadAll();
loadMhs();
loadMk();
loadDosen();
loadKuliah(); 