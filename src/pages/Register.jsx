import React from "react";

function Register() {
  return (
    <div className="container text-center mt-5">
      <h3 className="mb-4 fw-semibold">Create Account</h3>
      <form className="mx-auto" style={{ maxWidth: "400px" }}>
        <input type="text" className="form-control mb-3" placeholder="Full Name" />
        <input type="email" className="form-control mb-3" placeholder="Email" />
        <input type="password" className="form-control mb-3" placeholder="Password" />
        <button className="btn btn-success w-100 mb-3">Register</button>
        <p>Already have an account? <a href="/login">Login</a></p>
      </form>
    </div>
  );
}

export default Register;
