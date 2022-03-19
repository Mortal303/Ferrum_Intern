import express from 'express';
import logger from 'morgan';
import path from 'path';
import passport from 'passport';
import session from 'express-session';
import bodyParser from 'body-parser';
import exphbs from 'express-handlebars';
import cookieParser from 'cookie-parser';
import expressSanitizer from 'express-sanitizer';
import helmet from 'helmet';
const kue = require("kue");

export default {
    setup: (config, defaultLayout) => {
        const app = express();

        // var accessLogStream = rfs('access.log', {
        //     interval: '1d',
        //     path: path.join(__dirname, '..', 'log')
        // })

        // app.use(logger(config.app.log, { stream: accessLogStream }));

        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json({ limit: '50mb' }));

        app.use(cookieParser(config.app.secret));
        app.use(session({ secret: config.app.secret, resave: true, saveUninitialized: true }));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(expressSanitizer());
        app.use("/static", express.static(path.join(__dirname, 'public')));
        app.use(helmet());
        app.use(helmet.hsts({
            maxAge: 0
        }))
        app.set('views', path.join(__dirname, 'web', 'resources', 'views', 'layouts'));
        app.engine('hbs', exphbs({
            extname: '.hbs',
            defaultLayout: defaultLayout,
            partialsDir: path.join(__dirname, 'web', 'resources', 'views', 'partials'),
            layoutsDir: path.join(__dirname, 'web', 'resources', 'views', 'layouts'),
            helpers: {
                block: function(name) {
                    var blocks = this._blocks,
                        content = blocks && blocks[name];

                    return content ? content.join('\n') : null;
                },
                contentFor: function(name, options) {
                    var blocks = this._blocks || (this._blocks = {}),
                        block = blocks[name] || (blocks[name] = []);

                    block.push(options.fn(this));
                },
                if: function(name, options) {
                    if (name) {
                        return options.fn(this);
                    } else {
                        return options.inverse(this);
                    }
                }
            }
        }));
        app.set('view engine', '.hbs');

        app.use("/kue",kue.app);

        Number.prototype.pad = function(size) {
            var s = String(this);
            while (s.length < (size || 2)) { s = "0" + s; }
            return s;
        }

        return app;
    }
}