const jwt = require("jsonwebtoken");
const BaseController = require("./BaseController");

class AdminAuthController extends BaseController {
    async login(req, res) {
        const { email: inputEmail, password: inputPassword } = req.body;

        if (!inputEmail || !inputPassword) {
            return this.sendErrorResponse(res, 400, "Email and password are required");
        }

        console.log("Admin login attempt:", { email: inputEmail, password: inputPassword });
        console.log("Admin credentials from environment:", {
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD
        });

        if (
            inputEmail !== process.env.ADMIN_EMAIL ||
            inputPassword !== process.env.ADMIN_PASSWORD
        ) {
            return this.sendErrorResponse(res, 403, "Invalid credentials");
        }

        const token = jwt.sign({ email: inputEmail }, process.env.JWT_SECRET, {
            expiresIn: "4d",
        });

        const user = {
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD
        };

        return this.sendResponse(res, 200, "Login successful", { token, user });
    }
}

module.exports = AdminAuthController;
