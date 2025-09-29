# 🌐 Dashboard IoT – Monitoramento de Temperatura e Umidade em Tempo Real

Este projeto apresenta um **dashboard interativo** que exibe dados de **temperatura e umidade** coletados por um dispositivo IoT (**ESP32-C3 + DHT11**) e enviados ao **ThingSpeak**.  
A visualização é feita em tempo real através de um servidor **Node.js** integrado ao **Chart.js**.

---

## 🚀 Funcionalidades

- Consumo de dados via **API HTTP** do ThingSpeak
- Exibição em **três gráficos distintos**:
  - 📊 Umidade (%)
  - 🌡️ Temperatura (°C)
  - 📈 Painel combinado (Umidade + Temperatura)
- **Atualização automática** a cada 10 segundos
- Layout moderno com containers estilizados e tooltips
- Funcionamento **100% local** (`localhost`), sem necessidade de gerar imagens estáticas

---

## 🛠️ Tecnologias Utilizadas

- **Node.js** → servidor web e integração com a API
- **Express** → criação de rotas HTTP
- **Axios** → consumo de dados do ThingSpeak
- **Chart.js** → geração de gráficos dinâmicos
- **dotenv** → gerenciamento de variáveis de ambiente

---

## 📋 Pré-requisitos

- **Node.js** (v16 ou superior)
- **NPM** instalado
- Canal configurado no **ThingSpeak** contendo:
  - `field1`: Temperatura
  - `field2`: Umidade

---

## ⚙️ Configuração do Projeto

1. Clone o repositório:
   ```bash
   git clone <link-do-seu-github>
   cd <nome-do-projeto>
   Instale as dependências:
   ```

2. Instale as dependências:
npm install express axios dotenv

3. Crie um arquivo .env na raiz com as variáveis:

CHANNEL_ID=XXXXX
READ_API_KEY=XXXXXXX
RESULTS=XXXXXXX
Substitua pelos valores do seu canal no ThingSpeak.

## ▶️ Como Executar

node index.js
Abra no navegador:
👉 http://localhost:3000

O dashboard será carregado e os gráficos se atualizarão automaticamente a cada 10 segundos.

## 📂 Estrutura do Projeto


thingspeak_dashboard/
│
├─ index.js # Servidor Node.js + Dashboard
├─ .env # Configurações do ThingSpeak
└─ README.md # Documentaçã
o
## 📊 Demonstração
Gráfico de Umidade: histórico e valores atuais

Gráfico de Temperatura: histórico e valores atuais

Painel Combinado: visão integrada dos dois indicadores

✨ Atualização em tempo real, sem precisar recarregar a página.

## 🔎 Observações
O intervalo de atualização pode ser ajustado no código (setInterval).

Projeto ideal para aprendizado em IoT, consumo de APIs e visualização de dados.

## 👩‍💻 Autoria
Desenvolvido por Guilherme Jacques
