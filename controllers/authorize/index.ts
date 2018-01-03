import * as express from "express";
import * as https from "https";
import { RequestOptions } from "https";
import * as querystring from "querystring";
import * as url from "url";
import { UrlObject } from "url";
import { credentials as privateCredentials } from "../../credentials/private";
import { credentials as publicCredentials } from "../../credentials/public";
import { SlackOAuthRequestStep1, SlackOAuthRequestStep3, SlackOAuthResponseStep2, SlackOAuthResponseStep3 } from "../../helpers/slackapicalls";
import { TeamFirebaseValue } from "../../models/team/dbfirebase";
import { Team } from "../../models/team/team";

export const router = express.Router();

router.get("/authorize/request", authorizeRequest);
router.get("/authorize/complete", authorizeComplete);

// This URL is used as redirect_uri in OAuth process.
// TODO: use from current URL?
const urlObject: UrlObject = {
  hostname: publicCredentials.host,
  pathname: "/slacktestgame/authorize/complete",
  port: 8080,
  protocol: publicCredentials.protocol,
};
const authRedirectURL = url.format(urlObject);

/**
 * Simply redirects on Slack"s authorize app page with needed data provided (like client_id).
 */
function authorizeRequest(req: express.Request, res: express.Response) {
  const query: SlackOAuthRequestStep1 = {
    client_id: publicCredentials.client_id,
    redirect_uri: authRedirectURL,
    scope: "commands,bot,chat:write:bot,groups:write,users:read",
  };
  const urlObject: UrlObject = {
    hostname: "slack.com",
    pathname: "oauth/authorize",
    protocol: "https",
    query,
  };
  const redirectURL = url.format(urlObject);
  res.redirect(redirectURL);
}

/**
 * Exchanges "code" string got from Slack on access_token:
 * 1. That will actually install app in workspace as requested by user.
 * 2. access_token then will be used to make Slack API calls which being allowed by this access_token.
 */
function authorizeComplete(req: express.Request, res: express.Response, next: express.NextFunction) {
  const slackRespones: SlackOAuthResponseStep2 = req.query;
  const code = slackRespones.code;
  if (code) {
    // Prepare data to be send via HTTP request.
    const dataJson: SlackOAuthRequestStep3 = {
      client_id: publicCredentials.client_id,
      client_secret: privateCredentials.client_secret,
      code,
      redirect_uri: authRedirectURL,
    };
    const data: string = querystring.stringify(dataJson);
    // Perform Basic auth using client_id and client_secret.
    // const auth = "Basic " + new Buffer(publicCredentials.client_id + ":" + privateCredentials.client_secret).toString("base64");
    const options: RequestOptions = {
      headers: {
        // "Authorization": auth,
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
      let responseMessage: string = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => {
        responseMessage += chunk;
      });
      response.on("end", () => {
        const responseJSON: SlackOAuthResponseStep3 = JSON.parse(responseMessage);
        if (responseJSON.ok === true) {
          // At first get team info in app.
          Team.getTeam(responseJSON.team_id)
            .then((team) => {
              if (team !== null && team.admin && team.admin !== responseJSON.user_id) {
                res.status(500).send("App is already installed by admin and you are not app admin so we won't replace admin token with yours.");
              } else {
                if (responseJSON.bot !== undefined) {
                  // Save access and bot tokens into database now.
                  const teamFirebaseValue: TeamFirebaseValue = {
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
                } else {
                  res.status(500).send("Something went wrong. Bot credentials weren't created.");
                }
              }
            }, (error) => {
              res.status(500).send(error.message);
            });
        } else {
          res.status(500).send(`Something went wrong. Error code: "${responseJSON.error}".`);
        }
      });
    });
    request.write(data);
    request.end();
  }
}
