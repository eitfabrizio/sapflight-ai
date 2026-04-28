const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint para comunicarse con Ollama con soporte de STREAMING
app.post('/api', async (req, res) => {
  const { query, language = 'es', model = 'llama3:8b' } = req.body;

  const langNames = { 'es': 'Español', 'en': 'English' };
  console.log(`Consulta recibida [Streaming] [${language}]:`, query);

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model,
        prompt: `Eres SapFlight AI, un experto en aviación. Responde en ${langNames[language] || 'Español'}.
        Instrucción: Si no es sobre vuelos/aviones, di que solo sabes de eso.
        Consulta: "${query}"`,
        stream: true // ¡ACTIVAMOS STREAMING!
      })
    });

    if (!response.ok) throw new Error('Ollama no respondió');

    // Configuramos los headers para streaming hacia el cliente
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      try {
        const json = JSON.parse(chunk);
        if (json.response) {
          res.write(json.response); // Enviamos cada palabra al cliente
        }
      } catch (e) {
        // A veces vienen múltiples JSON en un chunk
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.trim()) {
            const j = JSON.parse(line);
            if (j.response) res.write(j.response);
          }
        }
      }
    }
    res.end();

  } catch (error) {
    console.error('Error:', error);
    res.status(500).write('Error de conexión con Ollama.');
    res.end();
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor SapFlight AI (Turbo) en http://localhost:${PORT}`);
});
