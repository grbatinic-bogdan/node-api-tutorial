const expect = require('expect');
const request = require('supertest');
const { ObjectId } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');

const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);


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

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        const authenticatedUser = users[0];
        request(app)
            .get('/users/me')
            .set('x-auth', authenticatedUser.tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body._id).toBe(authenticatedUser._id.toHexString());
                expect(res.body.email).toBe(authenticatedUser.email);
            })
            .end(done);
    });


    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect(res => {
                expect(res.body).toEqual({})
            })
            .end(done)
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        const email = 'newuser@email.com';
        const password = 'newuserpassword123';

        request(app)
            .post('/users')
            .send({
                email,
                password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                User.findOne({
                    email
                })
                .then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);

                    return done();
                })
            });
    });

    it('should return validation errors if request is invalid', (done) => {
        const invalidEmail = 'testemail@';
        const password = 'testpassword';

        request(app)
            .post('/users')
            .send({
                email: invalidEmail,
                password
            })
            .expect(400)
            .end(done);
    });


    it('should not create user if email is in use', (done) => {
        const existingEmail = users[0].email;
        const password = 'randompass123';

        request(app)
            .post('/users')
            .send({
                email: existingEmail,
                password
            })
            .expect(400)
            .end(done)
    });

});
