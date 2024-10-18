import { useEffect } from "react";
import { useReservas } from "./useReservation";
import { IReserva } from "../interfaces/IReservas";

const useDeleteOldReservations = () => {
  const { reservas, eliminarReserva } = useReservas();

  useEffect(() => {
    const checkAndDeleteOldReservations = async () => {
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);

      if (reservas.length === 0) {
        console.log("No hay reservas para procesar.");
        return;
      }

      reservas.forEach((reserva: IReserva) => {
        if (reserva.dia) {
          const reservaDate = new Date(reserva.dia);
          if (reservaDate < sevenDaysAgo) {
            eliminarReserva(reserva.id);
          }
        }
      });
      localStorage.setItem("lastRun", now.toISOString());
    };

    const lastRun = localStorage.getItem("lastRun");
    const now = new Date();

    // Verificar si ha pasado un día desde la última ejecución
    if (lastRun && new Date(lastRun).getDate() === now.getDate()) {
      return;
    }

    // Si es la primera vez o ha pasado un día, ejecutar la función
    checkAndDeleteOldReservations();
  }, [reservas, eliminarReserva]);
};

export default useDeleteOldReservations;
