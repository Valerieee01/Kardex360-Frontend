import { useState } from "react";
import { Package, User, ShieldCheck } from "lucide-react";
import { toast, Toaster } from "sonner";
import { login } from "./Api/auth.api";


type Props = {
  onLoginSuccess: () => void;
};

export default function LoginPage({ onLoginSuccess }: Props) {
  const [identification, setIdentificacion] = useState("");
  const [password, setPassword] = useState("");
const [identificacionError, setIdentificacionError] = useState(false);
const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
     // Reset errores antes de validar
  setIdentificacionError(false);
  setPasswordError(false);

  if (!identification.trim()) {
    setIdentificacionError(true);
    toast.error("La identificación es obligatoria");
    return;
  }

  if (!password.trim()) {
    setPasswordError(true);
    toast.error("La contraseña es obligatoria");
    return;
  }

  setLoading(true);


    try {
      const res = await login({ identification, password });
      toast.success(res.message || "Login exitoso");
      onLoginSuccess();
    } catch (err: any) {
      toast.error(err?.message ?? "Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-blue-900 p-8 text-white text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
              <Package className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Kardex 360</h1>
          <p className="text-blue-100 mt-2">Sistema de Gestión de Inventario</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Identificación / Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
               <input
                    placeholder="Ingrese su Identificacion"
                    type="text"
                    value={identification}
                    onChange={(e) => {
                        setIdentificacion(e.target.value);
                        if (identificacionError) setIdentificacionError(false);
                    }}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl transition-all outline-none
                        ${identificacionError
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-200 focus:ring-blue-900"
                        }`
                    }
                    />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                    placeholder="Ingrese su contraseña"
                    type="password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) setPasswordError(false);
                    }}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl transition-all outline-none
                        ${passwordError
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-200 focus:ring-blue-900"
                        }`
                    }
                    />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-900 hover:bg-blue-800 disabled:opacity-60 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]"
            >
              {loading ? "Validando..." : "Iniciar Sesión"}
            </button>
          </form>
        </div>
      </div>

      <Toaster position="top-right" />
    </div>
  );
}