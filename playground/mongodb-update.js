const {
    MongoClient,
    ObjectID
} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        throw new Error ('Unable to connect to mongodb server');
        //return console.error('Unable to connect to mongodb server');
    }

    /*
    db.collection('Todos').findOneAndUpdate(
        {
            _id: new ObjectID('5a11e7e890c520a4494a5a2c')
        },
        {
            $set: {
                completed: true
            }
        },
        {
            returnOriginal: false
        }
    )
    .then(result => {
        console.log(result);
    })
    */

    /*
    db.collection('Users').findOneAndUpdate(
        {
            _id: new ObjectID('5a1afccd2ca7aff68b7dbd4b')
        },
        {
            $set: {
                name: 'Bögdän'
            }
        },
        {
            returnOriginal: false
        }
    ).then(result => {
        console.log(result);
    })
    .catch(err => {
        console.log('Unable to update user name', err);
    })
    */


    db.collection('Users').findOneAndUpdate(
        {
            _id: new ObjectID('5a1afccd2ca7aff68b7dbd4b')
        },
        {
            $inc: {
                age: 1
            }
        },
        {
            returnOriginal: false
        }
    ).then(result => {
        console.log(result);
    });


    db.close();
});

