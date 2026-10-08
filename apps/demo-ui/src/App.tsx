import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

export default function App() {
  const [events, setEvents] = useState<any[]>([]);
  const [customerId, setCustomerId] = useState('cliente-123');
  const [planId, setPlanId] = useState('plan-premium');
  const [simulateFailure, setSimulateFailure] = useState('none');

  useEffect(() => {
    // Nos conectamos al WebSocket expuesto por activation-api en el puerto 3000
    const socket = io('http://localhost:3000');
    
    // Escuchamos los eventos en tiempo real para armar la timeline
    socket.on('activationEvent', (event) => {
      setEvents((prev) => [...prev, event]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEvents([]); // Limpiamos la timeline para la nueva solicitud
    
    // Hacemos el POST al endpoint de nuestra API
    await fetch('http://localhost:3000/activations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId, planId, simulateFailure })
    });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>🚀 Activación de Servicios (TP08)</h1>
      
      <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
        <h2>Formulario de Contratación</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label>ID del Cliente: </label>
            <input value={customerId} onChange={e => setCustomerId(e.target.value)} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>ID del Plan: </label>
            <input value={planId} onChange={e => setPlanId(e.target.value)} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Simular Fallo: </label>
            <select value={simulateFailure} onChange={e => setSimulateFailure(e.target.value)}>
              <option value="none">Ninguno (Camino feliz)</option>
              <option value="billing">Fallo en Facturación</option>
              <option value="provisioning">Fallo en Aprovisionamiento</option>
            </select>
          </div>
          <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none' }}>
            Solicitar Activación
          </button>
        </form>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '15px' }}>
        <h2>⏳ Timeline de Eventos en Vivo</h2>
        {events.length === 0 ? <p>Esperando eventos...</p> : (
          <ul>
            {events.map((ev, i) => (
              <li key={i} style={{ margin: '10px 0' }}>
                <strong>{ev.eventType}</strong> <br/>
                <small>Correlación: {ev.correlationId}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}