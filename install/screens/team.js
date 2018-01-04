"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer = require("inquirer");
const Slack = require("slack-node");
const team_1 = require("../../models/team/team");
const helpers_1 = require("../helpers");
const stdout = process.stdout;
const TEAM_EDIT = "Edit";
const TEAM_CHANNELS = "View Channels";
const TEAM_BACK = "Back";
const ERROR_TRY_AGAIN = "Try Again";
const ERROR_BACK = "Back";
function teamRoute(args, router) {
    const loadingScreenInterval = helpers_1.loadingScreen();
    team_1.Team.getTeam(args.teamKey)
        .then((team) => {
        if (team !== null) {
            if (team.admin) {
                const apiCallArgs = {
                    include_locale: false,
                    user: team.admin,
                };
                const slack = new Slack(team.token);
                slack.api("users.info", apiCallArgs, (err, response) => {
                    if (err || response.ok !== true) {
                        clearInterval(loadingScreenInterval);
                        helpers_1.clearConsole();
                        teamViewPart(args, router, team, `${team.admin} ERROR: ${err ? err.error : "MAYBE THIS USER DOESN'T EXIST ANYMORE"}`);
                    }
                    else if (response.ok === true) {
                        clearInterval(loadingScreenInterval);
                        helpers_1.clearConsole();
                        teamViewPart(args, router, team, `${response.user.profile.real_name} [${response.user.id}]`);
                    }
                });
            }
            else {
                clearInterval(loadingScreenInterval);
                helpers_1.clearConsole();
                teamViewPart(args, router, team, "WARNING! NOT SET!");
            }
        }
        else {
            clearInterval(loadingScreenInterval);
            _errorCallback(`No team found by key ${args.teamKey}`, args, router);
        }
    }, (error) => {
        clearInterval(loadingScreenInterval);
        _errorCallback(error.message, args, router);
    });
}
exports.teamRoute = teamRoute;
function teamViewPart(args, router, team, teamAdminLabel) {
    stdout.write("TEAM INFO\n");
    stdout.write(`$key: ${team.$key}\n`);
    stdout.write(`name: ${team.name}\n`);
    stdout.write(`token: ${team.token}\n`);
    stdout.write(`userId: ${team.userId}\n`);
    stdout.write(`botId: ${team.botId}\n`);
    stdout.write(`botToken: ${team.botToken}\n`);
    stdout.write(`admin: ${teamAdminLabel}\n`);
    stdout.write(`active: ${team.active === true ? "true" : "false"}\n`);
    const choices = team.admin ? [TEAM_EDIT, TEAM_CHANNELS, TEAM_BACK] : [TEAM_EDIT, { name: TEAM_CHANNELS, disabled: "Set app admin for this Slack team first." }, TEAM_BACK];
    inquirer.prompt([
        {
            choices,
            message: helpers_1.separator,
            name: "option",
            type: "list",
        },
    ]).then((answers) => {
        helpers_1.clearConsole();
        switch (answers.option) {
            case TEAM_EDIT:
                router.teamEditRoute({ team }, router);
                break;
            case TEAM_CHANNELS:
                router.channelsRoute({ team }, router);
                break;
            case TEAM_BACK:
                router.teamsRoute(router);
                break;
        }
    });
}
function _errorCallback(message, args, router) {
    helpers_1.clearConsole();
    inquirer.prompt([
        {
            choices: [ERROR_TRY_AGAIN, ERROR_BACK],
            message: "Error occurred: " + message,
            name: "option",
            type: "list",
        },
    ]).then((answers) => {
        switch (answers.option) {
            case ERROR_TRY_AGAIN:
                router.teamRoute(args, router);
                break;
            case ERROR_BACK:
                router.teamsRoute(router);
                break;
        }
    });
}
//# sourceMappingURL=team.js.map