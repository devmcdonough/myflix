const jwtSecret = 'your_jwt_secret'; // This has to be the same key used in JWTStrategy in passport.js

const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport'); // The local passport file

/**
 * Generates a JWT token for a user.
 * @param {Object} user - The user object.
 * @returns {string} The generated JWT token.
 */
let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username, // This is the username you are encoding in the JWT
        expiresIn: '7d', // This says the token will expire in 7 days
        algorithm: 'HS256' // This is used to "sign" or encode the values of the JWT
    });
}

/**
 * POST login route to authenticate a user.
 * @param {Object} router - The router object.
 */
module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false }, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something went wrong',
                    user: user
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({ user, token });
            });
        })(req, res);
    });
}
