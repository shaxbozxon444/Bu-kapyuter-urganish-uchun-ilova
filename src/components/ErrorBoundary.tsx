import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'Kutilmagan xatolik yuz berdi.',
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Ilovada xatolik yuz berdi
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 break-words">
                {this.state.message}
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="min-h-[44px] w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 rounded-xl hover:opacity-90 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Sahifani qayta yuklash</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
