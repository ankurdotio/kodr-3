import { body, validationResult } from "express-validator"

export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "Validation error",
            success: false,
            errors: errors.array(),
        })
    }
    next();
}


export const registerValidation = [
    body("username")
        .notEmpty().withMessage("Username is required")
        .isString().withMessage("Username must be a string")
        .isLength({ min: 3, max: 15 }).withMessage("Username must be between 3 and 15 characters"),
    body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format"),
    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
        .custom((value) => {
            const hasUpperCase = /[A-Z]/.test(value);
            const hasLowerCase = /[a-z]/.test(value);
            const hasDigit = /\d/.test(value);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

            if (!hasUpperCase || !hasLowerCase || !hasDigit || !hasSpecialChar) {
                throw new Error("Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character");
            }
            return true;
        }),
    body("fullname")
        .notEmpty().withMessage("Full name is required")
        .isString().withMessage("Full name must be a string")
        .isLength({ min: 3, max: 50 }).withMessage("Full name must be between 3 and 50 characters"),

    validate,
]