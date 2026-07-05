import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
// import { registerUser } from "../../redux/reducer/authSlice";
import "./Register.scss";

// NOTE: This assumes an authSlice with an async thunk
// `registerUser({ name, email, password })`. Adjust the import path
// to match wherever authSlice actually lives in the project.

const get_password_strength = (password) => {
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { label: "Weak", percent: 25, className: "strength--weak" };
  if (score <= 3) return { label: "Medium", percent: 60, className: "strength--medium" };
  return { label: "Strong", percent: 100, className: "strength--strong" };
};

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error: authError } = useSelector((state) => state.auth || {});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const strength = get_password_strength(formData.password);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }
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
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
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
    //   const { name, email, password } = formData;
    //   const result = await dispatch(registerUser({ name, email, password })).unwrap();
    //   if (result) {
    //     navigate("/login");
    //   }
    // } catch (err) {
    //   // authError from the slice already surfaces the message in the UI
    // }
  };

  return (
    <div className="register_page">
      <div className="register_card">
        <div className="register_header">
          <h1 className="register_title">Create Your Account</h1>
          <p className="register_subtitle">Join eStore and start shopping today</p>
        </div>

        {authError && (
          <div className="register_alert" role="alert">
            {authError}
          </div>
        )}

        <form className="register_form" onSubmit={handle_submit} noValidate>
          <div className="form_group">
            <label htmlFor="name" className="form_label">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className={`form_input ${errors.name ? "form_input--error" : ""}`}
              placeholder="Jane Doe"
              value={formData.name}
              onChange={handle_change}
              autoComplete="name"
            />
            {errors.name && <span className="form_error">{errors.name}</span>}
          </div>

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
                placeholder="Create a password"
                value={formData.password}
                onChange={handle_change}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password_toggle"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {formData.password && (
              <div className="strength_meter">
                <div className={`strength_bar ${strength.className}`} style={{ width: `${strength.percent}%` }} />
                <span className="strength_label">{strength.label}</span>
              </div>
            )}
            {errors.password && <span className="form_error">{errors.password}</span>}
          </div>

          <div className="form_group">
            <label htmlFor="confirmPassword" className="form_label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              className={`form_input ${errors.confirmPassword ? "form_input--error" : ""}`}
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handle_change}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <span className="form_error">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="btn_primary" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="register_footer">
          Already have an account?{" "}
          <Link to="/login" className="form_link form_link--accent">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
