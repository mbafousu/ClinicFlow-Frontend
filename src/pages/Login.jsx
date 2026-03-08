import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.userId.trim() || !formData.password.trim()) {
      setError("Please enter your User ID and Password.");
      return;
    }

    localStorage.setItem("token", "clinicflow-demo-token");
    localStorage.setItem(
      "user",
      JSON.stringify({ userId: formData.userId })
    );

    navigate("/");
  };

  return (
    <div className="login-page">
      <div className="login-bg-overlay"></div>

      <div className="login-card">
        <div className="login-brand">
          <div className="brand-mark">CF</div>
          <div>
            <h1>ClinicFlow</h1>
            <p>Clinical Access Portal</p>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="userId">User ID</label>
          <input
            id="userId"
            type="text"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            placeholder="Enter your user ID"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />

          {error && <p className="login-error">{error}</p>}

          <button type="submit">Login</button>
        </form>

        <p className="forgot-link">Forgot your password?</p>

        <div className="login-footer">
          <p>Training Environment</p>
          <p>© 2026 ClinicFlow Healthcare Systems</p>
        </div>
      </div>
    </div>
  );
}