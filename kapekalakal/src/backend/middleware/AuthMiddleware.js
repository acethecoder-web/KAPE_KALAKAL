import jwt from 'jsonwebtoken';
import Accounts from '../models/registeracc.model.js';

export const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
        try {
            const token = authHeader.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await Accounts.findById(decoded.id).select("-password");
            next();
        } catch (error) {
            res.status(401).json({
                message: "Not authorized, token failed"
            });
        }
    } else {
        res.status(401).json({
            message: "No token, authorization denied"
        });
    }
};