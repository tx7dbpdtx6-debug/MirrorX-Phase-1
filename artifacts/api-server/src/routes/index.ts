import { Router, type IRouter } from "express";
import healthRouter from "./health";
import mirrorxRouter from "./mirrorx";

const router: IRouter = Router();

router.use(healthRouter);
router.use(mirrorxRouter);

export default router;
