"use strict";

const express = require('express');
const router = express.Router();
const UIRouter = require('../../uicontrollers/uirouter');
const tokenVerification = require('../../middlewares/tokenverification');
const setGameData = require('../../middlewares/slackcommands').setGameData;
const request = require('request');

router.use('/commands', tokenVerification);

router.post('/commands', setGameData, (/** SlackCommandRequest */ req, res) => {
  var text = req.body.text;
  if (text === 'menu' || !text) {
    res.status(200).send('');
    const uiRouter = new UIRouter(req.slackData.team, req.slackData.channel, req.slackData.player, req.slackData.game);
    const uiMessagePromise = uiRouter.getUIMessage('/');
    uiMessagePromise.then((uiMessage) => {
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
      }, (err) => {
        // TODO: ?
      });
    });
  } else {
    res.status(500).send('Error');
  }
});

module.exports = router;