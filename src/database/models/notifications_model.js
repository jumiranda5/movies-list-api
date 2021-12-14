import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const NotificationsSchema = new Schema({
  type: {
    type: String, // follow, like, comment
    required: true
  },
  from: {
    type: String,
    required: true,
    index: true
  },
  to: {
    type: String, // user, post, comment
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  }
});

const Notification = mongoose.model('Notification', NotificationsSchema);
export default Notification;
