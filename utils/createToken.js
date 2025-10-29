const jwt = require('jsonwebtoken');

// eslint-disable-next-line arrow-body-style
const createToken = (payload) => {
    return jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

module.exports = createToken;