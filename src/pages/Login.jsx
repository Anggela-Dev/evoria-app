import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.type]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json(); // ✅ definisikan data di sini

      if (data.success) {
  localStorage.setItem("user", JSON.stringify(data.user));
  if (data.user.role === "admin") {
    navigate("/admin");
  } else {
    navigate("/");
  }
}

    } catch (err) {
      console.error(err);
      setMessage("Terjadi kesalahan server");
    }
  };

  return (
    <div className="container text-center mt-5">
      <h3 className="mb-4 fw-semibold">Login to Evoria</h3>
      <form className="mx-auto" style={{ maxWidth: "400px" }} onSubmit={handleLogin}>
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <button className="btn btn-primary w-100 mb-3">Login</button>
        {message && <p className="text-danger">{message}</p>}
        <p>
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </form>
    </div>
  );
}

export default Login;
