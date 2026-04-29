import { Router } from 'express';
import {
  getBusinessSummary,
  registrarVenta,
  registrarGastoNegocio,
  hacerCorte,
  getCortes,
  activarModoBusiness,
} from '../controllers/businessController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/summary', getBusinessSummary);
router.post('/venta', registrarVenta);
router.post('/gasto', registrarGastoNegocio);
router.post('/corte', hacerCorte);
router.get('/cortes', getCortes);
router.post('/activar', activarModoBusiness);

export default router;