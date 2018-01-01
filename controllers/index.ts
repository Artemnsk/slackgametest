import * as bodyParser from "body-parser";
import * as express from "express";
import { router as actionsRoute } from "./actions";
import { router as authorizeRoute } from "./authorize";
import { router as commandsRoute } from "./commands";

export const router = express.Router();

router.use(bodyParser.urlencoded());
router.use("/", authorizeRoute);
router.use("/", commandsRoute);
router.use("/", actionsRoute);
