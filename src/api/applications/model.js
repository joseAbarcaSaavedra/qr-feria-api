import mongoose, { Schema } from 'mongoose'
/**
 * No necesariamente los applicant  ingresados acá corresponden a applicants que iniciaron sesión,
 * ya que tambien pueden llegar con el código QR del CV por lo que no tendran un user en Mongo
 */
const applicationsSchema = new Schema({
  applicant: {
    gpsId: {
      type: Number
    },
    comunityId: {
      type: Number
    },
    email: {
      type: String,
      required: true
    },
    cvUrl: {
      type: String,
      required: true
    }
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
