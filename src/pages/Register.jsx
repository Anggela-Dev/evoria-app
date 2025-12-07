import React, { useState } from "react";
import EvoriaLogo from "../Evoria.png"; // logo app

function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setMessage(data.message || "Berhasil mendaftar!");
    } catch (error) {
      setMessage("Terjadi kesalahan server.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #eef2f3, #e3e8ef)",
        padding: "20px",
      }}
    >
      <div
        className="p-4 shadow-lg"
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
        {/* Logo */}
        <div className="text-center mb-3">
          <img
            src={EvoriaLogo}
            alt="Evoria"
            style={{ width: "180px", userSelect: "none" }}
          />
        </div>

        <h4 className="fw-semibold text-center mb-3">Create Account</h4>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            className="form-control mb-3"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            style={{
              height: "48px",
              borderRadius: "12px",
              border: "1px solid #d0d7e2",
              transition: ".2s",
            }}
            onFocus={(e) => (e.target.style.border = "1px solid #0d6efd")}
            onBlur={(e) => (e.target.style.border = "1px solid #d0d7e2")}
          />

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
              transition: ".2s",
            }}
            onFocus={(e) => (e.target.style.border = "1px solid #0d6efd")}
            onBlur={(e) => (e.target.style.border = "1px solid #d0d7e2")}
          />

          <input
            type="password"
            name="password"
            className="form-control mb-3"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={{
              height: "48px",
              borderRadius: "12px",
              border: "1px solid #d0d7e2",
              transition: ".2s",
            }}
            onFocus={(e) => (e.target.style.border = "1px solid #0d6efd")}
            onBlur={(e) => (e.target.style.border = "1px solid #d0d7e2")}
          />

          {/* Role */}
          <select
            name="role"
            className="form-select mb-3"
            value={form.role}
            onChange={handleChange}
            style={{
              height: "48px",
              borderRadius: "12px",
              border: "1px solid #d0d7e2",
            }}
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>

          <button
              className="w-100 mb-3 gradient-btn"
              style={{
                height: "48px",
                borderRadius: "12px",
                fontWeight: "600",
                letterSpacing: "0.3px",
                border: "none",
                color: "white",
              }}
            >
              Register
            </button>


          {message && <p className="text-center text-danger">{message}</p>}

          <p className="text-center text-muted mt-3">
            Already have an account?{" "}
            <a href="/login" className="text-primary fw-semibold">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;

/* CSS Animation */
const style = document.createElement("style");
style.innerHTML = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.gradient-btn {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6); /* biru ke ungu */
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
  transition: 0.25s ease;
  color: white;
}

.gradient-btn:hover {
  background: linear-gradient(135deg, #2563eb, #7c3aed); /* biru lebih tegas */
  box-shadow: 0 6px 16px rgba(124, 58, 237, 0.55);
  transform: translateY(-2px);
}

.gradient-btn:active {
  transform: scale(0.97);
  box-shadow: 0 3px 10px rgba(124, 58, 237, 0.35);
}
`;

document.head.appendChild(style);

