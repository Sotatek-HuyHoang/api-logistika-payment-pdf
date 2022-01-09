import { Router } from 'express';


const router = Router();
router.get('/', (req, res) => {
        res.render('receipt-payment', { layout: false, isNewMerchant: req.query.isNewMerchant === 'true' });
    });

export default router;
