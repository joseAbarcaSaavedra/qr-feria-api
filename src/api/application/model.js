import mongoose, { Schema } from 'mongoose'

const applicationSchema = new Schema({
  scan: {
    type: Schema.Types.ObjectId,
    ref: 'Scan',
    required: true
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  position: {
    type: Schema.Types.ObjectId,
    ref: 'Position',
    required: true
  },
  comment: {
    type: String
  },
  evaluation: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
})

const model = mongoose.model('Application', applicationSchema)

export const schema = model.schema
export default model
