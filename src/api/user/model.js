import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema(
  {
    name: {
      type: String
    },
    role: {
      type: String
    },
    createdAt: {
      type: String
    },
    lastLogin: {
      type: String
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (obj, ret) => {
        delete ret._id
      }
    }
  }
)

userSchema.methods = {
  view(full) {
    const view = {
      // simple view
      id: this.id,
      name: this.name,
      role: this.role,
      createdAt: this.createdAt,
      lastLogin: this.lastLogin,
      updatedAt: this.updatedAt
    }

    return full
      ? {
          ...view
          // add properties for a full view
        }
      : view
  }
}

const model = mongoose.model('User', userSchema)

export const schema = model.schema
export default model

export const getUserByEmail = email => {
  mysql.query()
}
