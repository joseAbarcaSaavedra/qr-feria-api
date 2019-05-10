import mongoose, { Schema } from 'mongoose'

const folderSchema = new Schema({
  name: {
    type: String,
    required: true,
    lowerCase: true
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  key: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
})

const model = mongoose.model('Folder', folderSchema)

export const schema = model.schema
export default model
