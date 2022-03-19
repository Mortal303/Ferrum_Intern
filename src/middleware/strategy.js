import passport from 'passport';
import JWT from 'jsonwebtoken';
import config from '../config';

export var JWTSign = function(user, date) {
    return JWT.sign({
        iss: config.app.name,
        sub: user.id,
        iat: date.getTime(),
        exp: new Date().setMinutes(date.getMinutes() + 30)
    }, config.app.secret);
}

export var jwtStrategy = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        let contype = req.headers['content-type'];
        var json = !(!contype || contype.indexOf('application/json') !== 0);
        if (err && err == 'expired') { return json ? res.status(500).json({ errors: ['Session is expired'] }) : res.redirect('/logout'); }
        if (err && err == 'invalid') { return json ? res.status(500).json({ errors: ['Invalid token recieved'] }) : res.redirect('/logout'); }
        if (err && err == 'user') { return json ? res.status(500).json({ errors: ['Invalid user recieved'] }) : res.redirect('/logout'); }
        if (err && Object.keys(err).length) { return res.status(500).json({ errors: [err] }); }
        if (err) { console.log(err); return res.status(500).json({ errors: ['Invalid user recieved'] }); }
        if (!user) { return json ? res.status(500).json({ errors: ['Invalid user recieved'] }) : res.redirect('/logout'); }

        //Update Token
        var date = new Date();
        var token = JWTSign(user, date);
        res.cookie('XSRF-token', token, {
            expire: new Date().setMinutes(date.getMinutes() + 30),
            httpOnly: true,
            secure: config.app.secure
        });

        req.user = user;
        next();
    })(req, res, next);
};

export var jwtLogoutStrategy = (req, res, next) => {
    // passport.authenticate('jwt', { session: false }, (err, user, info) => {
    //     if (user) {
    //         req.user = user;
    //     }
    //     next();
    // });
    // if (req.user) {
    //     req.user.update({ loggedOutAt: new Date() });
    // }
    res.clearCookie("XSRF-token");
    return res.redirect('/login');
};

export var localStrategy = (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err && err == 'invalid') { return res.status(500).json({ errors: ['Email Id not verified'] }); }
        if (err && err == 'attempt') { return res.status(500).json({ errors: ['Too many invalid attempts. Please reset your password.'] }); }
        if (err && err.startsWith('attempt:')) { return res.status(500).json({ errors: ['Invalid Credentials (' + err.split(':')[1] + ' Attempt(s) Left)'] }); }
        if (err) { return res.status(500).json({ errors: [err] }); }
        if (!user) { return res.status(500).json({ errors: ['Invalid Credentials'] }); }
        req.user = user;
        next();
    })(req, res, next);
};