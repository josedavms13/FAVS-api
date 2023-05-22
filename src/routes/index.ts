import {Response, Router} from "express";
import userRoutes from "./user.routes";
import favListRoutes from "./favList.routes";
import favRoutes from "./fav.routes";

const router = Router();

router.use("/user", userRoutes);
router.use("/fav-list", favListRoutes);
router.use("/fav", favRoutes);
router.use("/", (req: any, res: Response) => {
   res.status(200).json("ok");
});

export default router;
