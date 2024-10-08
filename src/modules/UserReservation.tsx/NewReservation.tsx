import { useEffect, useState } from "react";
import { Button, DatePicker, Input, TimePicker } from "antd";
import { useReservas } from "../../hooks/useReservation";
import dayjs from "dayjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IReserva } from "../../interfaces/IReservas";
import { useAuth } from "../../hooks/useAuth";

const NewReservation = () => {
  const [dataReservation, setDataReservation] = useState<
    IReserva | Omit<IReserva, "id" | "usuarioId">
  >({
    nombre: "",
    materia: "",
    dia: null,
    horaInicio: null,
    horaFin: null,
  });
  const [isDisabled, setIsDisabled] = useState(true);

  const { isLoading, isError, agregarReserva, comprobarDisponibilidad } =
    useReservas();

  const { usuario, cargando } = useAuth();

  useEffect(() => {
    if (usuario) {
      setDataReservation({
        nombre: usuario?.nombre,
        materia: usuario?.materia,
        dia: null,
        horaInicio: null,
        horaFin: null,
      });
    }
  }, [usuario]);

  useEffect(() => {
    if (
      dataReservation.nombre &&
      dataReservation.materia &&
      dataReservation.dia &&
      dataReservation.horaInicio &&
      dataReservation.horaFin
    ) {
      setIsDisabled(false);
    }
  }, [dataReservation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataReservation({ ...dataReservation, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (dataReservation.horaInicio && dataReservation.horaFin) {
      if (dataReservation.horaInicio >= dataReservation.horaFin) {
        toast.error("¡La hora de inicio no puede ser mayor a la hora de fin!");
        return;
      }
    }

    try {
      const disponible = await comprobarDisponibilidad(dataReservation);
      if (disponible) {
        await agregarReserva(dataReservation);
        toast.success("¡Se ha generado la reserva!");
        setDataReservation({
          nombre: "",
          materia: "",
          dia: null,
          horaInicio: null,
          horaFin: null,
        });
      } else {
        toast.error("¡El horario no está disponible!");
      }
    } catch (error) {
      toast.error("¡Error al generar la reserva!");
      console.log(error);
    }
  };

  if (isLoading) return <div>Cargando reservas...</div>;
  if (isError) return <div>Error al cargar las reservas</div>;

  return (
    <div className="flex flex-col gap-4 p-4">
      <ToastContainer />
      <div className="flex w-full justify-center">
        <div className="flex flex-col gap-4 w-full lg:w-1/2 shadow-custom p-8 rounded-lg">
          <h1 className="text-2xl font-bold text-center pb-4">Nueva Reserva</h1>
          <Input
            value={dataReservation.nombre}
            size="large"
            placeholder="Nombre"
            onChange={handleChange}
            name="nombre"
            disabled={cargando}
          />
          <Input
            value={dataReservation.materia}
            size="large"
            placeholder="Materia"
            onChange={handleChange}
            name="materia"
            disabled={cargando}
          />
          <DatePicker
            size="large"
            value={dataReservation.dia ? dayjs(dataReservation.dia) : null}
            onChange={(date) =>
              setDataReservation((prev) => ({
                ...prev,
                dia: date.format("YYYY-MM-DD"),
              }))
            }
            placeholder="Dia de Reservacion"
            name="dia"
            disabled={cargando}
          />
          <TimePicker
            size="large"
            value={
              dataReservation.horaInicio
                ? dayjs(dataReservation.horaInicio, "HH:mm")
                : null
            }
            onChange={(time) =>
              setDataReservation((prev) => ({
                ...prev,
                horaInicio: time?.format("HH:mm") || null,
              }))
            }
            placeholder="Hora Inicio"
            name="horaInicio"
            disabled={cargando}
          />
          <TimePicker
            size="large"
            value={
              dataReservation.horaFin
                ? dayjs(dataReservation.horaFin, "HH:mm")
                : null
            }
            onChange={(time) =>
              setDataReservation((prev) => ({
                ...prev,
                horaFin: time?.format("HH:mm") || null,
              }))
            }
            placeholder="Hora Fin"
            name="horaFin"
            disabled={cargando}
          />
          <div className="flex justify-center">
            <Button
              type="primary"
              className="w-full md:w-1/3 justify-center font-bold"
              size="large"
              onClick={handleSubmit}
              loading={cargando}
              disabled={isDisabled}
            >
              Reservar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewReservation;
