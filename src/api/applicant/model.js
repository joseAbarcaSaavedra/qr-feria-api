import mongoose, { Schema } from 'mongoose'

const applicantSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    lowerCase: true
  },
  lastName: {
    type: String,
    required: true,
    lowerCase: true
  },
  identification: {
    type: String,
    required: true,
    lowerCase: true
  },
  identificationType: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowerCase: true
  },
  phone: {
    type: String,
    required: true,
    lowerCase: true
  },
  password: {
    type: String
  },
  id: {
    type: Number,
    required: true,
    unique: true
  },
  nppToken: {
    type: String,
    required: true,
    lowerCase: true
  },
  cvUrl: {
    type: String,
    required: true,
    lowerCase: true
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  updatedAt: {
    type: Date
  }
})

const model = mongoose.model('Applicant', applicantSchema)

export const schema = model.schema
export default model
