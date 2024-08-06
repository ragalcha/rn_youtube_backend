import { Router } from "express";
import {
	createUserRoles,
    editUserRoles,
    deleteUserRoles,
    getAllRoles
} from "../controller/userroles.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create").post(createUserRoles);

// Edit UserRoles
router.put('/update/:id', editUserRoles);

// Delete UserRoles
router.delete('/delete/:id', deleteUserRoles);


router.get('/userroles',getAllRoles);

export default router;
