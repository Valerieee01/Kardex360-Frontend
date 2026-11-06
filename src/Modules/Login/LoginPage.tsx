import { useState } from "react";
import {
  Mail, Lock, Eye, EyeOff, Package,
  ArrowRight, ShieldCheck, AlertCircle,
} from "lucide-react";
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
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIdentificacionError(false);
    setPasswordError(false);
    setLoginError(null);

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
    } catch {
      setLoginError(
        "Credenciales incorrectas. Verifique su identificación y contraseña e intente nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">

      <div className="flex flex-col md:flex-row w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden">

        {/* ── Panel izquierdo (blanco) ── */}
        <div className="flex-1 bg-white flex flex-col justify-center px-8 py-12 md:px-12">

          <h1 className="text-3xl font-bold text-blue-900 text-center mb-3">
            Iniciar Sesión
          </h1>

          {/* Subtítulo con líneas decorativas */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-sm whitespace-nowrap">Accede a tu cuenta</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">

            {/*  Identificación */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Usuario"
                value={identification}
                onChange={(e) => {
                  setIdentificacion(e.target.value);
                  if (identificacionError) setIdentificacionError(false);
                  if (loginError) setLoginError(null);
                }}
                className={`w-full pl-12 pr-4 py-3.5 rounded-xl border outline-none transition-all text-gray-700 placeholder:text-gray-400 bg-white
                  ${identificacionError
                    ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  }`}
              />
            </div>

            {/* Campo Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError(false);
                  if (loginError) setLoginError(null);
                }}
                className={`w-full pl-12 pr-12 py-3.5 rounded-xl border outline-none transition-all text-gray-700 placeholder:text-gray-400 bg-white
                  ${passwordError
                    ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Error inline de credenciales */}
            {loginError && (
              <div className="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-red-600 text-sm leading-snug">{loginError}</p>
              </div>
            )}

            {/* Botón submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-800 to-blue-950 hover:from-blue-900 hover:to-blue-950 disabled:opacity-60 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 active:scale-[0.98] tracking-wide cursor-pointer"
            >
              <span>{loading ? "VALIDANDO..." : "INICIAR SESIÓN"}</span>
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>

          </form>

          {/* Pie de seguridad */}
          <div className="flex items-center justify-center gap-2 mt-8 text-gray-400 text-sm">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Tu información está segura con nosotros</span>
          </div>

        </div>

        {/* ── Panel derecho (azul) ── */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-950 md:w-[42%] flex flex-col items-center justify-center px-10 py-14 text-white md:rounded-tl-[80px]">

          {/* Ícono cubo */}
          <div className="bg-white/20 backdrop-blur-sm p-5 rounded-2xl border border-white/30 shadow-lg mb-6">
            <Package className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-center mb-3">¡Bienvenido!</h2>

          <p className="text-blue-100 text-center text-sm leading-relaxed mb-8 max-w-[220px]">
            Ingrese sus datos personales para usar todas las funciones del sitio
          </p>

          <p className="text-2xl font-bold tracking-widest text-white/90 uppercase">
            Kardex 360
          </p>

        </div>
      </div>

      <Toaster position="top-right" />
    </div>
  );
}
