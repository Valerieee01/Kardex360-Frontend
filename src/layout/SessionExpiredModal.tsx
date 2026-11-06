import { useState } from "react";
import { Lock, Eye, EyeOff, AlertCircle, LogOut, ShieldAlert } from "lucide-react";
import { login } from "../Modules/Login/Api/auth.api";
import { getStoredUser } from "../app/Shared/session";
import { resolveReauth, cancelReauth } from "../app/Shared/http";

type Props = {
  onSessionRestored: () => void;
  onLogout: () => void;
};

export function SessionExpiredModal({ onSessionRestored, onLogout }: Props) {
  const user = getStoredUser();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || !user) return;

    setError(null);
    setLoading(true);

    try {
      const res = await login({ identification: user.id, password });
      resolveReauth(res.data.accessToken);
      onSessionRestored();
    } catch {
      setError("Contraseña incorrecta. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    cancelReauth();
    onLogout();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 space-y-6">

        {/* Icono + título */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-full">
            <ShieldAlert className="w-7 h-7 text-amber-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Sesión expirada</h3>
            <p className="text-sm text-gray-500 mt-1.5 leading-snug">
              Tu sesión venció mientras trabajabas.
              {user?.nombre ? (
                <> Ingresa la contraseña de <span className="font-semibold text-gray-700">{user.nombre}</span> para continuar sin perder lo que estabas haciendo.</>
              ) : (
                <> Ingresa tu contraseña para continuar sin perder lo que estabas haciendo.</>
              )}
            </p>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(null); }}
              autoFocus
              className={`w-full pl-12 pr-12 py-3.5 rounded-xl border outline-none transition-all text-gray-700 placeholder:text-gray-400
                ${error
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-200">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password.trim()}
            className="w-full py-3.5 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white font-bold rounded-xl transition-colors"
          >
            {loading ? "Verificando..." : "Continuar sesión"}
          </button>
        </form>

        {/* Cerrar sesión */}
        <div className="border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>

      </div>
    </div>
  );
}
