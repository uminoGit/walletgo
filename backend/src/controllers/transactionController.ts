import { Request, Response } from 'express';
import { Transaction } from '../models/Transaction';

const userId = (req: Request): string => (req as any).userId;

export const createTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, type, category, description, date } = req.body;

    if (!amount || !type || !category || !description) {
      res.status(400).json({ success: false, message: 'All fields are required' });
      return;
    }

    if (!['income', 'expense'].includes(type)) {
      res.status(400).json({ success: false, message: 'Type must be income or expense' });
      return;
    }

    if (typeof amount !== 'number' || amount <= 0) {
      res.status(400).json({ success: false, message: 'Amount must be a positive number' });
      return;
    }

    const transaction = await Transaction.create({
      amount,
      type,
      category: category.trim(),
      description: description.trim(),
      date: date ? new Date(date) : new Date(),
      user: userId(req),
    });

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const getTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const transactions = await Transaction.find({ user: userId(req) }).sort({ date: -1 });
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const deleteTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: userId(req),
    });

    if (!transaction) {
      res.status(404).json({ success: false, message: 'Transaction not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const updateTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, type, category, description, date } = req.body;

    if (type && !['income', 'expense'].includes(type)) {
      res.status(400).json({ success: false, message: 'Type must be income or expense' });
      return;
    }

    if (amount !== undefined && (typeof amount !== 'number' || amount <= 0)) {
      res.status(400).json({ success: false, message: 'Amount must be a positive number' });
      return;
    }

    const updateData: Record<string, unknown> = {};
    if (amount !== undefined) updateData.amount = amount;
    if (type) updateData.type = type;
    if (category) updateData.category = category.trim();
    if (description) updateData.description = description.trim();
    if (date) updateData.date = new Date(date);

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: userId(req) },
      updateData,
      { new: true, runValidators: true }
    );

    if (!transaction) {
      res.status(404).json({ success: false, message: 'Transaction not found' });
      return;
    }

    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const getSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const transactions = await Transaction.find({
      user: userId(req),
      date: { $gte: startOfMonth },
    });

    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    res.status(200).json({
      success: true,
      data: {
        balance,
        totalIncome,
        totalExpenses,
        month: now.toLocaleString('default', { month: 'long', year: 'numeric' }),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};