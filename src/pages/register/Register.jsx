import React, { useContext, useState } from "react";
import FormInput from "../../components/formInput/FormInput";
import { Link, useNavigate } from "react-router-dom";
import "./register.scss";
import { auth } from "../../firebase";
import { updateProfile, createUserWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../../context/AuthContext";

const Register = () => {
  const { dispatch } = useContext(AuthContext);
  const [inputValues, setInputValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    dateOfBirth: "",
  });
  const navigate = useNavigate();
  const inputs = [
    {
      id: 1,
      name: "username",
      type: "text",
      placeholder: "Nazwa użytkownika",
      errorMessage:
        "Nazwa użytkownika powinna zawierać od 3 do 16 znaków i nie może zawierać znaków specjalnych!",
      pattern: "^[A-Za-z0-9]{3,16}$",
      required: true,
    },
    {
      id: 2,
      name: "email",
      type: "email",
      placeholder: "Adres mailowy",
      errorMessage: "Podaj prawidłowy adres mailowy w formacie: nazwa@domena.pl.",
      required: true,
    },
    {
      id: 3,
      name: "password",
      type: "text",
      placeholder: "Hasło",
      errorMessage:
        "Hasło powinno składać się od 8 do 20 znaków i zawierać przynajmniej jedną dużą literę, cyfrę oraz znak specjalny.",
      pattern: `(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+])[A-Za-z0-9!@#$%^&*()_+]{8,20}$`,
      required: true,
    },
    {
      id: 4,
      name: "confirmPassword",
      type: "text",
      placeholder: "Potwierdź hasło",
      errorMessage: "Hasła nie są takie same!",
      pattern: inputValues.password,
      required: true,
    },
    {
      id: 5,
      name: "phoneNumber",
      type: "text",
      placeholder: "Numer telefonu",
      required: false,
    },
    {
      id: 6,
      name: "dateOfBirth",
      type: "date",
      placeholder: "Data urodzenia",
      required: true,
    },
  ];

  const handleChange = (e) => {
    setInputValues({ ...inputValues, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(
        auth,
        inputValues.email,
        inputValues.password
      ).then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        updateProfile(user, {
          displayName: inputValues.username,
        });
        navigate("/login");
      });
    } catch (error) {
      // Obsłuż błąd rejestracji
    }
  };

  return (
    <div className="register">
      <form>
        <h2>Rejestracja</h2>
        {inputs.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={inputValues[input.name]}
            onChange={handleChange}
          />
        ))}
        <button type="submit" onClick={handleRegister}>
          Zarejestruj
        </button>

        <div className="formLink">
          <span>Masz już konto? </span>
          <Link
            to="/login"
            className="formSignup"
            style={{ textDecoration: "none" }}
          >
            {" "}
            Zaloguj się
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
