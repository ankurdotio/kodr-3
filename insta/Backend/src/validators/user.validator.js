import { param, validationResult } from "express-validator";
import { validate } from "./auth.validator.js";

export const validateFollowUser = [
    param("userId")
        .notEmpty().withMessage("User ID is required")
        .isMongoId().withMessage("Invalid User ID format"),
    validate
]