import { Request, Response } from 'express';
import { Transaction } from '../models/Transaction';
import { Corte } from '../models/Corte';
import { User } from '../models/User';

const userId = (req: Request): string => (req as any).userId;

const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

export const getBusinessSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { start, end } = getTodayRange();

    const transactions = await Transaction.find({
      user: userId(req),
      source: 'business',
      date: { $gte: start, $lte: end },
    });

    const totalVentas = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalGastos = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const ganancia = totalVentas - totalGastos;

    const cortes = await Corte.find({ user: userId(req) }).sort({ date: -1 }).limit(7);

    res.status(200).json({
      success: true,
      data: {
        totalVentas,
        totalGastos,
        ganancia,
        transacciones: transactions,
        cortesRecientes: cortes,
        fecha: new Date().toLocaleDateString('es-MX', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error del servidor', error });
  }
};

export const registrarVenta = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, description } = req.body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      res.status(400).json({ success: false, message: 'Monto inválido' });
      return;
    }

    const transaction = await Transaction.create({
      amount,
      type: 'income',
      category: 'Venta',
      description: description?.trim() || 'Venta',
      date: new Date(),
      user: userId(req),
      source: 'business',
    });

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error del servidor', error });
  }
};

export const registrarGastoNegocio = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, description, category } = req.body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      res.status(400).json({ success: false, message: 'Monto inválido' });
      return;
    }

    if (!description?.trim()) {
      res.status(400).json({ success: false, message: 'La descripción es requerida' });
      return;
    }

    const transaction = await Transaction.create({
      amount,
      type: 'expense',
      category: category?.trim() || 'Gasto negocio',
      description: description.trim(),
      date: new Date(),
      user: userId(req),
      source: 'business',
    });

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error del servidor', error });
  }
};

export const hacerCorte = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nota } = req.body;
    const { start, end } = getTodayRange();

    const transactions = await Transaction.find({
      user: userId(req),
      source: 'business',
      date: { $gte: start, $lte: end },
    });

    const totalVentas = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalGastos = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const ganancia = totalVentas - totalGastos;

    const corte = await Corte.create({
      user: userId(req),
      date: new Date(),
      totalVentas,
      totalGastos,
      ganancia,
      nota: nota?.trim(),
    });

    res.status(201).json({ success: true, data: corte });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error del servidor', error });
  }
};

export const getCortes = async (req: Request, res: Response): Promise<void> => {
  try {
    const cortes = await Corte.find({ user: userId(req) }).sort({ date: -1 }).limit(30);
    res.status(200).json({ success: true, data: cortes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error del servidor', error });
  }
};

export const activarModoBusiness = async (req: Request, res: Response): Promise<void> => {
  try {
    const { businessName } = req.body;

    const user = await User.findByIdAndUpdate(
      userId(req),
      {
        mode: 'business',
        businessName: businessName?.trim() || 'Mi Negocio',
      },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      return;
    }

    res.status(200).json({
      success: true,
      data: { id: user._id, name: user.name, email: user.email, mode: user.mode, businessName: user.businessName },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error del servidor', error });
  }
};