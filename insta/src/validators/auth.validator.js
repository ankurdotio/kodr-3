import { body, validationResult } from "express-validator";

function validate(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
            success: false,
        })
    }
    
    next()
}

export const registerValidationRules = [
    body("username")
        .notEmpty().withMessage("Username is required")
        .isString().withMessage("Username must be a string")
        .isLength({ min: 3, max: 15 }).withMessage("Username must be between 3 and 15 characters"),
    body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format"),
    body("fullname")
        .notEmpty().withMessage("Full name is required")
        .isString().withMessage("Full name must be a string")
        .isLength({ min: 3, max: 50 }).withMessage("Full name must be between 3 and 50 characters"),
    body("password")
        .notEmpty().withMessage("Password is required")
        .isString().withMessage("Password must be a string")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
        .matches(/\d/).withMessage("Password must contain at least one number")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
        .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
        .matches(/[@$!%*?&]/).withMessage("Password must contain at least one special character (@$!%*?&)"),

    validate
]