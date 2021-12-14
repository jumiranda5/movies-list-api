import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  google_id: {
    type: String,
    trim: true,
    unique: true,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minlength: 3
  },
  name: {
    type: String,
    default: '',
    trim: true
  },
  avatar: {
    type: String,
    default: ''
  },
  sid : {
    type: String,
    default: '',
    trim: true
  },
  seen_notifications: {
    type: Date,
    default: Date.now(),
  },
  fcm_token: {
    type: String,
    default: ''
  },
  isPrivate:{
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  }
});

UserSchema.set('timestamps', true);

const User = mongoose.model('User', UserSchema);
export default User;
