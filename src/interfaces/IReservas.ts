export interface IReserva {
  id: string;
  nombre: string;
  materia: string;
  dia: string | null;
  horaInicio: string | null;
  horaFin: string | null;
  usuarioId: string;
  estado?: "pendiente" | "confirmada" | "cancelada";
}
