require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

// URL do ThingSpeak
const URL = `https://api.thingspeak.com/channels/${process.env.CHANNEL_ID}/feeds.json?api_key=${process.env.READ_API_KEY}&results=${process.env.RESULTS}`;

// Endpoint que retorna dados em JSON
app.get("/data", async (req, res) => {
  try {
    const response = await axios.get(URL);
    const feeds = response.data.feeds;

    const temperatura = feeds.map(f => parseFloat(f.field1)).filter(v => !isNaN(v));
    const umidade = feeds.map(f => parseFloat(f.field2)).filter(v => !isNaN(v));
    const tempo = feeds.map(f => f.created_at);

    res.json({ temperatura, umidade, tempo });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar dados" });
  }
});

// Página HTML com 3 gráficos
app.get("/", (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="pt-br">
  <head>
    <meta charset="UTF-8">
    <title>Dashboard IoT Live</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
      /* Reset básico */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #e0f7fa, #e0f7fa);
        color: #333;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      header {
        padding: 20px;
        background: linear-gradient(90deg, #3B5C76, #3B5C76);
        color: #fff;
        box-shadow: 0 4px 6px rgba(0,0,0,0.15);
        text-align: center;
      }

      h1 {
        font-size: 2.2rem;
        margin-bottom: 8px;
      }

      header p {
        font-size: 1rem;
        opacity: 0.9;
      }

      .charts-wrapper {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 25px;
        padding: 30px;
        flex: 1;
      }

      .chart-container {
        background: #fff;
        padding: 20px;
        border-radius: 14px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        transition: transform 0.3s, box-shadow 0.3s;
      }

      .chart-container:hover {
        transform: translateY(-6px);
        box-shadow: 0 12px 24px rgba(0,0,0,0.12);
      }

      h2 {
        margin-bottom: 15px;
        font-size: 1.4rem;
        color: #7BAFD4;
      }

      footer {
        text-align: center;
        padding: 15px;
        background-color: #7BAFD4;
        color: #fff;
        font-size: 0.9rem;
      }

      /* Animação de fade-in */
      .chart-container {
        animation: fadeIn 1s ease;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    </style>
  </head>
  <body>
    <header>
      <h1>📊 Dashboard IoT - Tempo Real</h1>
      <p>Atualização automática a cada 10 segundos</p>
    </header>

    <div class="charts-wrapper">
      <div class="chart-container">
        <h2>🌊 Umidade (%)</h2>
        <canvas id="chartUmidade"></canvas>
      </div>
      <div class="chart-container">
        <h2>🌡️ Temperatura (°C)</h2>
        <canvas id="chartTemperatura"></canvas>
      </div>
      <div class="chart-container">
        <h2>📈 Dashboard Combinado</h2>
        <canvas id="chartCombined"></canvas>
      </div>
    </div>

    <footer>
      Desenvolvido por <strong>Louisy Marcelle</strong>
    </footer>

    <script>
      const ctxUmidade = document.getElementById('chartUmidade').getContext('2d');
      const ctxTemperatura = document.getElementById('chartTemperatura').getContext('2d');
      const ctxCombined = document.getElementById('chartCombined').getContext('2d');

      const chartUmidade = new Chart(ctxUmidade, {
        type: 'line',
        data: { labels: [], datasets: [{ label: 'Umidade (%)', data: [], borderColor: '#0288d1', backgroundColor: 'rgba(2,136,209,0.2)', fill: true }] },
        options: { responsive: true, plugins: { legend: { display: true }, tooltip: { mode: 'index', intersect: false } }, scales: { y: { beginAtZero: true } } }
      });

      const chartTemperatura = new Chart(ctxTemperatura, {
        type: 'line',
        data: { labels: [], datasets: [{ label: 'Temperatura (°C)', data: [], borderColor: '#e53935', backgroundColor: 'rgba(229,57,53,0.2)', fill: true }] },
        options: { responsive: true, plugins: { legend: { display: true }, tooltip: { mode: 'index', intersect: false } }, scales: { y: { beginAtZero: true } } }
      });

      const chartCombined = new Chart(ctxCombined, {
        type: 'line',
        data: { labels: [], datasets: [
          { label: 'Umidade (%)', data: [], borderColor: '#0288d1', backgroundColor: 'rgba(2,136,209,0.2)', fill: true },
          { label: 'Temperatura (°C)', data: [], borderColor: '#e53935', backgroundColor: 'rgba(229,57,53,0.2)', fill: true }
        ]},
        options: { responsive: true, plugins: { legend: { display: true }, tooltip: { mode: 'index', intersect: false } }, scales: { y: { beginAtZero: true } } }
      });

      async function updateCharts() {
        try {
          const res = await fetch('/data');
          const { temperatura, umidade, tempo } = await res.json();

          chartUmidade.data.labels = tempo;
          chartUmidade.data.datasets[0].data = umidade;
          chartUmidade.update();

          chartTemperatura.data.labels = tempo;
          chartTemperatura.data.datasets[0].data = temperatura;
          chartTemperatura.update();

          chartCombined.data.labels = tempo;
          chartCombined.data.datasets[0].data = umidade;
          chartCombined.data.datasets[1].data = temperatura;
          chartCombined.update();
        } catch(err) {
          console.error("Erro ao atualizar gráficos:", err);
        }
      }

      setInterval(updateCharts, 10000);
      updateCharts();
    </script>
  </body>
  </html>
  `);
});

app.listen(port, () => {
  console.log(`🚀 Dashboard rodando em http://localhost:${port}`);
});
