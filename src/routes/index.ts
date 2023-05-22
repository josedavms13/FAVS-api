import {Response, Router} from "express";
import userRoutes from "./user.routes";

const router = Router();

router.use("/user", userRoutes);
router.use("/", (req: any, res: Response) => {
   res.status(200).json("ok");
});

export default router;
