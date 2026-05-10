import React from 'react';

/**
 * ErrorBoundary — catches React render errors and shows a fallback UI.
 * Wrap around sections that may fail (ProductGrid, Checkout, etc.)
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error('ErrorBoundary caught:', error, info);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;
            return (
                <div style={{
                    padding: '40px 24px',
                    textAlign: 'center',
                    background: '#ffffff',
                    color: '#111111',
                    minHeight: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                    fontFamily: 'Manrope, sans-serif',
                }}>
                    <p style={{ fontSize: '14px', color: '#666666' }}>Something went wrong.</p>
                    <button
                        onClick={() => this.setState({ hasError: false, error: null })}
                        style={{
                            background: 'none',
                            border: '1px solid #d8d8d8',
                            color: '#111111',
                            padding: '10px 20px',
                            fontSize: '12px',
                            fontWeight: 600,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                        }}
                    >
                        Try again
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
