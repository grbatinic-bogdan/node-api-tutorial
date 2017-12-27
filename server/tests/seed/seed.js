const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');


const todos = [
    {
        _id: new ObjectId(),
        text: 'First test todo'
    },
    {
        _id: new ObjectId(),
        text: 'Second test todo',
        completed: true,
        completedAt: 123
    }
];

const userOneId = new ObjectId();
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
                }, 'mySuperSecret').toString()
            }
        ]
    },
    {
        _id: new ObjectId(),
        email: 'usertwo@email.com',
        password: 'userTwoPass',
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
