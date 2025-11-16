import React, { useState } from "react";

function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student", // default role
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
    <div className="container text-center mt-5">
      <h3 className="mb-4 fw-semibold">Create Account</h3>
      <form className="mx-auto" style={{ maxWidth: "400px" }} onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          className="form-control mb-3"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          className="form-control mb-3"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          className="form-control mb-3"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        {/* 🔹 Tambahkan dropdown role */}
        <select
          name="role"
          className="form-select mb-3"
          value={form.role}
          onChange={handleChange}
        >
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>

        <button className="btn btn-success w-100 mb-3">Register</button>
        {message && <p className="text-center mt-2">{message}</p>}
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}

export default Register;
