const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/health', (_req, res) => {
    res.json({ ok: true, service: 'RandevuTakip', timestamp: new Date().toISOString() });
});

app.post('/send-whatsapp', (req, res) => {
    const { phone, message } = req.body;

    console.log(`WhatsApp mesajı gönderildi: ${phone} - ${message}`);
    res.json({ success: true });
});

app.post('/create-payment-intent', (req, res) => {
    const { amount, cardNumber } = req.body;

    console.log(`Ödeme alındı (Demo): Kart ${cardNumber}, Tutar: ${amount / 100} TL`);
    res.json({ success: true });
});

app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
