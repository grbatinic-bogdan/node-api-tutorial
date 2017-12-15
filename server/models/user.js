const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
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

UserSchema.methods = {
    generateAuthToken: function() {
        const access = 'auth';
        const secret = 'mySuperSecret';
        const token = jwt.sign({
            _id: this._id.toHexString(),
            access
        }, secret).toString();

        this.tokens.push({
            access,
            token
        });

        return this.save()
            .then(() => {
                return token;
            });
    },
    toJSON: function() {
        const userObject = this.toObject();
        return _.pick(userObject, ['_id', 'email']);
    }
};

const User = mongoose.model('User', UserSchema);

module.exports = {
    User
};