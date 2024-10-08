import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Button, Input } from "antd";
import { useNavigate } from "react-router-dom";

const Autentication: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { usuario, iniciarSesion } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (usuario) navigate("/");

    if (usuario?.rol === "admin") {
      navigate("/admin");
    }
  }, [usuario, navigate]);

  const manejarInicioSesion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await iniciarSesion(email, password);
    } catch (error) {
      console.error("Error al iniciar sesión:", (error as Error).message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form className="flex flex-col items-center justify-center p-4 rounded-md gap-6 min-w-[300px] min-h-[300px] shadow-custom bg-white">
        <div className="flex justify-center mb-3">
          <img src="/images/colombofrances_logo.jpeg" alt="" className="w-40" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-4 uppercase">
          Sistema De Reservas
        </h1>

        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
        />
        <Button onClick={manejarInicioSesion}>Iniciar sesión</Button>
      </form>
    </div>
  );
};

export default Autentication;
