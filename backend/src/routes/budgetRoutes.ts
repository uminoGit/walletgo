import { Router } from 'express';
import { setBudget, getBudget } from '../controllers/budgetController';

const router = Router();

router.get('/', getBudget);
router.post('/', setBudget);

export default router;
