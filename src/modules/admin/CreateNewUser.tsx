import React, { useEffect, useState } from "react";
import { Button, Input } from "antd";
import { useAuth } from "../../hooks/useAuth";
import { toast, ToastContainer } from "react-toastify";

const CreateNewUser: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [nombre, setNombre] = useState<string>("");
  const [materia, setMateria] = useState<string>("");
  const { registrar } = useAuth();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (email && password && nombre && materia) {
      setIsDisabled(false);
    }
  }, [email, password, nombre, materia]);

  const manejarRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "" || password === "" || nombre === "" || materia === "") {
      toast.error("¡Todos los campos son requeridos!");
      setIsDisabled(true);
      return;
    }
    try {
      await registrar(email, password, nombre, materia);
      toast.success("¡Usuario creado exitosamente!");
      setNombre("");
      setMateria("");
      setEmail("");
      setPassword("");
    } catch (error) {
      toast.error("¡Error al crear el usuario!");
      console.error("Error al iniciar sesión:", (error as Error).message);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <ToastContainer />
      <div className="flex w-full justify-center ">
        <form className="flex flex-col gap-4 w-full lg:w-1/2 shadow-custom p-8 rounded-lg bg-white">
          <h1 className="text-2xl font-bold text-center mb-4 uppercase">
            Crear Nuevo Usuario
          </h1>
          <Input
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <Input
            placeholder="Materia"
            value={materia}
            onChange={(e) => setMateria(e.target.value)}
          />
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
          <div className="flex justify-center">
            <Button
              color="primary"
              type="primary"
              onClick={manejarRegistro}
              disabled={isDisabled}
            >
              Registrar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNewUser;
