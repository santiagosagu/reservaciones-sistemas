/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { onSnapshot, DocumentData, Query } from "firebase/firestore";
import { useAuth } from "./useAuth";

interface CollectionConfig {
  name: string;
  query: (userId: string | null) => Query<DocumentData>;
  transform: (doc: DocumentData) => any;
}

function useRealtimeQueries(collections: CollectionConfig[]) {
  const queryClient = useQueryClient();
  const { usuario } = useAuth();

  const queries = useQueries({
    queries: collections.map(({ name, query: queryFn, transform }) => ({
      queryKey: [name],
      queryFn: () =>
        new Promise((resolve, reject) => {
          if (name === "reservasUsuario" && !usuario) {
            console.log("Usuario no autenticado para reservasUsuario");
            resolve([]);
            return () => {};
          }
          const unsubscribe = onSnapshot(
            queryFn(usuario?.uid ?? null),
            (snapshot) => {
              const data = snapshot.docs.map(transform);
              resolve(data);
              queryClient.setQueryData([name, usuario?.uid], data);
            },
            (error) => {
              console.error(`Error en la consulta ${name}:`, error);
              reject(error);
            }
          );
          return () => unsubscribe();
        }),
      enabled: name !== "reservasUsuario" || !!usuario,
    })),
  });

  const data = collections.reduce((acc, { name }, index) => {
    acc[name] = {
      data: (queries[index].data as any[]) || [],
      isLoading: queries[index].isLoading,
      isError: queries[index].isError,
      error: queries[index].error,
    };
    return acc;
  }, {} as { [key: string]: { data: any[]; isLoading: boolean; isError: boolean; error: Error | null } });

  const isLoading = queries.some((query) => query.isLoading);
  const isError = queries.some((query) => query.isError);

  return { data, isLoading, isError };
}

export default useRealtimeQueries;
