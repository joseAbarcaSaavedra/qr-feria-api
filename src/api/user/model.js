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
  birthDate: {
    type: Date
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
  },
  backoffice: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

const model = mongoose.model('User', userSchema)

export const schema = model.schema
export default model
