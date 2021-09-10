const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const APIError = require('../errors/api-error');
const moment = require('moment-timezone')
const jwt = require('jwt-simple')
const httpStatus = require('http-status');
const { jwtSecret, jwtExpirationInterval } = require('../../config/vars');


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

userSchema.index({
    class: 1,
    roll: 1
}, {
    unique: true,
    background: false
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


userSchema.method({
    transform() {
        const transformed = {};
        const fields = ['id', 'name', 'email', 'class', 'roll', 'role', 'createdAt'];

        fields.forEach((field) => {
            transformed[field] = this[field];
        });

        return transformed;
    },
    token() {
      const payload = {
        exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
        iat: moment().unix(),
        sub: this._id,
      };
      return jwt.encode(payload, jwtSecret);
    },
    async passwordMatches(password) {
        return bcrypt.compare(password, this.password);
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

    async validateRoll(userData) {
        let error
        if (userData) {
            users = await this.find({class: userData.class}).exec();
        }
        if (users) {
            users.forEach(user => {
                if (userData.roll == user.roll) {
                    error =  new Error('"roll" cannot be same for same "class"')
                    throw new APIError({
                        message: 'Validation Error',
                        errors: [{
                            field: 'roll',
                            location: 'body',
                            messages: ['"roll" cannot be same for same "class"'],
                        }],
                        status: httpStatus.CONFLICT,
                        isPublic: true
                    });
            }
            })
        }
        return error;
    },
    checkDuplicateEmail(error) {
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
    },
    async findAndGenerateToken(options) {
        const { email, password, refreshObject } = options;
        if (!email) throw new APIError({ message: 'An email is required to generate a token' });
    
        const user = await this.findOne({ email }).exec();
        const err = {
          status: httpStatus.UNAUTHORIZED,
          isPublic: true,
        };
        if (password) {
          if (user && await user.passwordMatches(password)) {
            return { user, accessToken: user.token() };
          }
          err.message = 'Incorrect email or password';
        } else if (refreshObject && refreshObject.userEmail === email) {
          if (moment(refreshObject.expires).isBefore()) {
            err.message = 'Invalid refresh token.';
          } else {
            return { user, accessToken: user.token() };
          }
        } else {
          err.message = 'Incorrect email or refreshToken';
        }
        throw new APIError(err);
      },
}

module.exports = mongoose.model('User', userSchema);