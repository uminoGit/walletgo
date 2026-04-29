import { Schema, model, Document, Types } from 'mongoose';

export interface ICorte extends Document {
  user: Types.ObjectId;
  date: Date;
  totalVentas: number;
  totalGastos: number;
  ganancia: number;
  nota?: string;
}

const CorteSchema = new Schema<ICorte>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    totalVentas: {
      type: Number,
      required: true,
      min: 0,
    },
    totalGastos: {
      type: Number,
      required: true,
      min: 0,
    },
    ganancia: {
      type: Number,
      required: true,
    },
    nota: {
      type: String,
      trim: true,
      maxlength: [200, 'Nota cannot exceed 200 characters'],
    },
  },
  { timestamps: true }
);

export const Corte = model<ICorte>('Corte', CorteSchema);