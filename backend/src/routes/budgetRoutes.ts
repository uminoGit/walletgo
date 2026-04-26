import { Router } from 'express';
import { setBudget, getBudget } from '../controllers/budgetController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/', getBudget);
router.post('/', setBudget);

export default router;