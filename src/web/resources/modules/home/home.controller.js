import config from '../../../../config';
const phone = config.app.phone;

export default {
    async index(req, res, next) {
        return res.render("home",{
            user:JSON.parse(JSON.stringify(req.user)),
            phone:phone
        });
    },
    async registerProduct(req, res, next) {
        return res.render("register_product",{
            user:JSON.parse(JSON.stringify(req.user)),
            phone:phone
        });
    },
    async servicePage(req, res, next) {
        return res.render("book_service",{
            user:JSON.parse(JSON.stringify(req.user)),
            phone:phone
        });
    },
    async serviceDetail(req, res, next) {
        return res.render("service-details",{
            user:JSON.parse(JSON.stringify(req.user)),
            phone:phone
        });
    },
    async trackService(req, res, next) {
        return res.render("track-service",{
            user:JSON.parse(JSON.stringify(req.user)),
            phone:phone
        });
    },
    async payment(req, res, next) {
        return res.render("payment",{
            user:JSON.parse(JSON.stringify(req.user)),
            phone:phone
        });
    },
    async register(req, res, next) {
        return res.render("register", {
            layout: "auth/main"
        });

    },
    async login(req, res, next) {
        return res.render("login", {
            layout: "auth/main"
        });

    },
    async forgotpassword(req, res, next) {
        return res.render("forgotpassword", {
            layout: "auth/main"
        });

    },
    async resetPassword(req, res, next) {
        var token = req.params.token;
        return res.render("reset-password", {
            layout: "auth/main",
            token
        });
    },
    async emailVerify(req, res, next) {
        var token = req.params.token;
        return res.render("accountVerified", {
            layout: "auth/main",
            token
        });
    },
    async verifyAccount(req, res, next) {
        return res.render("acount-email-verify", {
            layout: "auth/main"
        });
    },
}