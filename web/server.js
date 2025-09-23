import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from './db.js';
import 'dotenv/config';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ===== Mhs =====
app.get('/api/mhs', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM Mhs ORDER BY NIM');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/mhs', async (req, res) => {
  const { NIM, Nama, Alamat } = req.body;
  if (!NIM || !Nama || !Alamat) return res.status(400).json({ error: 'NIM, Nama, Alamat required' });
  try {
    await query('INSERT INTO Mhs (NIM, Nama, Alamat) VALUES (?, ?, ?)', [NIM, Nama, Alamat]);
    res.status(201).json({ message: 'created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/mhs/:nim', async (req, res) => {
  const { nim } = req.params;
  const { Nama, Alamat } = req.body;
  try {
    await query('UPDATE Mhs SET Nama = ?, Alamat = ? WHERE NIM = ?', [Nama, Alamat, nim]);
    res.json({ message: 'updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/mhs/:nim', async (req, res) => {
  const { nim } = req.params;
  try {
    await query('DELETE FROM Kuliah WHERE NIM = ?', [nim]);
    await query('DELETE FROM Mhs WHERE NIM = ?', [nim]);
    res.json({ message: 'deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== MataKuliah =====
app.get('/api/mk', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM MataKuliah ORDER BY KodeMatkul');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/mk', async (req, res) => {
  const { KodeMatkul, NamaMatkul, SKS, Semester } = req.body;
  if (!KodeMatkul || !NamaMatkul || !SKS || !Semester) return res.status(400).json({ error: 'KodeMatkul, NamaMatkul, SKS, Semester required' });
  try {
    await query('INSERT INTO MataKuliah (KodeMatkul, NamaMatkul, SKS, Semester) VALUES (?, ?, ?, ?)', [KodeMatkul, NamaMatkul, SKS, Semester]);
    res.status(201).json({ message: 'created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/mk/:kode', async (req, res) => {
  const { kode } = req.params;
  const { NamaMatkul, SKS, Semester } = req.body;
  try {
    await query('UPDATE MataKuliah SET NamaMatkul = ?, SKS = ?, Semester = ? WHERE KodeMatkul = ?', [NamaMatkul, SKS, Semester, kode]);
    res.json({ message: 'updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/mk/:kode', async (req, res) => {
  const { kode } = req.params;
  try {
    await query('DELETE FROM Kuliah WHERE KodeMatkul = ?', [kode]);
    await query('DELETE FROM MataKuliah WHERE KodeMatkul = ?', [kode]);
    res.json({ message: 'deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Dosen =====
app.get('/api/dosen', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM Dosen ORDER BY NIP');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/dosen', async (req, res) => {
  const { NIP, Nama, Alamat } = req.body;
  if (!NIP || !Nama || !Alamat) return res.status(400).json({ error: 'NIP, Nama, Alamat required' });
  try {
    await query('INSERT INTO Dosen (NIP, Nama, Alamat) VALUES (?, ?, ?)', [NIP, Nama, Alamat]);
    res.status(201).json({ message: 'created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/dosen/:nip', async (req, res) => {
  const { nip } = req.params;
  const { Nama, Alamat } = req.body;
  try {
    await query('UPDATE Dosen SET Nama = ?, Alamat = ? WHERE NIP = ?', [Nama, Alamat, nip]);
    res.json({ message: 'updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/dosen/:nip', async (req, res) => {
  const { nip } = req.params;
  try {
    await query('DELETE FROM Kuliah WHERE NIP = ?', [nip]);
    await query('DELETE FROM Dosen WHERE NIP = ?', [nip]);
    res.json({ message: 'deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Kuliah (transaction) =====
app.get('/api/kuliah', async (req, res) => {
  try {
    const rows = await query(`
      SELECT k.NIM, mhs.Nama AS NamaMhs, k.NIP, d.Nama AS NamaDosen, k.KodeMatkul, mk.NamaMatkul, k.Nilai
      FROM Kuliah k
      JOIN Mhs mhs ON mhs.NIM = k.NIM
      JOIN Dosen d ON d.NIP = k.NIP
      JOIN MataKuliah mk ON mk.KodeMatkul = k.KodeMatkul
      ORDER BY k.NIM, k.KodeMatkul`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/kuliah', async (req, res) => {
  const { NIM, NIP, KodeMatkul, Nilai } = req.body;
  if (!NIM || !NIP || !KodeMatkul || !Nilai) return res.status(400).json({ error: 'NIM, NIP, KodeMatkul, Nilai required' });
  try {
    await query('INSERT INTO Kuliah (NIM, NIP, KodeMatkul, Nilai) VALUES (?, ?, ?, ?)', [NIM, NIP, KodeMatkul, Nilai]);
    res.status(201).json({ message: 'created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/kuliah/:nim/:nip/:kode', async (req, res) => {
  const { nim, nip, kode } = req.params;
  const { Nilai } = req.body;
  try {
    await query('UPDATE Kuliah SET Nilai = ? WHERE NIM = ? AND NIP = ? AND KodeMatkul = ?', [Nilai, nim, nip, kode]);
    res.json({ message: 'updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/kuliah/:nim/:nip/:kode', async (req, res) => {
  const { nim, nip, kode } = req.params;
  try {
    await query('DELETE FROM Kuliah WHERE NIM = ? AND NIP = ? AND KodeMatkul = ?', [nim, nip, kode]);
    res.json({ message: 'deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== All tables at once =====
app.get('/api/all', async (req, res) => {
  try {
    const [mhs, mk, dosen, kuliah] = await Promise.all([
      query('SELECT * FROM Mhs ORDER BY NIM'),
      query('SELECT * FROM MataKuliah ORDER BY KodeMatkul'),
      query('SELECT * FROM Dosen ORDER BY NIP'),
      query(`
        SELECT k.NIM, mhs.Nama AS NamaMhs, k.NIP, d.Nama AS NamaDosen, k.KodeMatkul, mk.NamaMatkul, k.Nilai
        FROM Kuliah k
        JOIN Mhs mhs ON mhs.NIM = k.NIM
        JOIN Dosen d ON d.NIP = k.NIP
        JOIN MataKuliah mk ON mk.KodeMatkul = k.KodeMatkul
        ORDER BY k.NIM, k.KodeMatkul`)
    ]);
    res.json({ mhs, mk, dosen, kuliah });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fallback to frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 