"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const request = require("request");
const slackActions = require("../../middlewares/slackactions");
const UIRouter = require("../../uicontrollers/uirouter");
exports.router = express.Router();
// TODO: SlackActionRequest type
exports.router.post("/actions", slackActions.setGameData, (req, res) => {
    res.status(200).send("");
    // TODO: display error route UI if there is no route.
    const uiRouter = new UIRouter(req.slackData.team, req.slackData.channel, req.slackData.player, req.slackData.game, req.slackData.gamer);
    const uiMessagePromise = uiRouter.getUIMessage(req.slackData.parsedPayload.callback_id, req.slackData.parsedPayload);
    uiMessagePromise.then((uiMessage) => {
        const sendParameters = {
            response_type: "ephemeral",
        };
        uiMessage.setSendParameters(sendParameters);
        request(req.slackData.parsedPayload.response_url, {
            headers: {
                "Content-type": "application/json",
            },
            json: uiMessage.toJSON(),
            method: "POST",
            uri: req.slackData.parsedPayload.response_url,
        });
    }, (err) => {
        // TODO: ?
    });
});
//# sourceMappingURL=index.js.map