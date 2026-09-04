import {useEffect, useState} from 'react';
import api from './services/api';

function App() {
  const [status, setStatus] = useState("chechking backend status...");

  useEffect(() => {
  const checkBackend = async () => {
    try {
      const response = await api.get("/health");

      console.log("Backend response:", response.data);

      setStatus(response.data.status);
    } catch (error) {
      console.error("Backend request failed:", error);
      setStatus("Backend unavailable");
    }
  };

  checkBackend();
}, []);

  return (
    <div>
      <h1>Backend Status: {status}</h1>
    </div>
  );
}

export default App;