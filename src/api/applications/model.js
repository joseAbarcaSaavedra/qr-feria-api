import mongoose, { Schema } from 'mongoose'

const applicationsSchema = new Schema({
  applicant: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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
  cvUrl: {
    type: String,
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

const model = mongoose.model('Applications', applicationsSchema)

export const schema = model.schema
export default model
