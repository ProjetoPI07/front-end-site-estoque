/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Toast from "../components/ui/Toast";

const ToastContext = createContext(null);

let contador = 0;

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const temporizador = useRef(null);

  const fecharToast = useCallback(() => {
    setToast(null);
  }, []);

  const mostrarToast = useCallback((tipo, mensagem) => {
    contador += 1;
    setToast({ id: contador, tipo, mensagem });
  }, []);

  useEffect(() => {
    if (!toast) return undefined;

    window.clearTimeout(temporizador.current);
    temporizador.current = window.setTimeout(() => setToast(null), 4800);

    return () => window.clearTimeout(temporizador.current);
  }, [toast]);

  const valor = useMemo(
    () => ({ mostrarToast, fecharToast }),
    [mostrarToast, fecharToast],
  );

  return (
    <ToastContext.Provider value={valor}>
      {children}
      {toast ? (
        <Toast
          key={toast.id}
          tipo={toast.tipo}
          mensagem={toast.mensagem}
          onFechar={fecharToast}
        />
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const contexto = useContext(ToastContext);
  if (!contexto) {
    throw new Error("useToast deve ser usado dentro de ToastProvider");
  }
  return contexto;
}
