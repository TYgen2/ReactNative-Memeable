import { Router } from "express";
import authRouter from "./auth.mjs";
import userActionsRouter from "../routes/protected/userActions.mjs";
import fetchDataRouter from "../routes/public/fetchData.mjs";

const router = Router();

router.use(authRouter);
router.use(userActionsRouter);
router.use(fetchDataRouter);

export default router;
