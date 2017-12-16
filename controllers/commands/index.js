"use strict";

const express = require('express');
const router = express.Router();
const UIRouter = require('../../models/ui/uirouter/uirouter');
const tokenVerification = require('../../middlewares/tokenverification');
const setGameData = require('../../middlewares/slackcommands').setGameData;
const request = require('request');
const mainMenuFactory = require('../../models/ui/uimessage/factory/mainmenufactory');

router.use('/commands', tokenVerification);

router.post('/commands', setGameData, (/** SlackCommandRequest */ req, res) => {
  var text = req.body.text;
  if (text === 'menu' || !text) {
    res.status(200).send('');
    const uiRouter = new UIRouter(req.slackData.team, req.slackData.channel, req.slackData.player);
    const uiMessage = uiRouter.getUIMessage('/');
    // TODO: Check game phase and load Game or display break menu. So use UIRouter with root ('/') route.
    // TODO: any errors must respond to Slack.
    // const mainMenuUIMessage = mainMenuFactory(20, 30, 123);
    let sendParameters = {
      response_type: 'ephemeral'
    };
    uiMessage.setSendParameters(sendParameters);
    request(req.body.response_url, {
      uri: req.body.response_url,
      method: 'POST',
      json: uiMessage.toJSON(),
      headers: {
        'Content-type': 'application/json'
      },
    });
  } else {
    res.status(500).send('Error');
  }
});

module.exports = router;