import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const DevMessageSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    default: '',
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String
  },
  createdAt: {
    type: Number,
    default: Date.now()
  }
});

const DevMessage = mongoose.model('DevMessage', DevMessageSchema);
export default DevMessage;
