import { useState, useEffect } from 'react';
import RouterPage from './routes/router.jsx';
import LoadingScreen from './components/load.mui.component.jsx';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga inicial de la aplicación
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 segundos de pantalla de carga

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return <RouterPage />;
}

export default App;
