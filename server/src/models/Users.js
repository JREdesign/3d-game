// Users.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Change this to savedQuestions to reflect the updates
  savedQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
});

// Note that the reference 'Question' should match the model name you have given in the Questions schema
export const UserModel = mongoose.model('User', UserSchema);
