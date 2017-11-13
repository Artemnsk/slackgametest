"use strict";

const express = require('express');
const router = express.Router();
const tokenVerification = require('../../middlewares/tokenverification');
const privateCredentials = require('../../credentials/private');

const mainMenuFactory = require('../../models/ui/uimessage/factory/mainmenufactory');

// const userRegexp = /<@[0-9A-Z]+(\|.+)?>/i;
// const commandRegexp = /^('|")([^'^"]*)(?:\1)\s(.*)$/i;

router.use('/commands', tokenVerification);

router.post('/commands', function(req, res) {
    var text = req.body.text;
    if (text === 'menu' || !text) {
        res.status(200).send('');
        const mainMenuUIMessage = mainMenuFactory(null, 20, 30, 123);
        let sendParameters = {
            as_user: false,
            token: privateCredentials.sandboxBotUserId,
            username: 'slackgametestbot',
            method: 'chat.postMessage',
            ts: null
        };
        mainMenuUIMessage.setSendParameters(sendParameters);
        mainMenuUIMessage.send();
    } else {
        res.status(500).send('Error');
    }
});

module.exports = router;