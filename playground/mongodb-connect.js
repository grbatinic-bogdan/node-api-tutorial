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
    db.collection('Todos')
        .insertOne({
            text: 'Something happened',
            completed: false
        }, (err, result) => {
            if (err) {
                console.error(err);
                throw new Error('Unable to insert todo');
            }

            console.log(JSON.stringify(result.ops, undefined, 2));
        });
    */

    /*
    db.collection('Users')
        .insertOne({
            name: 'Bogdan',
            age: 30,
            location: 'Espoo'
        }, (err, result) => {
            if (err) {
                throw new Error('Unable to insert user');
            }

            console.log(result.ops[0]._id.getTimestamp());
            // console.log(JSON.stringify(result.ops, undefined, 2));
        });
    */

    db.close();
});

