"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const Slack = require("slack-node");
const url = require("url");
const private_1 = require("../../credentials/private");
const public_1 = require("../../credentials/public");
const team_1 = require("../../models/team/team");
exports.router = express.Router();
exports.router.get("/authorize/request", authorizeRequest);
exports.router.get("/authorize/complete", authorizeComplete);
// This URL is used as redirect_uri in OAuth process.
// TODO: use from current URL?
const urlObject = {
    hostname: public_1.credentials.host,
    pathname: "/slacktestgame/authorize/complete",
    port: 8080,
    protocol: public_1.credentials.protocol,
};
const authRedirectURL = url.format(urlObject);
/**
 * Simply redirects on Slack"s authorize app page with needed data provided (like client_id).
 */
function authorizeRequest(req, res) {
    const query = {
        client_id: public_1.credentials.client_id,
        redirect_uri: authRedirectURL,
        scope: "commands,bot,chat:write:bot,groups:write,users:read",
    };
    const urlObject = {
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
function authorizeComplete(req, res, next) {
    const slackRespones = req.query;
    const code = slackRespones.code;
    if (code) {
        const slack = new Slack();
        // Prepare data to be send via HTTP request.
        const apiCallArgs = {
            client_id: public_1.credentials.client_id,
            client_secret: private_1.credentials.client_secret,
            code,
            redirect_uri: authRedirectURL,
        };
        slack.api("oauth.access", apiCallArgs, (err, response) => {
            // const responseJSON: SlackOAuthResponseStep3 = JSON.parse(responseMessage);
            if (response.ok === true) {
                // At first get team info in app.
                team_1.Team.getTeam(response.team_id)
                    .then((team) => {
                    if (team !== null && team.admin && team.admin !== response.user_id) {
                        res.status(500).send("App is already installed by admin and you are not app admin so we won't replace admin token with yours.");
                    }
                    else {
                        if (response.bot !== undefined) {
                            // Save access and bot tokens into database now.
                            const teamFirebaseValue = {
                                active: true,
                                admin: team && team.admin ? team.admin : response.user_id,
                                botId: response.bot.bot_user_id,
                                botToken: response.bot.bot_access_token,
                                name: response.team_name,
                                token: response.access_token,
                                userId: response.user_id,
                            };
                            team_1.Team.setTeam(teamFirebaseValue, response.team_id)
                                .then(() => {
                                res.send("DONE!");
                            }, (error) => {
                                const errorTitle = "Something went wrong. Despite the fact app being installed in your team it probably will not work properly. Better to reinstall it. Error: " + error.message;
                                res.status(500).send(errorTitle);
                            });
                        }
                        else {
                            res.status(500).send("Something went wrong. Bot credentials weren't created.");
                        }
                    }
                }, (error) => {
                    res.status(500).send(error.message);
                });
            }
            else {
                res.status(500).send(`Something went wrong. Error code: "${response.error}".`);
            }
        });
    }
}
//# sourceMappingURL=index.js.map