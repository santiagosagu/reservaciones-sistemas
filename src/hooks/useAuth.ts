import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { IUsers } from "../interfaces/IUsers";
import { doc, getDoc, setDoc } from "firebase/firestore";

export function useAuth() {
  const [usuario, setUsuario] = useState<IUsers | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "usuarios", user.uid));
        const userData = userDoc.data() as Omit<IUsers, "uid">;
        setUsuario({ uid: user.uid, ...userData });
      } else {
        setUsuario(null);
      }
      setCargando(false);
    });

    return () => unsubscribe();
  }, []);

  const registrar = async (
    email: string,
    password: string,
    nombre: string,
    materia: string
  ) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    await setDoc(doc(db, "usuarios", user.uid), {
      email,
      nombre,
      materia,
      rol: "user",
    });
    setUsuario({ uid: user.uid, email, nombre, materia, rol: "user" });
  };

  const iniciarSesion = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const cerrarSesion = () => {
    return signOut(auth);
  };

  return {
    usuario,
    cargando,
    registrar,
    iniciarSesion,
    cerrarSesion,
  };
}
