
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";
import multer from 'multer';
import path from 'path';
import { isAdmin } from "../middlewares/admin.middleware.js";
import {  likeVideo, unlikeVideo, getLikedVideosByUser } from "../controller/like.controller.js";

const router = Router();

// Route to like a video
router.post('/like/:videoId', verifyJWT, likeVideo);

// Route to unlike a video
router.delete('/unlike/:likeId', verifyJWT, unlikeVideo);

router.get('/liked', verifyJWT, getLikedVideosByUser);

export default router;
