import mongoose, { Schema, Document } from 'mongoose';

export interface IDatabase extends Document {
  name: string;
  tables: {
    name: string;
    columns: {
      name: string;
      type: string;
      constraints?: string[];
    }[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const DatabaseSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  tables: [{
    name: { type: String, required: true },
    columns: [{
      name: { type: String, required: true },
      type: { type: String, required: true },
      constraints: [{ type: String }]
    }]
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Database = mongoose.model<IDatabase>('Database', DatabaseSchema); 