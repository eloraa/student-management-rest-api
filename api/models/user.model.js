const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const APIError = require('../errors/api-error');
const httpStatus = require('http-status');


const roles = ['student', 'teacher', 'admin']

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 3,
        index: true,
        trim: true
    },
    email: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
      },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 128
    },
    class: {
        type: Number,
        required: true,
        maxlength: 2
    },
    roll: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        enum: roles,
        default: 'student'
    }
}, {
    timestamps: true,
})

userSchema.pre('save', async function save(next) {
    try {
      const rounds = 10;
  
      const hash = await bcrypt.hash(this.password, rounds);
      this.password = hash;
  
      return next();
    } catch (error) {
      return next(error);
    }
  });
/**
 * Methods
 */
 userSchema.method({
    transform() {
      const transformed = {};
      const fields = ['id', 'name', 'email', 'class', 'roll', 'role', 'createdAt'];
  
      fields.forEach((field) => {
        transformed[field] = this[field];
      });
  
      return transformed;
    }
})

userSchema.statics = {
    async get(id) {
      let user;
  
      if (mongoose.Types.ObjectId.isValid(id)) {
        user = await this.findById(id).exec();
      }
      if (user) {
        return user;
      }
  
      throw new APIError({
        message: 'User does not exist',
        status: httpStatus.NOT_FOUND,
      });
    },
    checkDuplicateEmail(error) {
        console.log(error.name)
        if (error.name === 'MongoError' && error.code === 11000) {
          return new APIError({
            message: 'Validation Error',
            errors: [{
              field: 'email',
              location: 'body',
              messages: ['"email" already exists'],
            }],
            status: httpStatus.CONFLICT,
            isPublic: true,
            stack: error.stack,
          });
        }
        return error;
      }
}

module.exports = mongoose.model('User', userSchema);