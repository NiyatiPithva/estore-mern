import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";

// import { loginUser } from "../../../Redux/reducer/authSlice";
import "./Login.scss";

// NOTE: This assumes an authSlice with an async thunk `loginUser({ email, password })`
// that resolves on success and stores `token` / `user` in state.auth.
// Adjust the import path above if your authSlice lives elsewhere.

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error: authError } = useSelector((state) => state.auth || {});

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handle_change = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handle_submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // try {
    //   // const result = await dispatch(loginUser(formData)).unwrap();
    //   // if (result) {
    //   //   const redirectTo = location.state?.from || "/";
    //   //   navigate(redirectTo);
    //   }
    // } catch (err) {
    //   // authError from the slice will already surface below; this catch
    //   // just prevents an unhandled rejection in the console.
    // }
  };

  return (
    <div className="login_page">
      <div className="login_card">
        <div className="login_header">
          <h1 className="login_title">Welcome Back</h1>
          <p className="login_subtitle">Log in to continue shopping at eStore</p>
        </div>

        {authError && (
          <div className="login_alert" role="alert">
            {authError}
          </div>
        )}

        <form className="login_form" onSubmit={handle_submit} noValidate>
          <div className="form_group">
            <label htmlFor="email" className="form_label">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={`form_input ${errors.email ? "form_input--error" : ""}`}
              placeholder="you@example.com"
              value={formData.email}
              onChange={handle_change}
              autoComplete="email"
            />
            {errors.email && <span className="form_error">{errors.email}</span>}
          </div>

          <div className="form_group">
            <label htmlFor="password" className="form_label">
              Password
            </label>
            <div className="password_wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className={`form_input ${errors.password ? "form_input--error" : ""}`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handle_change}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password_toggle"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <span className="form_error">{errors.password}</span>}
          </div>

          <div className="form_meta">
            <Link to="/forgot-password" className="form_link">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="btn_primary" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="login_footer">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="form_link form_link--accent">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
