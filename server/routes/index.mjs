import { Router } from "express";
import authRouter from "./auth.mjs";
import userActionsRouter from "../routes/protected/userActions.mjs";
import fetchDataRouter from "./protected/fetchData.mjs";
import searchRouter from "./protected/search.mjs";

const router = Router();

router.use(authRouter);
router.use(userActionsRouter);
router.use(fetchDataRouter);
router.use(searchRouter);

export default router;
