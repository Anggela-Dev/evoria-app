import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FullLogo from "../FullLogo.png"; // Splash logo
import AppName from "../Evoria.png"; // Nama app

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000); // 2 DETIK
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("user_id", data.user.id);

        if (data.user.role === "admin") navigate("/admin");
        else navigate("/");
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage("Terjadi kesalahan server");
    }
  };

  // ========= SPLASH SCREEN =========
if (showSplash) {
  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "white",
      }}
    >
      <img
        src={FullLogo}
        alt="Evoria"
        style={{
          width: "138%",
          maxWidth: "800px",
          opacity: 0,
          animation: "fadeInStay 2s ease forwards", // muncul dan stay selama splash
          userSelect: "none",
        }}
      />
    </div>
  );
}


  // ========= LOGIN PAGE =========
  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #eef2f3, #e3e8ef)",
        padding: "20px",
      }}
    >
      <div
        className="p-5 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "380px",
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.75)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          animation: "fadeIn 0.6s ease",
        }}
      >
        {/* GANTI TEXT JADI GAMBAR */}
        <img
          src={AppName}
          alt="Evoria Name"
          style={{
            width: "160px",
            marginBottom: "18px",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            animation: "fadeIn 0.8s ease",
          }}
        />

        <p className="text-muted text-center mb-4">Login to continue</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            className="form-control mb-3"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={{
              height: "48px",
              borderRadius: "12px",
              border: "1px solid #d0d7e2",
              transition: "0.2s",
            }}
            onFocus={(e) => (e.target.style.border = "1px solid #0d6efd")}
            onBlur={(e) => (e.target.style.border = "1px solid #d0d7e2")}
          />

          <input
            type="password"
            name="password"
            className="form-control mb-4"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={{
              height: "48px",
              borderRadius: "12px",
              border: "1px solid #d0d7e2",
              transition: "0.2s",
            }}
            onFocus={(e) => (e.target.style.border = "1px solid #0d6efd")}
            onBlur={(e) => (e.target.style.border = "1px solid #d0d7e2")}
          />

          <button
            type="submit"
            className="w-100 mb-3"
            style={{
              height: "48px",
              borderRadius: "12px",
              fontWeight: "600",
              letterSpacing: "0.3px",
              color: "white",
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", // biru ke ungu
              border: "none",
              boxShadow: "0 4px 12px rgba(139,92,246,0.4)",
              transition: "0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "linear-gradient(135deg, #2563eb, #7c3aed)";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 16px rgba(124,58,237,0.55)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "linear-gradient(135deg, #3b82f6, #8b5cf6)";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(139,92,246,0.4)";
            }}
          >
            Login
          </button>


          {message && (
            <p className="text-danger text-center mb-3">{message}</p>
          )}

          <p className="text-center text-muted">
            Don’t have an account?{" "}
            <a href="/register" className="text-primary fw-semibold">
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;

/* ========== ANIMASI CSS ========== */
const style = document.createElement("style");
style.innerHTML = `
@keyframes fadeInStay {
  0% { opacity: 0; transform: translateY(10px); }
  30% { opacity: 1; transform: translateY(0); }
  100% { opacity: 1; transform: translateY(0); } /* STAY sampai splash selesai */
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
`;
document.head.appendChild(style);

