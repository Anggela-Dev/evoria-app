import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../utils/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // simulasi login sukses
    if (email && password) {
      loginUser({ email });
      navigate("/");
    } else {
      alert("Please enter email and password!");
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-primary w-100 mb-3">Login</button>
        <p>Don’t have an account? <a href="/register">Register</a></p>
      </form>
    </div>
  );
}

export default Login;
