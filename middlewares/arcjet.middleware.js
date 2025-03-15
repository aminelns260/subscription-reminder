import { aj } from "../config/arcjet.js"

const arcjetMiddleware = async (req, res, next) => {
    try {
        // Vérification de la requête avec Arcjet
        const decision = await aj.protect(req, { requested: 1 });

        if(decision.isDenied()) {
            if(decision.reason.isRateLimit()) {
                res.status(429).json({ error: 'Rate limit exceeded' });
            }

            if(decision.reason.isBot()) {
                res.status(403).json({ error: 'Bot detected' });
            }

            res.status(403).json({ error: 'Access denied' });
        }
        
        next();
    } catch (error) {
        console.log(`Arcjet Middleware Error: ${error}`);
        next(error)
    }
}

export default arcjetMiddleware;