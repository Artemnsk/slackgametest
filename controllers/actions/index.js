"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const request = require("request");
const slackActions = require("../../middlewares/slackactions");
const uirouter_1 = require("../../uicontrollers/uirouter");
exports.router = express.Router();
exports.router.post("/actions", slackActions.setGameData, (req, res) => {
    res.status(200).send("");
    const uiRouter = new uirouter_1.UIRouter(req.slackData.team, req.slackData.channel, req.slackData.player, req.slackData.game, req.slackData.gamer);
    const uiMessagePromise = uiRouter.getUIMessage(req.slackData.parsedPayload.callback_id, req.slackData.parsedPayload);
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
        request(req.slackData.parsedPayload.response_url, coreOptions, () => {
            // I'm actually not sure we need to do anything.
        });
    }, (err) => {
        // TODO: I don't think we ever reject promise from getUIMessage().
    });
});
//# sourceMappingURL=index.js.map