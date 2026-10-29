import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
  }

  private handleResetCache = () => {
    if (window.confirm("Isso redefinirá os dados salvos localmente para as configurações padrão e liberará a memória. Deseja continuar?")) {
      try {
        localStorage.removeItem('astraya_deficiencies_v6');
        localStorage.removeItem('astraya_deficiencies_v5');
      } catch (e) {
        console.error("Error clearing localStorage:", e);
      }
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-900 border border-emerald-800/80 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 bg-amber-950/80 border border-amber-600/60 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Ops! Ocorreu um imprevisto na exibição</h2>
              <p className="text-xs text-slate-400 mt-1">
                Uma imagem com tamanho excessivo ou dados corrompidos pode ter excedido a memória do navegador.
              </p>
            </div>

            {this.state.error && (
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-mono text-red-300 text-left overflow-auto max-h-24">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Recarregar Página</span>
              </button>
              <button
                onClick={this.handleResetCache}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-red-950 hover:text-red-300 text-slate-300 font-medium text-xs rounded-xl border border-slate-700 transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Limpar Cache Local</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
