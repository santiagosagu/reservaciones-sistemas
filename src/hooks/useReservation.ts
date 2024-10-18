/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  where,
  query,
  updateDoc,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { IReserva } from "../interfaces/IReservas";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./useAuth";

export function useReservas(idConfirmReserva?: string) {
  const queryClient = useQueryClient();

  const [reservas, setReservas] = useState<IReserva[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const audioRef = useRef(new Audio("/sound/notificacion.mp3"));
  const prevReservasRef = useRef<IReserva[]>([]);

  const { usuario } = useAuth();

  useEffect(() => {
    if (!usuario) {
      setReservas([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const reservasCollection = collection(db, "reservas");
    let q;

    if (usuario.rol === "admin") {
      q = query(reservasCollection, orderBy("dia", "desc"));
    } else {
      q = query(
        reservasCollection,
        where("usuarioId", "==", usuario.uid),
        orderBy("dia", "desc")
      );
    }

    const solicitarPermisoNotificaciones = async () => {
      if (Notification.permission !== "granted") {
        const permiso = await Notification.requestPermission();
        return permiso === "granted";
      }
      return true;
    };

    const mostrarNotificacion = async (titulo: string, cuerpo: string) => {
      audioRef.current
        .play()
        .catch((error) => console.error("Error al reproducir sonido:", error));
      const tienePermiso = await solicitarPermisoNotificaciones();
      if (tienePermiso) {
        new Notification(titulo, { body: cuerpo });
      }
    };

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const nuevasReservas = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as IReserva)
        );
        setReservas(nuevasReservas);
        setIsLoading(false);

        if (usuario.rol === "admin") {
          const nuevasCreaciones = nuevasReservas.filter(
            (reserva) =>
              !prevReservasRef.current.some(
                (prevReserva) => prevReserva.id === reserva.id
              )
          );

          if (nuevasCreaciones.length > 0 && audioRef.current) {
            mostrarNotificacion(
              "Nueva reserva",
              `Se ha creado ${nuevasCreaciones.length} nueva(s) reserva(s)`
            );
          }
        } else {
          const nuevasConfirmaciones = nuevasReservas.filter(
            (reserva) =>
              reserva.estado === "confirmada" &&
              prevReservasRef.current.find(
                (prevReserva) =>
                  prevReserva.id === reserva.id &&
                  prevReserva.estado !== "confirmada"
              )
          );

          if (nuevasConfirmaciones.length > 0 && audioRef.current) {
            mostrarNotificacion(
              "Reserva confirmada",
              `Se ha confirmado ${nuevasConfirmaciones.length} reserva(s)`
            );
          }
        }

        prevReservasRef.current = nuevasReservas;
      },
      (error) => {
        console.error("Error al obtener reservas:", error);
        setIsError(true);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [usuario]);

  const obtenerReservasPorID = async (id: string): Promise<IReserva[]> => {
    const reservasCol = collection(db, "reservas", id);
    const reservasSnapshot = await getDocs(reservasCol);
    return reservasSnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as IReserva)
    );
  };

  const obtenerReservasPorEstado = async (): Promise<IReserva[]> => {
    const reservasCol = collection(db, "reservas");
    const q = query(
      reservasCol,
      where("estado", "==", "confirmada"),
      orderBy("dia", "desc")
    );
    const reservasSnapshot = await getDocs(q);
    return reservasSnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as IReserva)
    );
  };

  const comprobarDisponibilidad = async (
    nuevaReserva: Omit<IReserva, "id" | "usuarioId">
  ): Promise<boolean> => {
    const { dia, horaInicio, horaFin } = nuevaReserva;

    const inicioReserva = new Date(`${dia}T${horaInicio}`);
    const finReserva = new Date(`${dia}T${horaFin}`);

    const reservasCol = collection(db, "reservas");
    const q = query(reservasCol, where("dia", "==", dia));
    const reservasSnapshot = await getDocs(q);

    // Comprobar si hay superposición con alguna reserva existente
    for (const doc of reservasSnapshot.docs) {
      const reservaExistente = doc.data() as IReserva;
      const inicioExistente = new Date(
        `${reservaExistente.dia}T${reservaExistente.horaInicio}`
      );
      const finExistente = new Date(
        `${reservaExistente.dia}T${reservaExistente.horaFin}`
      );

      if (
        (inicioReserva >= inicioExistente && inicioReserva < finExistente) ||
        (finReserva > inicioExistente && finReserva <= finExistente) ||
        (inicioReserva <= inicioExistente && finReserva >= finExistente)
      ) {
        return false;
      }
    }

    return true;
  };

  const agregarReserva = async (
    nuevaReserva: Omit<IReserva, "id" | "usuarioId" | "estado">
  ) => {
    const usuario = auth.currentUser;
    if (!usuario) throw new Error("Usuario no autenticado");

    const reservasCol = collection(db, "reservas");
    return await addDoc(reservasCol, {
      ...nuevaReserva,
      usuarioId: usuario.uid,
      estado: "pendiente",
    });
  };

  const eliminarReserva = async (id: any) => {
    const reservaDoc = doc(db, "reservas", id);
    return await deleteDoc(reservaDoc);
  };

  const actualizarEstadoReserva = async (
    reservaId: string,
    nuevoEstado: "confirmada" | "cancelada"
  ) => {
    const reservaRef = doc(db, "reservas", reservaId);
    await updateDoc(reservaRef, { estado: nuevoEstado });
  };

  const confirmarReserva = async (reservaId: string) => {
    await actualizarEstadoReserva(reservaId, "confirmada");
  };

  const cancelarReserva = async (reservaId: string) => {
    await actualizarEstadoReserva(reservaId, "cancelada");
  };

  const reservasPorIDQuery = useQuery<IReserva[], Error>({
    queryKey: ["reservasPorID"],
    queryFn: () => obtenerReservasPorID(idConfirmReserva || ""),
  });

  const reservasPorEstadoQuery = useQuery<IReserva[], Error>({
    queryKey: ["reservasPorEstado"],
    queryFn: () => obtenerReservasPorEstado(),
  });

  const agregarReservaMutation = useMutation({
    mutationFn: agregarReserva,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reservas", "todasLasReservas", "reservasUsuario"],
      });
    },
  });

  const eliminarReservaMutation = useMutation({
    mutationFn: eliminarReserva,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reservas", "todasLasReservas", "reservasUsuario"],
      });
    },
  });

  const actualizarEstadoReservaMutation = useMutation({
    mutationFn: ({
      reservaId,
      nuevoEstado,
    }: {
      reservaId: string;
      nuevoEstado: "confirmada" | "cancelada";
    }) => actualizarEstadoReserva(reservaId, nuevoEstado),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reservas", "todasLasReservas", "reservasUsuario"],
      });
    },
  });

  return {
    reservas,
    // data,
    isLoading,
    isError,
    reservasPorID: reservasPorIDQuery.data,
    reservasPorEstado: reservasPorEstadoQuery.data,
    agregarReserva: agregarReservaMutation.mutate,
    eliminarReserva: eliminarReservaMutation.mutate,
    actualizarEstadoReserva: actualizarEstadoReservaMutation.mutate,
    actualizarReserva: actualizarEstadoReservaMutation,
    comprobarDisponibilidad,
    confirmarReserva,
    cancelarReserva,
  };
}
