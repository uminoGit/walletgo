import { Schema, model, Document } from 'mongoose';

export interface IBudget extends Document {
  monthlyLimit: number;
}

const BudgetSchema = new Schema<IBudget>(
  {
    monthlyLimit: {
      type: Number,
      required: [true, 'Monthly limit is required'],
      min: [1, 'Monthly limit must be greater than 0'],
    },
  },
  { timestamps: true }
);

export const Budget = model<IBudget>('Budget', BudgetSchema);
