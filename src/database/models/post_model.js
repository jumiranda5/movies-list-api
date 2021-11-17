import mongoose from 'mongoose';
import Media from './media_model';

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  userId: {
    type: String,
    trim: true,
    required: true,
    index: true
  },
  post_type: {
    type: String, // reaction || top_10 || recomendations
    trim: true,
    required: true
  },
  media_type: {
    type: String, // movie or tv
    trim: true,
    required: true
  },
  title: Media,
  comment: {
    type: String
  },
  reaction: {
    type: String // emoji code
  },
  top_10: []
});

PostSchema.set('timestamps', true);

const Post = mongoose.model('Post', PostSchema);
export default Post;
