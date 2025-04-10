import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import "../Assets/Styles/Login.css";

const Login = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [idError, setIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  // static data until get api from {الفلاحين}
  const staticUser = {
    id: "12345678901234",
    password: "password123",
  };

  const validateForm = async (e) => {
    e.preventDefault();
    setServerError("");

    let isValid = true;

    if (id.trim() === "" || id.length !== 14) {
      setIdError("الرجاء إدخال الرقم القومي بشكل صحيح");
      isValid = false;
    } else {
      setIdError("");
    }

    if (password.length < 6) {
      setPasswordError("الرجاء إدخال كلمة مرور لا تقل عن 6 أحرف");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!isValid) return;

    //pls sir, don't forget del this after get api
    if (id === staticUser.id && password === staticUser.password) {
      console.log("تم تسجيل الدخول  ");
      navigate("/dashboard");
      return;
    }

    try {
      const userData = await loginUser(id, password);
      console.log("تم تسجيل الدخول بنجاح (من API):", userData);
      navigate("/dashboard");
    } catch (error) {
      setServerError(error.message || "فشل تسجيل الدخول ❌");
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">تسجيل الدخول</div>
      <div className="login-subheader">مرحبا</div>
      <div className="login-description">
        الرجاء إدخال بيانات الاعتماد الخاصة بك
      </div>

      <form className="login-form" onSubmit={validateForm}>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="login-input"
          placeholder="الرقم القومي"
          required
        />
        {idError && (
          <div
            className="error-message"
            style={{ visibility: idError ? "visible" : "hidden" }}
          >
            {idError}
          </div>
        )}

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          placeholder="كلمة المرور"
          required
        />
        {passwordError && (
          <div
            className="error-message"
            style={{ visibility: passwordError ? "visible" : "hidden" }}
          >
            {passwordError}
          </div>
        )}

        <button type="submit" className="login-button">
          تسجيل الدخول
        </button>

        {serverError && <div className="error-message">{serverError}</div>}
      </form>
    </div>
  );
};

export default Login;
