"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const slackgamedata_1 = require("../helpers/slackgamedata");
function setGameData(req, res, next) {
    const body = req.body;
    // Ensure that all needed data exists. Who knows...
    if (body.team_id && body.channel_id && body.user_id) {
        // TODO: any errors must respond to Slack.
        slackgamedata_1.slackGameData(body.team_id, body.channel_id, body.user_id)
            .then((slackGameMajorData) => {
            req.slackData = slackGameMajorData;
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
//# sourceMappingURL=slackcommands.js.map