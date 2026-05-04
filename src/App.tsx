import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { router } from './routes';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a1d23',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '16px',
            padding: '16px 24px',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          },
          success: {
            iconTheme: {
              primary: '#6056e7',
              secondary: '#1a1d23',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#1a1d23',
            },
          }
        }}
      />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
