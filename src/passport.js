import passport from 'passport';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';

import config from './config';
import { db } from './models';

var TokenExtractor = function(req){
    var token = null;
    if (req && req.cookies){
        token = req.cookies['XSRF-token'];
    }
    return token;
}


// JSON WEB TOKENS STRATEGY
passport.use(new JwtStrategy({
    jwtFromRequest : TokenExtractor,
    secretOrKey : config.app.secret,
}, async (payload, done) => {
    try{
        const user = await db.Users.findById(payload.sub);
        const tokenDate = new Date(payload.iat);
        if(user.loggedOutAt != null && (tokenDate.getTime() - user.loggedOutAt.getTime()) < 0){
            return done('invalid', false);
        }

        if(new Date(payload.exp) < new Date()){            
            return done('expired', false);
        }

        if(!user){
            return done('user', false);
        }

        done(null, user);
    }catch(error){
        done(error, false);
    }
}));

// LOCAL STRATEGY
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try{
        const user = await db.User.findOne({where: {email: email}, attributes: ['id', 'firstname', 'lastname', 'email', 'password', 'attempt', 'loggedOutAt', 'status', 'valid', 'createdAt']});
        if(!user){
            return done(null, false);
        }

        if(user.attempt == 5){
            return done('attempt', false);
        }
        
        var isMatch = await user.comparePassword(password)
        if(!isMatch){
            user.update({ attempt: user.attempt+1 })
            return done('attempt:'+(5 - user.attempt), false);
        }else{
            user.update({ attempt: 0 })
        }

        if(!user.valid){
            return done('invalid', false);
        }

        done(null, user);
    }catch(error){
        done(error, false);
    }
}));