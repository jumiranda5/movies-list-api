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
    type: Number,
    default: Date.now()
  }
});

const Notification = mongoose.model('Notification', NotificationsSchema);
export default Notification;

// ttl (on createdAt) : index: { expireAfterSeconds: 365 * 24 * 60 * 60 * 1000 } // 1 year

/*

Remove notifications after a year:

You can give any Date with Javascript date

db.user_track.remove( { access_time : {"$lt" : new Date(year, month_0_indexed, day)} })
So for removing documents before 1 September 2013 your command should be

db.user_track.remove( { access_time : {"$lt" : new Date(2013, 8, 1) } })
September is the 9th month but the month field is zero indexed. So we make that as 8.

*/
