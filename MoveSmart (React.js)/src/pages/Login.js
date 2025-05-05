import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import "../Assets/Styles/Login.css";

const Login = () => {
  const [nationalNo, setNationalId] = useState("");
  const [password, setPassword] = useState("");
  const [idError, setIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = async (e) => {
    e.preventDefault();
    setServerError("");
    setIdError("");
    setPasswordError("");

    let isValid = true;

    if (nationalNo.trim() === "" || nationalNo.length !== 14) {
      setIdError("الرجاء إدخال الرقم القومي بشكل صحيح (14 رقمًا)");
      isValid = false;
    }

    if (password.length < 6) {
      setPasswordError("الرجاء إدخال كلمة مرور لا تقل عن 6 أحرف");
      isValid = false;
    }

    if (!isValid) return;

    setIsLoading(true);

    try {
      const result = await authService.login(nationalNo, password);
      
      if (result.success) {
        console.log("تم تسجيل الدخول بنجاح:", result.data);
        
        // التوجيه حسب الدور
        switch(result.data.role) {
          case 0:
            navigate("/role0");
            break;
          case 1:
            navigate("/role1");
            break;
          case 2:
            navigate("/role2");
            break;
          default:
            navigate("/");
        }
      } else {
        setServerError(result.error);
      }
    } catch (error) {
      setServerError(error.message || "حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bodylog">
      <div className="login-container">
        <div className="login-header">تسجيل الدخول</div>
        <div className="login-subheader">مرحبا</div>
        <div className="login-description">
          الرجاء إدخال بيانات الاعتماد الخاصة بك
        </div>

        <form className="login-form" onSubmit={validateForm}>
          <input
            type="text"
            value={nationalNo}
            onChange={(e) => setNationalId(e.target.value)}
            className="login-input"
            placeholder="الرقم القومي (14 رقمًا)"
            required
            maxLength="14"
          />
          {idError && (
            <div className="error-message">
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
            minLength="6"
          />
          {passwordError && (
            <div className="error-message">
              {passwordError}
            </div>
          )}

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>

          {serverError && <div className="error-message">{serverError}</div>}
        </form>
      </div>
    </div>
  );
};

export default Login;