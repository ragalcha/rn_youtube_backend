
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";
import multer from 'multer';
import path from 'path';
import { isAdmin } from "../middlewares/admin.middleware.js";
import {
    createPost,
    updatePost,
    deletePost,
    getPosts,
    getPostById,
    getRecentPosts,
    getPostsByTagId
} from "../controller/post.controller.js";

// Setup multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'image') {
            console.log("i am image");
            cb(null, './public/img/');
        } else if (file.fieldname === 'video') {
            console.log("i am video");
            cb(null, './public/video/');
        }
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${Date.now()}${ext}`);
    }
});


const upload = multer({ storage });

const router = Router();



router.route('/createpost')
    .post(verifyJWT, isAdmin, upload.fields([{ name: 'image' }, { name: 'video' }]), createPost);

router.route('/updatepost/:id')
    .put(verifyJWT, isAdmin, upload.fields([{ name: 'image' }, { name: 'video' }]), updatePost);

router.route('/deletepost/:id')
    .delete(verifyJWT, isAdmin, deletePost);

router.route('/posts')
    .get(getPosts);

router.route('/post/:id')
    .get(verifyJWT, getPostById);

router.route('/recentposts').get(getRecentPosts);

router.route('/postsbytag/:id').get(getPostsByTagId);

export default router;
