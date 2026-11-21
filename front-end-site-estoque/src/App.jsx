import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, DadosProvider, useAuth } from "./context/AppContext";
import { ToastProvider } from "./context/ToastContext";
import PageShell from "./components/layout/PageShell";
import Login from "./pages/Login/Login";
import Estoque from "./pages/Estoque/Estoque";
import CadastrarPeca from "./pages/CadastrarPeca/CadastrarPeca";
import EditarPeca from "./pages/EditarPeca/EditarPeca";
import Cobrancas from "./pages/Cobrancas/Cobrancas";
import Dashboard from "./pages/Dashboard/Dashboard";

function RotaProtegida({ children }) {
  const { usuario } = useAuth();
  return usuario ? children : <Navigate to="/login" replace />;
}

function RotaLogin() {
  const { usuario } = useAuth();
  return usuario ? <Navigate to="/estoque" replace /> : <Login />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <DadosProvider>
            <Routes>
              <Route path="/login" element={<RotaLogin />} />

              <Route
                element={
                  <RotaProtegida>
                    <PageShell />
                  </RotaProtegida>
                }
              >
                <Route path="/estoque" element={<Estoque />} />
                <Route path="/pecas/nova" element={<CadastrarPeca />} />
                <Route path="/pecas/editar" element={<EditarPeca />} />
                <Route path="/cobrancas" element={<Cobrancas />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>

              <Route path="/" element={<Navigate to="/estoque" replace />} />
              <Route path="*" element={<Navigate to="/estoque" replace />} />
            </Routes>
          </DadosProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
