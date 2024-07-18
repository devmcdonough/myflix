const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Models = require('./models'),
    passportJWT = require('passport-jwt');

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

/**
 * Local strategy for user authentication using username and password.
 * @function
 * @param {string} usernameField - The field name for the username.
 * @param {string} passwordField - The field name for the password.
 * @param {function} callback - The callback function to be called after authentication.
 */
passport.use(
    new LocalStrategy(
        {
            usernameField: 'Username',
            passwordField: 'Password',
        },
        async (username, password, callback) => {
            await Users.findOne({ Username: username })
                .then((user) => {
                    if (!user) {
                        console.log('Incorrect username');
                        return callback(null, false, {
                            message: 'Incorrect username or password.',
                        });
                    }
                    // Hashes password entered by user when logging in
                    if (!user.validatePassword(password)) {
                        console.log('incorrect password');
                        return callback(null, false, { message: 'incorrect password.' });
                    }
                    return callback(null, user);
                })
                .catch((error) => {
                    if (error) {
                        console.log(error);
                        return callback(error);
                    }
                });
        }
    )
);

/**
 * JWT strategy for user authentication using JWT.
 * @function
 * @param {Object} options - The options for the JWT strategy.
 * @param {function} callback - The callback function to be called after authentication.
 */
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
}, async (jwtPayload, callback) => {
    return await Users.findById(jwtPayload._id)
        .then((user) => {
            return callback(null, user);
        })
        .catch((error) => {
            return callback(error);
        });
}));
