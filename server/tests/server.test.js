const expect = require('expect');
const request = require('supertest');
const { ObjectId } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

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

beforeEach((done) => {
    Todo.remove({})
        .then(() => {
            return Todo.insertMany(todos);

        })
        .then(() => done());

});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        const text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({text})
                    .then(todos => {
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text);
                        done();
                    })
                    .catch(err => done(err));
            });
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({

            })
            .expect(400)
            .end((err, res) => {
                Todo.find()
                    .then(todos => {
                        expect(todos.length).toBe(2);
                        done();
                    })
                    .catch(err => done(err));
            })
    });
})

describe('GET /todos', () => {
    it('should return all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return one todo', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);

    });

    it('should return 404 if not found', (done) => {
        const id = new ObjectId();
        request(app)
            .get(`/todos/${id.toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
            .get(`/todos/123`)
            .expect(404)
            .end((done));
    })
});

describe('DELETE /todos/:id', () => {
    it('should delete the todo', (done) => {
        const id = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo._id).toBe(id);
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                }

                Todo.findById(id)
                    .then(todo => {
                        expect(todo).toNotExist();
                        done();
                    })
                    .catch(err => {
                        done(error);
                    })
            })
    });

    it('should return 404 if todo does not exist', (done) => {
        const id = new ObjectId();
        request(app)
            .delete(`/todos/${id.toHexString()}`)
            .expect(404)
            .end(done)

    });

    it('should return 404 if todo is invalid', (done) => {
        request(app)
            .delete(`/todos/123`)
            .expect(404)
            .end((done));
    })
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        // grab id of first item
        const id = todos[0]._id.toHexString();
        const text = 'Updated first todo';
        request(app)
            // update text, set completed to true
            .patch(`/todos/${id}`)
            .send({
                text,
                completed: true,
            })
            // 200
            .expect(200)
            // text is changed, completed is true, completedAt is a number .toBeA
            .expect(res => {
                expect(res.body.todo.text).toEqual(text);
                expect(res.body.todo.completed).toEqual(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        // grab id of second item
        const id = todos[1]._id.toHexString();
        const text = 'Updated second test todo';
        request(app)
            // update text, set completed to false
            .patch(`/todos/${id}`)
            .send({
                text,
                completed: false
            })
            // 200
            .expect(200)
            .expect(res => {
                // text is changed, completed false, completedAt is null .toNotExist
                expect(res.body.todo.text).toEqual(text);
                expect(res.body.todo.completed).toEqual(false);
                expect(res.body.todo.completed).toNotExist();
            })
            .end(done);
    })
});

