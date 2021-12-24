import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const NotificationsSchema = new Schema({
  type: {
    type: String, // follow, like, comment, comment_response
    required: true
  },
  sender_id: {
    type: String,
    required: true
  },
  sender_username: {
    type: String,
    required: true
  },
  target_type: {
    type: String, // user || post || comment
    default: ""
  },
  target_user_id: {
    type: String, // user id
    required: true,
    index: true
  },
  target_id: {
    type: String, // user id, post id, comment id
    required: true
  },
  seen: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    index: { expires: 365 * 24 * 60 * 60 * 1000 } // 1 year
  }
});

const Notification = mongoose.model('Notification', NotificationsSchema);
export default Notification;
