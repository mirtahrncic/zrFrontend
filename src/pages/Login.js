import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const schema = yup.object().shape({
    email: yup
      .string()
      .email("Unesite ispravnu email adresu")
      .required("Email je obavezan"),
    password: yup
      .string()
      .min(4, "Lozinka mora imati barem 4 znaka")
      .required("Lozinka je obavezna"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [incorrectPassword, setIncorrectPassword] = useState(false);

  const onSubmit = async (data) => {
    console.log("OnSubmit called");
    try {
      console.log(data);
      const response = await axios.post(
        'http://localhost:3001/api/login/teacher', {
          email: data.email,
          password: data.password
        }
      );
      console.log(response.data?.token, response.data?.userId);
      localStorage.setItem("token", response.data?.token);
      localStorage.setItem("userId", response.data?.userId);
      localStorage.setItem("email", data.email);
      navigate("/teacherHome");
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.response) {
        setIncorrectPassword(true);
      }
    }
  };

  const navigate = useNavigate();
  const handleRegisterButtonClick = () => {
    navigate("/registration");
  };

  return (
    <div className="container">
      <div className="form-container2 sign-in">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className="logintxt">Dobro došli!</h1>
          <br></br>
          <span>Unesite svoj email i lozinku</span>
          <br></br>

          <input type="text" placeholder="Email..." {...register("email")} />
          {errors.email && (
            <p>{errors.email.message}</p>
          )}

          <p></p>

          <input
            type="password"
            placeholder="Lozinka..."
            {...register("password")}
          />
          {incorrectPassword && (
            <p style={{ color: "red" }}>Pogrešan email ili lozinka.</p>
          )}
          {errors.password && (
            <p>{errors.password.message}</p>
          )}
          <p></p>
          <button type="submit" id="register">Prijavi se</button>
          {/* <input type="submit"/> */}
        </form>
      </div>

      <div className="toggle-container2">
        <div className="toggle2">
          <div className="toggle-panel toggle-right">
            <h1 className="logintxt">Prvi puta?</h1>
            <p>Unesite svoje podatke<br></br> i napravite korisnički račun</p>
            <button id="register" onClick={handleRegisterButtonClick}>
              Registriraj se
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
