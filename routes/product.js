import express from 'express';
import { getUserProducts, createProduct, deleteProduct, getAllProducts, createOffer, acceptOffer, rejectOffer, getProductById } from '../controllers/product.js';
import { authenticateToken, authorizeRole } from '../authMiddleware.js';

const router = express.Router();

router.get('/user',authenticateToken, getUserProducts);
router.delete('/delete/:productId', authenticateToken, authorizeRole('seller'), deleteProduct);
router.post('/create',authenticateToken,authorizeRole('seller'), createProduct);
router.get('/all', getAllProducts);
router.get('/:productId', getProductById);
router.post('/create-offer/:productId', authenticateToken, authorizeRole('customer'), createOffer);
router.post('/accept-offer/:productId/:offerId', authenticateToken, authorizeRole('seller'), acceptOffer);
router.post('/reject-offer/:productId/:offerId', authenticateToken, authorizeRole('seller'), rejectOffer);

export default router;
