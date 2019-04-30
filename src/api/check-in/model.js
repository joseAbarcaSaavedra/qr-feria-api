import mongoose, { Schema } from 'mongoose'

const checkInSchema = new Schema({
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
  officer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cvUrl: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
})

const model = mongoose.model('CheckIn', checkInSchema)

export const schema = model.schema
export default model
