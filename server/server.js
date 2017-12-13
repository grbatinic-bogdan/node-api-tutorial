require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
const _ = require('lodash');

const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();
const port = process.env.PORT;

const { mongoose } = require('./db/mongoose');

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
        .then(newUser => {
            res.send(newUser);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

app.listen(port, () => {
    console.log(`server is up and running on port ${port}`);
});

module.exports = {
    app
};