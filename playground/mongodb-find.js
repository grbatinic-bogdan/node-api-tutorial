const {
    MongoClient,
    ObjectID
} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        throw new Error ('Unable to connect to mongodb server');
        //return console.error('Unable to connect to mongodb server');
    }

    console.log('Connected to mongodb server');

    /*
    db.collection('Todos').find({
        _id: new ObjectID('5a1ae2682ca7aff68b7dbabb')
    }).toArray()
        .then(todos => {
            console.log(todos);
        })
        .catch(err => {
            console.log('Unable to fetch todos', todos);
        })
    */

    /*
    db.collection('Todos').count()
        .then(todosCount => {
            console.log(todosCount);
        })
        .catch(err => {
            console.log('Unable to fetch todos', todos);
        })
    */

    db.collection('Users').find({name: 'Bogdan'}).toArray()
        .then(users => {
            console.log(users)
        })
        .catch(err => {
            console.log('Unable to return users', err);
        })


    db.close();
});

