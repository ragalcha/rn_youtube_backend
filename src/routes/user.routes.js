import { Router } from "express";
import {
	registerUser,
	loginUser,
	logoutUser,
	getUserBYId,
	updateUser,
	getAllCustomers,
	deleteUser
} from "../controller/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route('/user/:id').get(verifyJWT, getUserBYId);
router.route('/update/:id').put(verifyJWT, updateUser);
router.get("/users", verifyJWT, getAllCustomers); // Fetch all customers
router.delete('/delete/:id', deleteUser);

export default router;
