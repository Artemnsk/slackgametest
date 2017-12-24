"use strict";

const express = require('express');
const router = express.Router();
const url = require('url');
const https = require('https');
const queryString = require('querystring');
const publicCredentials = require('../../credentials/public');
const privateCredentials = require('../../credentials/private');
const Team = require('../../models/team/team').Team;
// This URL is used as redirect_uri in OAuth process.
// TODO: use from current URL.
const authRedirectURL = url.format({
  protocol: publicCredentials.protocol,
  hostname: publicCredentials.host,
  port: 8080,
  pathname: '/slacktestgame/authorize/complete'
});

router.get('/authorize/request', authorizeRequest);
router.get('/authorize/complete', authorizeComplete);

module.exports = router;

/**
 * Simply redirects on Slack's authorize app page with needed data provided (like client_id).
 */
function authorizeRequest(req, res) {
  const redirectURL = url.format({
    protocol: "https",
    hostname: "slack.com",
    pathname: "oauth/authorize",
    query: {
      "client_id": publicCredentials.client_id,
      "scope": 'commands,bot,chat:write:bot,groups:write,users:read',
      "redirect_uri": authRedirectURL
    }
  });
  res.redirect(redirectURL);
}

/**
 * @typedef {Object} SuccessfulAuthorizationResponseBot
 * @property {string} bot_user_id
 * @property {string} bot_access_token
 */

/**
 * @typedef {Object} SuccessfulAuthorizationResponse
 * @property {boolean} ok
 * @property {string} access_token
 * @property {string} scope - permissions for this token
 * @property {string} user_id
 * @property {string} team_name
 * @property {string} team_id
 * @property {SuccessfulAuthorizationResponseBot} bot
 *
 * Exchanges "code" string got from Slack on access_token:
 * 1. That will actually install app in workspace as requested by user.
 * 2. access_token then will be used to make Slack API calls which being allowed by this access_token.
 */
function authorizeComplete(req, res, next) {
  const code = req.query.code;
  if (code) {
    // Prepare data to be send via HTTP request.
    const data = queryString.stringify({
      'code': code,
      'redirect_uri': authRedirectURL
    });
    // Perform Basic auth using client_id and client_secret.
    const auth = 'Basic ' + new Buffer(publicCredentials.client_id + ':' + privateCredentials.client_secret).toString('base64');
    const options = {
      host: 'slack.com',
      port: 443,
      path: '/api/oauth.access',
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
        'Authorization': auth,
        'Content-Length': Buffer.byteLength(data)
      }
    };
    // Send request to Slack.
    var request = https.request(options, (response) => {
      let responseMessage = "";
      response.setEncoding('utf8');
      response.on('data', (chunk) => {
        responseMessage += chunk;
      });
      response.on('end', () => {
        const /** @type SuccessfulAuthorizationResponse */ responseJSON = JSON.parse(responseMessage);
        if (responseJSON.ok === true) {
          // At first get team info in app.
          Team.getTeam(responseJSON.team_id)
            .then((team) => {
              if (team && team.admin && team.admin !== responseJSON.user_id) {
                res.status(500).send("App is already installed by admin and you are not app admin so we won't replace admin token with yours.");
              } else {
                // Save access and bot tokens into database now.
                let /** @type TeamFirebaseValue */ teamFirebaseValue = {
                  active: true,
                  admin: team && team.admin ? team.admin : responseJSON.user_id,
                  name: responseJSON.team_name,
                  token: responseJSON.access_token,
                  userId: responseJSON.user_id,
                  botId: responseJSON.bot.bot_user_id,
                  botToken: responseJSON.bot.bot_access_token
                };
                Team.setTeam(teamFirebaseValue, responseJSON.team_id)
                  .then(() => {
                    res.send('DONE!');
                  }, (error) => {
                    let errorTitle = 'Something went wrong. Despite the fact app being installed in your team it probably will not work properly. Better to reinstall it. Error: ' + error.message;
                    res.status(500).send(errorTitle);
                  });
              }
            }, (error) => {
              res.status(500).send(error.message);
            });
        } else {
          res.send('Something went wrong');
        }
      });
    });
    request.write(data);
    request.end();
  }
}