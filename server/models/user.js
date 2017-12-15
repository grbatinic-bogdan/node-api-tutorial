const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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
    },
};

UserSchema.statics = {
    findByToken: function(token) {
        // const User = this;
        const secret = 'mySuperSecret';
        let decoded = undefined;
        try {
            decoded = jwt.verify(token, secret);
        } catch(err) {
            return Promise.reject('Unathorized');
        }

        return this.findOne({
            _id: decoded._id,
            'tokens.token': token,
            'tokens.access': 'auth'
        });
    }
};

UserSchema.pre('save', function(next) {
    const user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }

});

const User = mongoose.model('User', UserSchema);

module.exports = {
    User
};