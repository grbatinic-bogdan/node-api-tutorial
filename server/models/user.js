const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        /*
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not valid email'
        }
        */
        validate: {
            validator: (value) => {
                return new Promise((resolve, reject) => {
                    resolve(validator.isEmail(value));
                })
            },
            message: '{VALUE} is not valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

module.exports = {
    User
};