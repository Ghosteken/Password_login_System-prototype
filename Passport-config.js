    // const passport = require('passport')
    // const bcrypt = require('bcrypt');
    // const LocalStrategy = require('passport-local').Strategy
    // function initialize(passport,getUserById,getUserByEmail) {
    //     const authenticateUser = async (email, password, done) => {
    //         const user = getUserByEmail(email)
    //         if (user == null) {
    //             return done(null, false, { message: 'No user with that email' })
    //         }
    //         try {
    //             if (await bcrypt.compare(password, user.password)) {
    //                 return done(null, user)
    //             } else {
    //                 return done(null, false, { message: 'password mismatch or incorrect' })
    //             }
    //         } catch (e) {
    //             return done(e)

    //         }
    //     }
    //     passport.use(new LocalStrategy({ usenameField: 'email' }, authenticateUser))
    //     //serialize as single id
    //     passport.serializeUser((user, done) => done(null,user.id))
    //     passport.deserializeUser((user, done) =>{ 
            
    //     return done(null,getUserById(id))
    // })
    // }

    // module.exports = initialize

    const passport = require('passport');
    const bcrypt = require('bcrypt');
    const LocalStrategy = require('passport-local').Strategy;
    
    function initialize(passport, getUserById, getUserByEmail) {
        const authenticateUser = async (email, password, done) => {
            const user = getUserByEmail(email);
            if (user == null) {
                return done(null, false, { message: 'No user with that email' });
            }
            try {
                if (await bcrypt.compare(password, user.password)) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Password mismatch or incorrect' });
                }
            } catch (e) {
                return done(e);
            }
        };
    
        passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
        
        passport.serializeUser((user, done) => {
            done(null, user.id);
        });
    
        passport.deserializeUser((id, done) => {
            const user = getUserById(id);
            done(null, user);
        });
    }
    
    module.exports = initialize;
    