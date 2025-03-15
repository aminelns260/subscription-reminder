import { Router } from "express";
import { createSubscription, GetAllUserSubscriptions } from "../controllers/subscription.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const subscriptionRouter = Router();

subscriptionRouter.get('/', (req, res) => res.send( { title: 'Get all subscriptions' } ));

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/:id', (req, res) => res.send( { title: 'Update subscription' } ));

subscriptionRouter.delete('/:id', (req, res) => res.send( { title: 'Delete subscription' } ));

subscriptionRouter.get('/user/:id', authorize, GetAllUserSubscriptions);

subscriptionRouter.put('/:id/cancel', (req, res) => res.send( { title: 'Cancel subscriptions' } ));

subscriptionRouter.get('/upcoming-renewals', (req, res) => res.send( { title: 'Get upcoming renewals' } ));

subscriptionRouter.get('/:id', (req, res) => res.send( { title: 'Get subscription details' } ));

export default subscriptionRouter;