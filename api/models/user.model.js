const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');


const roles = ['student', 'teacher', 'admin']

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 128,
        index: true,
        trim: true
    },
    email: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
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

module.exports = mongoose.model('User', userSchema);