"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const slackgamedata_1 = require("../helpers/slackgamedata");
function setGameData(req, res, next) {
    // Ensure that all needed data exists. Who knows...
    if (req.body.payload) {
        // TODO: any errors must respond to Slack.
        const /** @type ParsedSlackActionPayload */ parsedPayload = JSON.parse(req.body.payload);
        slackgamedata_1.slackGameData(parsedPayload.team.id, parsedPayload.channel.id, parsedPayload.user.id)
            .then((slackGameMajorData) => {
            req.slackData = Object.assign(slackGameMajorData, { parsedPayload });
            next();
        }, (error) => {
            res.status(500).send(error.message);
        });
    }
    else {
        res.status(500).send("Something wrong with Slack data sent with this request.");
    }
}
exports.setGameData = setGameData;
//# sourceMappingURL=slackactions.js.map