require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();
const port = process.env.PORT;

const { mongoose } = require('./db/mongoose');

const { authenticate } = require('./middleware/authenticate');

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    const todo = new Todo({
        text: req.body.text
    });

    todo.save()
        .then(savedTodo => {
            res.send(savedTodo);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

app.get('/todos', (req, res) => {
    Todo.find({})
        .then(todos => {
            res.send({
                todos
            })
        })
        .catch(err => {
            res.status(400).send(err);
        })
});

app.get('/todos/:id', (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findById(id)
        .then(todo => {
            if (!todo) {
                return res.status(404).send();
            }
            res.send({
                todo
            });
        })
        .catch(err => {
            res.status(400).send();
        })
});

app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id)
        .then(todo => {
            if (!todo) {
                return res.status(404).send();
            }

            res.send({
                todo
            });
        })
        .catch(err => {
            res.status(400).send();
        })
});

app.patch('/todos/:id', (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(404).send();
    }

    const body = _.pick(req.body, ['text', 'completed']);

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
        .then(todo => {
            if (!todo) {
                return res.status(404).send();
            }

            return res.send({
                todo
            });
        })
        .catch(err => {
            res.status(400).send();
        });
});

app.post('/users', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User(body);
    user.save()
        .then(() => user.generateAuthToken())
        .then(token => {
            res.header('x-auth', token).send(user.toJSON());
        })
        .catch(err => {
            //console.log(err.toString());
            //res.status(400).send(err.toString());
            res.status(400).send();
        });
});



app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

// POST /users/login {email, password}
app.post('/users/login', (req, res) => {

    const {email, password} = req.body;

    const userPromise = User.findByCredentials(email, password);
    const tokenPromise = userPromise.then((user) => {
        return user.generateAuthToken()
                .then((token) => {
                    return Promise.resolve(token, user)
                })
    });

    Promise.all([userPromise, tokenPromise])
        .then((result) => {
            const user = result[0];
            const token = result[1];

            res.header('x-auth', token).send(user);
        })
        .catch((err) => {
            res.status(400).send();
        })
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token)
        .then(() => res.status(200).send())
        .catch(() => res.status(400).send());
})

app.listen(port, () => {
    console.log(`server is up and running on port ${port}`);
});

module.exports = {
    app
};