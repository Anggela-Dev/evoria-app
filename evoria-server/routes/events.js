import express from "express";
import db from "../db.js";
import QRCode from "qrcode";

const router = express.Router();

/**
 * Middleware ambil adminId dari header
 * (digunakan untuk routes ADMIN saja)
 */
const getAdminId = (req, res, next) => {
  const adminId = req.headers["x-admin-id"];

  if (!adminId) {
    return res.status(400).json({ message: "Admin ID tidak ditemukan." });
  }

  req.adminId = adminId;
  next();
};

/* ============================================================
   🔹 ROUTE UNTUK STUDENT (TANPA ADMIN ID)
   ============================================================ */
// Ambil semua event untuk student (publik)
router.get("/public/all", (req, res) => {
  const sql = `
    SELECT id, title, description, location, date, capacity,token
    FROM events 
    ORDER BY date ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error mengambil event publik:", err);
      return res
        .status(500)
        .json({ message: "Gagal mengambil event publik" });
    }

    res.json(results);
  });
});
/* ============================================================
   🔹 ROUTE UNTUK STUDENT (TANPA ADMIN ID)
============================================================ */

// ⬇️ TAMBAHKAN INI DI BAWAH "/public/all"
router.get("/myevents/:userId", (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT events.*
    FROM events
    JOIN attendance ON events.id = attendance.event_id
    WHERE attendance.user_id = ?
    GROUP BY events.id
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("❌ Error mengambil my events:", err);
      return res.status(500).json({ message: "Gagal mengambil data my events" });
    }

    res.json(results);
  });
});

/* ============================================================
   🔹 ROUTE KHUSUS ADMIN
   ============================================================ */

// Ambil semua event berdasarkan admin yg login
router.get("/", getAdminId, (req, res) => {
  const adminId = req.adminId;

  const sql = `
    SELECT * FROM events
    WHERE created_by = ?
    ORDER BY date ASC
  `;

  db.query(sql, [adminId], (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Gagal mengambil data event" });

    res.json(results);
  });
});
// 📌 Public Get Event Detail (tanpa adminId)
router.get("/public/event/:id", (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT id, title, description, location, date, start_time, end_time, capacity
    FROM events
    WHERE id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("❌ Error mengambil detail event publik:", err);
      return res.status(500).json({ message: "Gagal mengambil detail event" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Event tidak ditemukan" });
    }

    res.json(results[0]);
  });
});

// Ambil detail event berdasarkan ID (hanya jika milik admin)
router.get("/:id", getAdminId, (req, res) => {
  const { id } = req.params;
  const adminId = req.adminId;

  const sql = `
    SELECT * FROM events
    WHERE id = ? AND created_by = ?
  `;

  db.query(sql, [id, adminId], (err, results) => {
    if (err) {
      console.error("❌ Error mengambil detail event:", err);
      return res
        .status(500)
        .json({ message: "Gagal mengambil detail event" });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Event tidak ditemukan atau bukan milik kamu",
      });
    }

    res.json(results[0]);
  });
});

// Tambah event baru
// Tambah event baru (dengan token & waktu)
router.post("/", getAdminId, (req, res) => {
  const adminId = req.adminId;
  const {
    title,
    description,
    location,
    date,
    capacity,
    start_time,
    end_time,
  } = req.body;

  // Generate token unik untuk QR
  const token = Math.random().toString(36).substring(2, 10);

  const sql = `
    INSERT INTO events (
      title, description, location, date, capacity, created_by,
      start_time, end_time, token
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      title,
      description,
      location,
      date,
      capacity,
      adminId,
      start_time || null,
      end_time || null,
      token,
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Error tambah event:", err);
        return res.status(500).json({ message: "Gagal menambahkan event" });
      }

      res.json({
        message: "✅ Event berhasil ditambahkan!",
        event_id: result.insertId,
        token: token,
      });
    }
  );
});


// Update event (khusus admin)
router.put("/:id", getAdminId, (req, res) => {
  const { id } = req.params;
  const adminId = req.adminId;
  const { title, description, location, date, capacity } = req.body;

  const sql = `
    UPDATE events
    SET title=?, description=?, location=?, date=?, capacity=?
    WHERE id=? AND created_by=?
  `;

  db.query(
    sql,
    [title, description, location, date, capacity, id, adminId],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Gagal mengubah event" });

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Event tidak ditemukan atau bukan milik kamu",
        });
      }

      res.json({ message: "✏️ Event berhasil diperbarui!" });
    }
  );
});

// Hapus event (khusus admin)
router.delete("/:id", getAdminId, (req, res) => {
  const { id } = req.params;
  const adminId = req.adminId;

  const sql = `
    DELETE FROM events
    WHERE id = ? AND created_by = ?
  `;

  db.query(sql, [id, adminId], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Gagal menghapus event" });

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Event tidak ditemukan atau bukan milik kamu",
      });
    }

    res.json({ message: "🗑️ Event berhasil dihapus!" });
  });
});

router.get("/qr/:id", async (req, res) => {
  const event_id = req.params.id;

  const payload = {
    event_id: Number(event_id)
  };

  try {
    const qrDataURL = await QRCode.toDataURL(JSON.stringify(payload));
    res.json({ qr: qrDataURL });
  } catch (err) {
    res.status(500).json({ error: "Gagal generate QR" });
  }
});


export default router;
