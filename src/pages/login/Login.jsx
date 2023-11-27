import React, { useContext, useState, useEffect } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "./../../context/AuthContext";

const Login = () => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [toggleEye, setToggleEye] = useState(false);
  const [inputType, setInputType] = useState("password");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  useEffect(() => {
    const checkUser = () => {
      const user = auth.currentUser;
      if (user) {
        console.log("Zalogowano pomyślnie");
        dispatch({ type: "LOGIN_SUCCESS", payload: user });
        navigate("/");
      }
    };

    checkUser();
  }, [dispatch, navigate]);

  const handleToggle = (e) => {
    setToggleEye(!toggleEye);
    setInputType(inputType === "password" ? "text" : "password");
  };

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        inputs.email,
        inputs.password
      );
      // Zalogowano pomyślnie
      const user = userCredential.user;
      dispatch({ type: "LOGIN_SUCCESS", payload: user });
    } catch (error) {
      setError("Błędny email lub hasło. Spróbuj ponownie.");
      dispatch({ type: "LOGIN_FAILURE" });
    }
  };

  return (
    <div className="login">
      <form>
        <h2>Logowanie</h2>
        {error && <div className="errorLogin">{error}</div>}
        <div className="formInput">
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Adres mailowy"
            onChange={handleChange}
            required
          />
        </div>
        <div className="formInput">
          <input
            type={inputType}
            name="password"
            id="password"
            placeholder="Hasło"
            onChange={handleChange}
            required
          />
          <div className="eyeIcon" onClick={handleToggle}>
            {toggleEye ? <Visibility /> : <VisibilityOff />}
          </div>
        </div>
        <button type="submit" onClick={handleLogin}>
          Zaloguj
        </button>

        <div className="formLink">
          <span>Nie masz konta? </span>
          <Link
            to="/register"
            className="formSignup"
            style={{ textDecoration: "none" }}
          >
            {" "}
            Zarejestruj się.
          </Link>
        </div>

        <div className="formLink">
          <Link to="/reset" style={{ textDecoration: "none" }}>
            Zapomniałeś hasła? Zresetuj je tutaj.
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;