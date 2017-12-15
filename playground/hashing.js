const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const password = '123abc!';

bcrypt.genSalt(10, (error, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    })
});

const hashedPassword = '$2a$10$7vGdq4PvFDfMljd9mzXrsuXxAajakokp1YiPUP5T.fzqQa6A..8cW';

bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
});

/*
const message = 'whatup?';

const hash = SHA256(message).toString();
console.log(hash);

const data = {
    id: 4,
}

const salt = 'mysecretsalt';

const token = {
    data,
    hash: SHA256(JSON.stringify(data) + salt).toString()
};


// try to trick out the system
token.data.id = 5;
token.hash = SHA256(JSON.stringify(token.data)).toString();

console.log(token);

const resultHash = SHA256(JSON.stringify(token.data)).toString();

if (resultHash === token.hash) {
    console.log('data was not changed');
} else {
    console.log('data was changed');
}
*/

/*
const salt = 'mysecretsalt';

const data = {
    id: 10
};

const token = jwt.sign(data, salt);
console.log(token);

console.log(jwt.verify(token, salt));
*/