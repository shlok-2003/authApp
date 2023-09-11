import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const auth = async(req, res, next) => {
    try {
        //? console.log(req.cookies.token);
        //? console.log(req.header("Authorization"));
        //? console.log(req.body.token);

        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ", "");
        
        if(!token || token == undefined) {
            return res.status(401).json({
                success: false,
                message: 'Access token not found',
            });
        }

        try {
            const payload = await jsonwebtoken.verify(token, process.env.JWT_SECRET);
            console.log(payload);

            req.user = payload;
            next();     //* to the next middleware
        }
        catch(err) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token',
            });
        }
    }
    catch(err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export const isAdmin = async(req, res, next) => {
    try {
        if(req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: 'User is not an admin',
            });
        }

        next();
    }
    catch(err) {
        res.status(500).json({
            success: false,
            message: 'User is not an admin',
        });
    }
}

export const isStudent = async (req, res, next) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({
                success: false,
                message: 'User is not an student',
            });
        }

        next();
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'User is not an student',
        });
    }
};