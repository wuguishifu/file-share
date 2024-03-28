const bcrypt = require('bcryptjs');
const args = require('minimist')(process.argv.slice(2));
const { v4 } = require('uuid');

if (!args.username || !args.password) {
    console.error('Usage: node generate-user.js --username <username> --password <password>');
    process.exit(1);
}

const username = args.username;
const password = args.password;

bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }

    const userDoc = {
        id: v4(),
        password: hash,
    };

    console.log(`"${username}": ${JSON.stringify(userDoc, null, 4)}`);
});
