import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/register", { ...form, role: "user" });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <h1>Join ShopEase</h1>
        <p>Create your account and start shopping with secure checkout.</p>
        <Link to="/">← Back to Home</Link>
      </div>

      <form className="auth-box" onSubmit={handleRegister}>
        <h2>Create Account</h2>
        <p>Register to continue shopping</p>

        <label>Full Name</label>
        <input
          type="text"
          name="name"
          placeholder="Sandeep Kumar"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label>Email Address</label>
        <input
          type="email"
          name="email"
          placeholder="example@gmail.com"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Create password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Create Account</button>

        <span>
          Already registered? <Link to="/login">Login</Link>
        </span>
      </form>
    </div>
  );
}

export default Register;