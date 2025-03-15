import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const authorize = async (req, res, next) => {
    try {
        let token;

        // Vérification de la présence du token dans l'en-tête Authorization
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if(! token) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        // Vérification et décodage du token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Récupération de l'utilisateur correspondant au token
        const user = await User.findById(decoded.userId)

        if(! user) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        
        req.user = user; // Stockage de l'utilisateur dans l'objet req

        next()
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized', error: error.message })
    }
}

export default authorize;