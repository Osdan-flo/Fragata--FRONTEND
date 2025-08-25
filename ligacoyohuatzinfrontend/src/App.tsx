import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('Cargando...');

  useEffect(() => {
    setMessage('¡Bienvenido a Liga Coyohuatzin Frontend!');
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>{message}</h1>
    </div>
  );
}

export default App;
