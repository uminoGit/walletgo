import { Schema, model, Document, Types } from 'mongoose';

export interface IBudget extends Document {
  monthlyLimit: number;
  user: Types.ObjectId;
}

const BudgetSchema = new Schema<IBudget>(
  {
    monthlyLimit: {
      type: Number,
      required: [true, 'Monthly limit is required'],
      min: [1, 'Monthly limit must be greater than 0'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export const Budget = model<IBudget>('Budget', BudgetSchema);