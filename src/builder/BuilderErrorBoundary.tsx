import React from 'react';
import type { LifecycleEventType } from '@/types/lifecycle';
import { reportError } from '@/services/error-reporter.service';
import { writeLifecycleLog } from '@/services/logs.service';

interface State {
  hasError: boolean;
  error?: Error | null;
  errorInfo?: React.ErrorInfo | null;
}

export class BuilderErrorBoundary extends React.Component<React.PropsWithChildren<Record<string, never>>, State> {
  constructor(props: React.PropsWithChildren<Record<string, never>>) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  async componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ hasError: true, error, errorInfo });

    // Report to mock error reporter
    try {
      await reportError({ message: error.message, context: errorInfo.componentStack ?? '', failedPayload: null });
    } catch {
      // swallow
    }

    // Also write a lifecycle log entry for visibility (mock)
    try {
  await writeLifecycleLog({ type: 'import_applied' as LifecycleEventType, versionId: 'unknown', userId: 'system', details: { message: error.message } });
    } catch {
      // swallow
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded bg-red-900 text-white">
          <h3 className="text-lg font-bold">Something went wrong</h3>
          <p className="mt-2 text-sm">An unexpected error occurred in the builder. You can report this issue to help us diagnose it.</p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              className="px-3 py-1 rounded bg-white text-red-900 font-medium"
              onClick={async () => {
                if (!this.state.error) return;
                await reportError({ message: this.state.error.message, context: this.state.errorInfo?.componentStack ?? '', failedPayload: null });
                alert('Error reported (mock)');
              }}
            >
              Report
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded bg-white/10 text-white"
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}

export default BuilderErrorBoundary;
