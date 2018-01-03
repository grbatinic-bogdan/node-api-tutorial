const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');

const userOneId = new ObjectId();
const userTwoId = new ObjectId();
const users = [
    {
        _id: userOneId,
        email: 'bogdan@email.com',
        password: 'bogdanpassword',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({
                    _id: userOneId.toHexString(),
                    access: 'auth'
                }, process.env.JWT_SECRET).toString()
            }
        ]
    },
    {
        _id: userTwoId,
        email: 'usertwo@email.com',
        password: 'userTwoPass',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({
                    _id: userTwoId.toHexString(),
                    access: 'auth'
                }, process.env.JWT_SECRET).toString()
            }
        ]
    }
];

const todos = [
    {
        _id: new ObjectId(),
        text: 'First test todo',
        _creator: userOneId
    },
    {
        _id: new ObjectId(),
        text: 'Second test todo',
        completed: true,
        completedAt: 123,
        _creator: userTwoId
    }
];

const populateUsers = (done) => {
    User.remove({})
        .then(() => {
            const userPromises = users.map(userObject => {
                return new User(userObject).save();
            });
            return Promise.all(userPromises)
                .then(() => done());
        });
};

const populateTodos = (done) => {
    Todo.remove({})
        .then(() => {
            return Todo.insertMany(todos);

        })
        .then(() => done());
}

module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
}
