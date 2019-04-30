import mongoose, { Schema } from 'mongoose'

const eventSchema = new Schema({
  name: {
    type: String,
    required: true,
    lowerCase: true
  },
  dateFrom: {
    type: Date
  },
  dateTo: {
    type: Date
  },
  offerId: {
    type: Number,
    required: true,
    unique: true
  },
  domainId: {
    type: Number,
    required: true
  },
  domain: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
})

const model = mongoose.model('Event', eventSchema)

export const schema = model.schema
export default model
