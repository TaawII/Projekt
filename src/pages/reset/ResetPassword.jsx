import React, { useState } from "react";
import "./resetPassword.scss";
import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import { sendPasswordResetEmail } from "firebase/auth"

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Wysłano link do zresetowania hasła na podany adres email.");
    } catch (error) {
      setError("Błąd podczas wysyłania linku resetującego hasło. Spróbuj ponownie.");
    }
  };

  return (
    <div className="reset-password">
      <form>
        <h2>Zresetuj hasło</h2>
        {error && <div className="errorReset">{error}</div>}
        {success && <div className="successReset">{success}</div>}
        <div className="formInput">
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Adres mailowy"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="button" onClick={handleResetPassword}>
          Zresetuj hasło
        </button>
        <div className="formLink">
          <Link to="/login" style={{ textDecoration: "none" }}>
            Wróć do logowania
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;