-- Create database
DROP DATABASE IF EXISTS Perkuliahan;
CREATE DATABASE Perkuliahan
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE Perkuliahan;

-- Table 1: Mhs (Mahasiswa)
DROP TABLE IF EXISTS Mhs;
CREATE TABLE Mhs (
  NIM        VARCHAR(15)  NOT NULL,
  Nama       VARCHAR(100) NOT NULL,
  Alamat     VARCHAR(200) NOT NULL,
  PRIMARY KEY (NIM)
) ENGINE=InnoDB;

-- Table 2: MataKuliah
DROP TABLE IF EXISTS MataKuliah;
CREATE TABLE MataKuliah (
  KodeMatkul VARCHAR(10)  NOT NULL,
  NamaMatkul VARCHAR(120) NOT NULL,
  SKS        TINYINT UNSIGNED NOT NULL CHECK (SKS BETWEEN 1 AND 24),
  Semester   TINYINT UNSIGNED NOT NULL CHECK (Semester BETWEEN 1 AND 14),
  PRIMARY KEY (KodeMatkul)
) ENGINE=InnoDB;

-- Table 3: Dosen
DROP TABLE IF EXISTS Dosen;
CREATE TABLE Dosen (
  NIP    VARCHAR(20)  NOT NULL,
  Nama   VARCHAR(100) NOT NULL,
  Alamat VARCHAR(200) NOT NULL,
  PRIMARY KEY (NIP)
) ENGINE=InnoDB;

-- Transaksi: Kuliah (menghubungkan Mhs, Dosen, MataKuliah)
DROP TABLE IF EXISTS Kuliah;
CREATE TABLE Kuliah (
  NIM        VARCHAR(15)  NOT NULL,
  NIP        VARCHAR(20)  NOT NULL,
  KodeMatkul VARCHAR(10)  NOT NULL,
  Nilai      ENUM('A','AB','B','BC','C','D','E') NOT NULL,
  PRIMARY KEY (NIM, NIP, KodeMatkul),
  CONSTRAINT fk_kuliah_mhs
    FOREIGN KEY (NIM) REFERENCES Mhs(NIM)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_kuliah_dosen
    FOREIGN KEY (NIP) REFERENCES Dosen(NIP)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_kuliah_mk
    FOREIGN KEY (KodeMatkul) REFERENCES MataKuliah(KodeMatkul)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Insert 5 records each

-- Mhs
INSERT INTO Mhs (NIM, Nama, Alamat) VALUES
('2310001', 'Andi Pratama', 'Jl. Merpati No. 12, Bandung'),
('2310002', 'Budi Santoso', 'Jl. Kenanga No. 3, Depok'),
('2310003', 'Citra Lestari', 'Jl. Anggrek No. 45, Yogyakarta'),
('2310004', 'Dewi Kusuma', 'Jl. Melati No. 7, Surabaya'),
('2310005', 'Eko Nugroho', 'Jl. Cemara No. 9, Semarang');

-- MataKuliah
INSERT INTO MataKuliah (KodeMatkul, NamaMatkul, SKS, Semester) VALUES
('IF101', 'Pengantar Informatika', 3, 1),
('IF102', 'Algoritma dan Pemrograman', 4, 1),
('IF201', 'Struktur Data', 3, 3),
('IF202', 'Basis Data', 3, 3),
('IF301', 'Jaringan Komputer', 3, 5);

-- Dosen
INSERT INTO Dosen (NIP, Nama, Alamat) VALUES
('19780101-001', 'Dr. Rina Wulandari', 'Jl. Cendana No. 10, Bandung'),
('19790512-002', 'Ir. Agus Setiawan, M.Kom', 'Jl. Dahlia No. 21, Bandung'),
('19810323-003', 'Dr. Siti Nuraini', 'Jl. Teratai No. 5, Jakarta'),
('19851211-004', 'M. Fajar Ramadhan, M.T.', 'Jl. Kamboja No. 8, Surabaya'),
('19891130-005', 'Dra. Tika Maharani', 'Jl. Flamboyan No. 14, Malang');

-- Kuliah (kombinasi NIM, NIP, KodeMatkul) + Nilai
INSERT INTO Kuliah (NIM, NIP, KodeMatkul, Nilai) VALUES
('2310001', '19780101-001', 'IF101', 'A'),
('2310002', '19790512-002', 'IF102', 'AB'),
('2310003', '19810323-003', 'IF201', 'B'),
('2310004', '19851211-004', 'IF202', 'AB'),
('2310005', '19891130-005', 'IF301', 'B');

-- Optional: contoh query untuk melihat isi tabel
-- SELECT * FROM Mhs;
-- SELECT * FROM MataKuliah;
-- SELECT * FROM Dosen;
-- SELECT * FROM Kuliah; 