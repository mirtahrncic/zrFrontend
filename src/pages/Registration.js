import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Registration = () => {
  const schema = yup.object().shape({
    email: yup
      .string()
      .email("Unesite ispravnu email adresu")
      .required("Email je obavezan"),
    password: yup
      .string()
      .min(4, "Lozinka mora imati barem 4 znaka")
      .required("Lozinka je obavezna"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Lozinke se ne podudaraju")
      .required("Potvrda lozinke je obavezna"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  console.log(errors);

  const onSubmit = async (data) => {
    try {
      const registration = await axios.post(
        `https://dipl-project-backend.vercel.app/api/auth/registration?username=${data.email}&password=${data.password}`
      );
      navigate("/login");
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const navigate = useNavigate();
  const handleLoginButtonClick = () => {
    navigate("/login");
  };

  console.log("errors ", errors);

  return (
    <div className="container">
      <div className="form-container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <span>
            Unesite tražene podatke<br></br>i izradite korisnički račun
          </span>
          <br></br>
          <input type="text" placeholder="Email..." {...register("email")} />
          {errors.email ? (
            <p className="w-full text-red-500 !m-0">{errors.email.message}</p>
          ) : (
            <p className="w-full text-red-500 !m-0 opacity-0">
              Email je obavezan
            </p>
          )}

          <input
            type="password"
            placeholder="Lozinka.."
            {...register("password")}
          />
          {errors.password ? (
            <p className="w-full text-red-500 !m-0">
              {errors.password.message}
            </p>
          ) : (
            <p className="w-full text-red-500 !m-0 opacity-0">
              password je obavezannn
            </p>
          )}

          <input
            type="password"
            placeholder="Potvrda lozinke..."
            {...register("confirmPassword")}
          />
          {errors.confirmPassword ? (
            <p className="w-full text-red-500 !m-0">
              {errors.confirmPassword.message}
            </p>
          ) : (
            <p className="w-full text-red-500 !m-0 opacity-0">
              password je obavezannnnnnnnnnnn
            </p>
          )}

          <button type="submit">Registriraj se</button>
        </form>
      </div>

      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle left">
            <h1 class="text-4xl font-bold text-white-800">Dobrodošli natrag!</h1>
            <p>Prijavite se za korištenje svih mogućnosti</p>
            <button id="login" onClick={handleLoginButtonClick}>
              Prijavi se
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
