import mongoose, { Schema } from 'mongoose'

const sessionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  jwt: {
    type: String,
    unique: true
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
})

const model = mongoose.model('Session', sessionSchema)

export const schema = model.schema
export default model
