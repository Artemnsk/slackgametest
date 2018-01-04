"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const request = require("request");
const slackcommands_1 = require("../../middlewares/slackcommands");
const tokenverification_1 = require("../../middlewares/tokenverification");
const uirouter_1 = require("../../uicontrollers/uirouter");
exports.router = express.Router();
exports.router.use("/commands", tokenverification_1.verifyToken);
exports.router.post("/commands", slackcommands_1.setGameData, (req, res) => {
    const body = req.body;
    const text = body.text;
    if (text === "menu" || !text) {
        res.status(200).send("");
        const uiRouter = new uirouter_1.UIRouter(req.slackData.team, req.slackData.channel, req.slackData.player, req.slackData.game, req.slackData.gamer);
        const uiMessagePromise = uiRouter.getUIMessage("/");
        uiMessagePromise.then((uiMessage) => {
            const sendParameters = {
                response_type: "ephemeral",
            };
            uiMessage.setSendParameters(sendParameters);
            const coreOptions = {
                headers: {
                    "Content-type": "application/json",
                },
                json: uiMessage.toJSON(),
                method: "POST",
            };
            request(body.response_url, coreOptions, () => {
                // I'm actually not sure we need to do anything.
            });
        });
    }
    else {
        res.status(500).send("Error");
    }
});
//# sourceMappingURL=index.js.map