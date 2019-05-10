import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  lastName: {
    type: String
  },
  maidenName: {
    type: String
  },
  picture: {
    type: String
  },
  phone: {
    type: String
  },
  cvUrl: {
    type: String
  },
  gpsToken: {
    type: String
  },
  nppToken: {
    type: String
  },
  communityId: {
    type: Number
  },
  gpsId: {
    type: Number
  },
  role: {
    type: String,
    enum: ['applicant', 'officer', 'company', 'backoffice'],
    index: true,
    required: true
  },
  email: {
    type: String,
    index: true,
    required: true
  },
  password: {
    type: String
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
})

const model = mongoose.model('User', userSchema)

export const schema = model.schema
export default model
