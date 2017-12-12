const { ObjectId } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

/*
Todo.remove({})
    .then(result => {
        console.log(result);
    })
*/

Todo.findOneAndRemove({
    _id: '5a2fe12bc89b0906b6441d50'
})
.then(todo => {
    console.log(todo);
})
/*
Todo.findByIdAndRemove('5a2fe12bc89b0906b6441d50')
    .then(todo => {
        console.log(todo);
    })
*/
