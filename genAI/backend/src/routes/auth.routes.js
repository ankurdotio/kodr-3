import { Router } from 'express';
import passport from 'passport';

const authRouter = Router();


authRouter.get("/google",
    passport.authenticate('google', {
        session: false,
        scope: [ 'profile', 'email' ]
    }));

authRouter.get("/google/callback", passport.authenticate('google',
    {
        session: false,
        failureRedirect: '/'
    }),
    (req, res) => {
        // Successful authentication, redirect or respond as needed
        res.json({
            message: "Google authentication successful",
            user: req.user
        });
    });


export default authRouter;