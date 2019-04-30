import mongoose, { Schema } from 'mongoose'

const positionSchema = new Schema({
  name: {
    type: String,
    required: true,
    lowercase: true
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
  createdAt: {
    type: Date,
    default: new Date()
  }
})

const model = mongoose.model('Position', positionSchema)

export const schema = model.schema
export default model
