<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trading Bot Logs</title>
</head>
<body>
    <div id="logs-container"></div>

    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script>
        const SYMBOL = "BTCUSDT";
        const API_URL = "https://testnet.binance.vision"; // Altere para o URL da API correto
        const interval = 3000; // Intervalo em milissegundos

        let isOpened = false;

        function calcSMA(data) {
            const closes = data.map(candle => parseFloat(candle[4]));
            const sum = closes.reduce((a, b) => a + b, 0);
            return sum / data.length;
        }

        function log(message) {
            const logsContainer = document.getElementById('logs-container');
            const p = document.createElement('p');
            p.textContent = message;
            logsContainer.appendChild(p);
        }

        async function start() {
            try {
                const { data } = await axios.get(`${API_URL}/api/v3/klines?limit=21&interval=15m&symbol=${SYMBOL}`);
                const candle = data[data.length - 1];
                const price = parseFloat(candle[4]);

                log(`Price: ${price}`);

                const sma21 = calcSMA(data);
                const sma13 = calcSMA(data.slice(8));
                log(`SMA (13): ${sma13}`);
                log(`SMA (21): ${sma21}`);
                log(`Is Opened? ${isOpened}`);

                if (sma13 > sma21 && !isOpened) {
                    log("comprar");
                    isOpened = true;
                } else if (sma13 < sma21 && isOpened) {
                    log("vender");
                    isOpened = false;
                } else {
                    log("aguardar");
                }
            } catch (error) {
                log(`Erro ao obter dados: ${error}`);
            }
        }

        setInterval(start, interval);

        start();
    </script>
</body>
</html>
