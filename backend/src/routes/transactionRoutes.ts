import { Router } from 'express';
import {
  createTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
  getSummary,
} from '../controllers/transactionController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/summary', getSummary);
router.get('/', getTransactions);
router.post('/', createTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;