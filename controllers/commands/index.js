"use strict";

const express = require('express');
const router = express.Router();
const tokenVerification = require('../../middlewares/tokenverification');
const privateCredentials = require('../../credentials/private');
const UIMessage = require('../../models/ui/uimessage/uimessage');
const statisticsTitle = require('../../models/ui/partials/statstitle');

// const userRegexp = /<@[0-9A-Z]+(\|.+)?>/i;
const commandRegexp = /^('|")([^'^"]*)(?:\1)\s(.*)$/i;

router.use('/commands', tokenVerification);

router.post('/commands', function(req, res) {
    var text = req.body.text;
    if (text === 'menu' || !text) {
        res.status(200).send('');

        var uiMessage = new UIMessage();
        var uiAttachments = [];
        uiAttachments.push(statisticsTitle(40, 30, 434));
        uiAttachments.push({
            color: "#3AA3E3",
            attachment_type: "default",
            callback_id: "/mainmenu",
            actions: [
                {
                    name: "spellbook",
                    text: ":sparkles:Spellbook",
                    type: "button",
                    value: "spellbook"
                }, {
                    name: "shop",
                    text: ":scales:Shop",
                    type: "button",
                    value: "shop"
                }
            ]
        });
        uiMessage.setUIAttachments(uiAttachments);
        let sendParameters = {
            as_user: false,
            token: privateCredentials.sandboxBotUserId,
            username: 'slackgametestbot',
            method: 'chat.postMessage',
            icon_url: "http://lorempixel.com/48/48",
            channel: privateCredentials.sandboxChannelId
        };
        uiMessage.setSendParameters(sendParameters);
        uiMessage.send();
    } else {
        res.status(500).send('Error');
    }
});

module.exports = router;