const {
    MongoClient,
    ObjectID
} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        throw new Error ('Unable to connect to mongodb server');
        //return console.error('Unable to connect to mongodb server');
    }

    // delete many
    /*
    db.collection('Todos').deleteMany({
        text: 'Learn reactjs'
    })
    .then(result => {
        console.log(result);
    });
    */

    // delete one
    /*
    db.collection('Todos').deleteOne({
        text: 'learn reactjs'
    })
    .then(result => {
        console.log(result);
    });
    */

    // find and delete
    /*
    db.collection('Todos').findOneAndDelete({
        completed: false
    })
    .then(result => {
        console.log(result);
    });
    */

    /*
    db.collection('Users').deleteMany({
        name: 'Bogdan'
    })
    .then(result => {
        console.log(result)
    });
    */

    db.collection('Users').findOneAndDelete({
        _id: new ObjectID('5a11ed2d3c55d8a5fdc79bef')
    })
    .then(result => {
        console.log(result)
    });



    db.close();
});

