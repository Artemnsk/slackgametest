import express = require("express");
import https = require("https");
import querystring = require("querystring");
import url = require("url");
import { credentials as privateCredentials } from "../../credentials/private";
import { credentials as publicCredentials } from "../../credentials/public";
import { Team } from "../../models/team/team";

export const router = express.Router();

router.get("/authorize/request", authorizeRequest);
router.get("/authorize/complete", authorizeComplete);

// This URL is used as redirect_uri in OAuth process.
// TODO: use from current URL?
const authRedirectURL = url.format({
  hostname: publicCredentials.host,
  pathname: "/slacktestgame/authorize/complete",
  port: 8080,
  protocol: publicCredentials.protocol,
});

/**
 * Simply redirects on Slack"s authorize app page with needed data provided (like client_id).
 */
function authorizeRequest(req: express.Request, res: express.Response) {
  const redirectURL = url.format({
    hostname: "slack.com",
    pathname: "oauth/authorize",
    protocol: "https",
    query: {
      client_id: publicCredentials.client_id,
      redirect_uri: authRedirectURL,
      scope: "commands,bot,chat:write:bot,groups:write,users:read",
    },
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
function authorizeComplete(req: express.Request, res: express.Response, next: express.NextFunction) {
  const code = req.query.code;
  if (code) {
    // Prepare data to be send via HTTP request.
    const data = querystring.stringify({
      code,
      redirect_uri: authRedirectURL,
    });
    // Perform Basic auth using client_id and client_secret.
    const auth = "Basic " + new Buffer(publicCredentials.client_id + ":" + privateCredentials.client_secret).toString("base64");
    const options = {
      headers: {
        "Authorization": auth,
        "Content-Length": Buffer.byteLength(data),
        "Content-type": "application/x-www-form-urlencoded",
      },
      host: "slack.com",
      method: "POST",
      path: "/api/oauth.access",
      port: 443,
    };
    // Send request to Slack.
    const request = https.request(options, (response) => {
      let responseMessage = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => {
        responseMessage += chunk;
      });
      response.on("end", () => {
        const /** @type SuccessfulAuthorizationResponse */ responseJSON = JSON.parse(responseMessage);
        if (responseJSON.ok === true) {
          // At first get team info in app.
          Team.getTeam(responseJSON.team_id)
            .then((team) => {
              if (team && team.admin && team.admin !== responseJSON.user_id) {
                res.status(500).send("App is already installed by admin and you are not app admin so we won't replace admin token with yours.");
              } else {
                // Save access and bot tokens into database now.
                // TODO: type
                const /** @type TeamFirebaseValue */ teamFirebaseValue = {
                  active: true,
                  admin: team && team.admin ? team.admin : responseJSON.user_id,
                  botId: responseJSON.bot.bot_user_id,
                  botToken: responseJSON.bot.bot_access_token,
                  name: responseJSON.team_name,
                  token: responseJSON.access_token,
                  userId: responseJSON.user_id,
                };
                Team.setTeam(teamFirebaseValue, responseJSON.team_id)
                  .then(() => {
                    res.send("DONE!");
                  }, (error) => {
                    const errorTitle = "Something went wrong. Despite the fact app being installed in your team it probably will not work properly. Better to reinstall it. Error: " + error.message;
                    res.status(500).send(errorTitle);
                  });
              }
            }, (error) => {
              res.status(500).send(error.message);
            });
        } else {
          res.send("Something went wrong");
        }
      });
    });
    request.write(data);
    request.end();
  }
}
