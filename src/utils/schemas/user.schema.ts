import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export class User extends mongoose.Document {
  username: string;
  password: string;
}
