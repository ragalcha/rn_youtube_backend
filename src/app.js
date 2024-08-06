import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import http from "http";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

app.use(
	cors({
    origin: '*',
		credentials: true,
	})
);



app.use(bodyParser.urlencoded({
    extended: true
  }));
  
app.use(bodyParser.json());
app.use(cookieParser());

// Debugging middleware to log incoming requests
app.use((req, res, next) => {
    // console.log('Headers:', req.headers);
    // console.log('Body:', req.body);
    next();
});

app.use(express.static('public'));

// import routes
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import categoryRouter from "./routes/category.routes.js";
import userRolesRouter from "./routes/userrole.routes.js";
import likeRouter from "./routes/like.routes.js";
app.use("/api/v1/post", postRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/userrole", userRolesRouter);
app.use("/api/v1/like", likeRouter);

// Socket.io connection handling
// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });

export { server as app, io };