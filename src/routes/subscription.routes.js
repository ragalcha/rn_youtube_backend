import { Router } from "express";
import {
    createSubscription,
    editSubscription,
    deleteSubscription,
    getAllSubscriptions
} from "../controller/subscription.controller.js";

const router = Router();

router.post("/create", createSubscription);
router.put("/update/:id", editSubscription);
router.delete("/delete/:id", deleteSubscription);
router.get("/subscriptions", getAllSubscriptions);

export default router;

