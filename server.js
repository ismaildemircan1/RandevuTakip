const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json({ limit: '100kb' }));
app.use(cors());

const API_KEY = process.env.API_KEY || 'local-dev-key';
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT = 100;
const requestBuckets = new Map();

function sanitizeText(value = '') {
    return String(value).replace(/[<>"']/g, '').trim();
}

function validatePhone(phone) {
    return /^\+?[1-9]\d{8,14}$/.test(String(phone || '').replace(/\s+/g, ''));
}

function requireAuth(req, res, next) {
    if (req.headers['x-api-key'] !== API_KEY) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    return next();
}

function rateLimit(req, res, next) {
    const key = req.ip || 'unknown';
    const now = Date.now();
    const bucket = requestBuckets.get(key) || { count: 0, resetAt: now + RATE_WINDOW_MS };

    if (now > bucket.resetAt) {
        bucket.count = 0;
        bucket.resetAt = now + RATE_WINDOW_MS;
    }

    bucket.count += 1;
    requestBuckets.set(key, bucket);

    if (bucket.count > RATE_LIMIT) {
        return res.status(429).json({ success: false, error: 'Too many requests' });
    }

    return next();
}

app.use(rateLimit);

app.post('/send-whatsapp', requireAuth, (req, res) => {
    const phone = sanitizeText(req.body.phone);
    const message = sanitizeText(req.body.message);
    if (!validatePhone(phone) || message.length < 3 || message.length > 500) {
        return res.status(400).json({ success: false, error: 'Invalid payload' });
    }

    console.log(`WhatsApp gönderim kuyruğu: ${phone} - ${message}`);
    return res.json({ success: true });
});

app.post('/create-payment-intent', requireAuth, async (req, res) => {
    try {
        const amount = Number(req.body.amount);
        const paymentMethodId = sanitizeText(req.body.paymentMethodId);
        const stripeKey = process.env.STRIPE_SECRET_KEY;

        if (!Number.isInteger(amount) || amount <= 0) {
            return res.status(400).json({ success: false, error: 'Geçersiz ödeme tutarı' });
        }
        if (!paymentMethodId || paymentMethodId.length < 5) {
            return res.status(400).json({ success: false, error: 'Geçersiz ödeme metodu' });
        }
        if (!stripeKey) {
            return res.status(500).json({ success: false, error: 'Stripe yapılandırması eksik (STRIPE_SECRET_KEY)' });
        }

        const payload = new URLSearchParams({
            amount: String(amount),
            currency: 'try',
            payment_method: paymentMethodId,
            confirm: 'true',
            'automatic_payment_methods[enabled]': 'true',
            'automatic_payment_methods[allow_redirects]': 'never'
        });

        const stripeResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${stripeKey}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: payload
        });

        const data = await stripeResponse.json();
        if (!stripeResponse.ok) {
            return res.status(400).json({ success: false, error: data.error?.message || 'Stripe error' });
        }

        return res.json({ success: true, paymentIntentId: data.id, status: data.status });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
