const { ObjectId } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

/*
const id = '5a2427bcf1ae5d33cc72512ca';

if (!ObjectId.isValid(id)) {
    console.log('id is not valid');
}

/*
Todo.find({
    _id: id
})
   .then((todo) => {
       console.log(todo);
   })
   .catch(err => {
       console.error(err.message);
   });

Todo.findOne({
     _id: id
})
    .then((todo) => {
        console.log(todo);
    })
    .catch(err => {
        console.error(err.message);
    });


Todo.findById(id)
    .then((todo) => {
        console.log(todo)
    })
    .catch(err => {
        console.error(err.message);
    });
*/
const userId = '5a240b2a8b42b02820013a06';

User.findById(userId)
    .then(user => {
        console.log(user);
    })
    .catch(err => {
        console.log('user not found', err.message);
    })
