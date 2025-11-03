import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root", // ganti sesuai MySQL kamu
  password: "AnggelaMySQL88", // ganti kalau ada password
  database: "evoria_db",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL database");
  }
});

export default db; // ⚠️ ini penting banget
