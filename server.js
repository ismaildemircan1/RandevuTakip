const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

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

app.listen(3000, () => {
    console.log('Server running on port 3000');
});