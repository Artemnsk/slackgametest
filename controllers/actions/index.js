"use strict";

const express = require('express');
const router = express.Router();
const UIRouter = require('../../models/ui/uirouter/uirouter');
const setGameData = require('../../middlewares/slackactions').setGameData;
const request = require('request');

router.post('/actions', setGameData, (/** SlackActionRequest */ req, res) => {
  res.status(200).send('');
  // TODO: display error route UI if there is no route.
  const uiRouter = new UIRouter(req.slackData.team, req.slackData.channel, req.slackData.player);
  const uiMessage = uiRouter.getUIMessage(req.slackData.parsedPayload.callback_id, req.slackData.parsedPayload);
  let sendParameters = {
    response_type: 'ephemeral'
  };
  uiMessage.setSendParameters(sendParameters);
  request(req.slackData.parsedPayload.response_url, {
    uri: req.slackData.parsedPayload.response_url,
    method: 'POST',
    json: uiMessage.toJSON(),
    headers: {
      'Content-type': 'application/json'
    },
  });
});

module.exports = router;