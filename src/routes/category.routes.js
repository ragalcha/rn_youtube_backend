import { Router } from "express";
import {
	createCategory,
    editCategory,
    deleteCategory,
    getAllCategories
} from "../controller/category.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create").post(createCategory);

// Edit category
router.put('/update/:id', editCategory);

// Delete category
router.delete('/delete/:id', deleteCategory);


router.get('/categories',getAllCategories);

export default router;
