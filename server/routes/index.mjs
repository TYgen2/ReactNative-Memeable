import { Router } from "express";
import authRouter from "./auth.mjs";
import userActionsRouter from "../routes/protected/userActions.mjs";
import fetchDataRouter from "./protected/fetchData.mjs";
import searchRouter from "./protected/search.mjs";
import userUpdateRouter from "../routes/protected/userUpdate.mjs";
import userRegisterRouter from "../routes/protected/userRegister.mjs";

const router = Router();

router.use(authRouter);
router.use(userActionsRouter);
router.use(userUpdateRouter);
router.use(userRegisterRouter);
router.use(fetchDataRouter);
router.use(searchRouter);

// test
router.get("/api/testing", async (req, res) => {
  try {
    res.status(200).send({ msg: "REACHED" });
  } catch (error) {
    res.status(500).send({ msg: "Error WTF" });
  }
});

export default router;
