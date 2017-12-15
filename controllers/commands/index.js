"use strict";

const express = require('express');
const router = express.Router();
const tokenVerification = require('../../middlewares/tokenverification');
const setGameData = require('../../middlewares/slackcommands').setGameData;
const request = require('request');
const mainMenuFactory = require('../../models/ui/uimessage/factory/mainmenufactory');

router.use('/commands', tokenVerification);

router.post('/commands', setGameData, (/** SlackCommandRequest */ req, res) => {
  var text = req.body.text;
  if (text === 'menu' || !text) {
    res.status(200).send('');
    // TODO: Check game phase and load Game or display break menu.
    // TODO: any errors must respond to Slack.
    const mainMenuUIMessage = mainMenuFactory(20, 30, 123);
    let sendParameters = {
      response_type: 'ephemeral'
    };
    mainMenuUIMessage.setSendParameters(sendParameters);
    request(req.body.response_url, {
      uri: req.body.response_url,
      method: 'POST',
      json: mainMenuUIMessage.toJSON(),
      headers: {
        'Content-type': 'application/json'
      },
    });
  } else {
    res.status(500).send('Error');
  }
});

module.exports = router;