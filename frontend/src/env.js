const dotenv = require('dotenv');
const path = require('path');

// Load the environment variables from local.env
const result = dotenv.config({ path: path.join(__dirname, '../../../local.env') });

if (result.error) {
    throw result.error;
}

module.exports = {
    BACKEND_HOST: process.env.BACKEND_HOST,
};