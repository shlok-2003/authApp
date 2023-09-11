import express from "express";
import { login, signup } from "../controllers/user.js"
import { auth, isStudent, isAdmin } from "../middlewares/user.js";

const router = express.Router();

//* Routing
router.post('/signup', signup);
router.post('/login', login);

router.get('/test', auth, (req, res) => {
    res.json({
        success: true,
        message: 'This is the protected test route',
    });
});

router.get('/student', auth, isStudent, (req, res) => {
    res.json({
        success: true,
        message: 'This is the protected student route',
    });
});

router.get('/admin', auth, isAdmin, (req, res) => {
    res.json({
        success: true,
        message: 'This is the protected admin route',
    });
});

export default router;