/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatePicker, Tag } from "antd";
import { useReservas } from "../../hooks/useReservation";
import { IReserva } from "../../interfaces/IReservas";
import { useEffect, useState } from "react";

const AllReservationWhitConfirm = () => {
  const [fechaFiltro, setFechaFiltro] = useState<any>(null);
  const [reservasFiltradas, setReservasFiltradas] = useState<IReserva[]>([]);

  const { isLoading, isError, reservasPorEstado } = useReservas();

  useEffect(() => {
    if (fechaFiltro && reservasPorEstado) {
      const reservasFiltradas = reservasPorEstado?.filter(
        (reserva) => reserva.dia === fechaFiltro
      );
      setReservasFiltradas(reservasFiltradas);
    } else {
      setReservasFiltradas(reservasPorEstado || []);
    }
  }, [fechaFiltro, reservasPorEstado]);

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Error al cargar las reservas</div>;

  return (
    <div className="flex justify-center gap-2 p-4 w-full">
      <div className="w-full lg:w-[800px]">
        <div className="my-5">
          <DatePicker
            className="w-full lg:w-96"
            size="large"
            onChange={(_date, dateString) => setFechaFiltro(dateString)}
            placeholder="Buscar por dia"
            name="dia"
          />
        </div>
        {reservasFiltradas?.map((reserva: IReserva) => (
          <div
            className="flex flex-col gap-2 p-4 shadow-custom mb-5 rounded-lg max-w-xl bg-white"
            key={reserva.id}
          >
            <Tag bordered={false} color="success">
              <p className="text-xl capitalize font-semibold">{reserva.dia}</p>
            </Tag>
            <div className="flex">
              <p className="text-gray-500 capitalize mr-1 text-lg">
                <strong>Hora: </strong>
                {reserva.horaInicio} -
              </p>
              <p className="text-gray-500 capitalize text-lg">
                {reserva.horaFin}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div></div>
    </div>
  );
};

export default AllReservationWhitConfirm;
