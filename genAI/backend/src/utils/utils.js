import jwt from 'jsonwebtoken';
import config from '../config/config.js';


export function generateJWT(data) {
    const token = jwt.sign(data, config.JWT_SECRET, {
        expiresIn: "3d",
    })
    return token;
}