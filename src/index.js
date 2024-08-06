import dotenv from "dotenv";
import dbConection from "./db/db.js";
import { app,io } from "./app.js";


dotenv.config({ path: "./env" });
const port = process.env.PORT || 3000;

dbConection();
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
