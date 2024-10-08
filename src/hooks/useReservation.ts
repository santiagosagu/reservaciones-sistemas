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
  DocumentData,
  Query,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { IReserva } from "../interfaces/IReservas";
import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import useRealtimeQueries from "./useRealTimeQueries";

interface CollectionConfig {
  name: string;
  query: (userId: string | null) => Query<DocumentData>;
  transform: (doc: DocumentData) => any;
}

export function useReservas(idConfirmReserva?: string) {
  const queryClient = useQueryClient();

  const [reservas, setReservas] = useState<IReserva[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { usuario } = useAuth();

  const collections: CollectionConfig[] = [
    {
      name: "reservasUsuario",
      query: (userId) =>
        query(collection(db, "reservas"), where("usuarioId", "==", userId)),
      transform: (doc) => ({ id: doc.id, ...doc.data() } as IReserva),
    },
    {
      name: "todasLasReservas",
      query: () => query(collection(db, "reservas")),
      transform: (doc) => ({ id: doc.id, ...doc.data() } as IReserva),
    },
  ];

  const { data } = useRealtimeQueries(collections);

  useEffect(() => {
    if (!usuario) {
      setReservas([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const reservasCol = collection(db, "reservas");
    const q = query(reservasCol, where("usuarioId", "==", usuario.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const nuevasReservas = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as IReserva)
        );
        setReservas(nuevasReservas);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error al obtener reservas:", error);
        setIsError(true);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [usuario]);

  const obtenerTodasLasReservas = async (): Promise<IReserva[]> => {
    const reservasCol = collection(db, "reservas");
    const reservasSnapshot = await getDocs(reservasCol);
    return reservasSnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as IReserva)
    );
  };

  const obtenerReservasPorID = async (id: string): Promise<IReserva[]> => {
    const reservasCol = collection(db, "reservas", id);
    const reservasSnapshot = await getDocs(reservasCol);
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

  const todasLasReservasQuery = useQuery<IReserva[], Error>({
    queryKey: ["todasLasReservas"],
    queryFn: obtenerTodasLasReservas,
  });

  const reservasPorIDQuery = useQuery<IReserva[], Error>({
    queryKey: ["reservasPorID"],
    queryFn: () => obtenerReservasPorID(idConfirmReserva || ""),
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
    data,
    isLoading,
    isError,
    agregarReserva: agregarReservaMutation.mutate,
    eliminarReserva: eliminarReservaMutation.mutate,
    todasLasReservas: todasLasReservasQuery.data,
    comprobarDisponibilidad,
    reservasPorID: reservasPorIDQuery.data,
    confirmarReserva,
    cancelarReserva,
    actualizarEstadoReserva: actualizarEstadoReservaMutation.mutate,
  };
}
