import { Request, Response } from 'express';
import { Budget } from '../models/Budget';

const userId = (req: Request): string => (req as any).userId;

export const setBudget = async (req: Request, res: Response): Promise<void> => {
  try {
    const { monthlyLimit } = req.body;

    if (monthlyLimit === undefined || monthlyLimit === null) {
      res.status(400).json({ success: false, message: 'Monthly limit is required' });
      return;
    }

    if (typeof monthlyLimit !== 'number' || monthlyLimit <= 0) {
      res.status(400).json({ success: false, message: 'Monthly limit must be a positive number' });
      return;
    }

    const existing = await Budget.findOne({ user: userId(req) });

    let budget;
    if (existing) {
      budget = await Budget.findByIdAndUpdate(
        existing._id,
        { monthlyLimit },
        { new: true, runValidators: true }
      );
    } else {
      budget = await Budget.create({ monthlyLimit, user: userId(req) });
    }

    res.status(200).json({ success: true, data: budget });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const getBudget = async (req: Request, res: Response): Promise<void> => {
  try {
    const budget = await Budget.findOne({ user: userId(req) });

    if (!budget) {
      res.status(200).json({ success: true, data: null });
      return;
    }

    res.status(200).json({ success: true, data: budget });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};