import { Router } from 'express';
import passport from 'passport';
import { googleAuthCallback } from '../controllers/auth.controller.js';

const authRouter = Router();


authRouter.get("/google",
    passport.authenticate('google', {
        session: false,
        scope: [ 'profile', 'email' ]
    })
);

authRouter.get("/google/callback", passport.authenticate('google',
    {
        session: false,
        failureRedirect: '/'
    }),
    googleAuthCallback
);


export default authRouter;