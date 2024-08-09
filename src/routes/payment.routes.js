import express from 'express';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Make sure to set this environment variable

// Create a payment intent
router.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount } = req.body; // Amount should be in the smallest currency unit (e.g., cents)
        console.log('Amount--->:', amount);
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            payment_method_types: ['card'],
        });
         
        console.log('paymentIntent--->:', paymentIntent);
        res.status(200).json({ clientSecret: paymentIntent.client_secret , amount: paymentIntent.amount});
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;
