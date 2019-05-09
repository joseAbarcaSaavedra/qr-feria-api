import mongoose, { Schema } from 'mongoose'
/**
 * No necesariamente los applicant  ingresados acá corresponden a applicants que iniciaron sesión,
 * ya que tambien pueden llegar con el código QR del CV por lo que no tendran un user en Mongo
 */
const scanSchema = new Schema({
  applicant: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['check-in', 'application'],
    index: true,
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
  createdAt: {
    type: Date,
    default: new Date()
  }
})

const model = mongoose.model('Scan', scanSchema)

export const schema = model.schema
export default model
