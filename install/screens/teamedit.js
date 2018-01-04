"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer = require("inquirer");
const Slack = require("slack-node");
const team_1 = require("../../models/team/team");
const helpers_1 = require("../helpers");
const stdout = process.stdout;
const TEAM_EDIT_SAVE = "Save";
const TEAM_EDIT_CANCEL = "Cancel";
const TEAM_ACTIVE_TRUE = "true";
const TEAM_ACTIVE_FALSE = "false";
const ERROR_TRY_AGAIN = "Try Again";
const ERROR_BACK = "Back";
function teamEditRoute(args, router) {
    helpers_1.clearConsole();
    if (args.team.token !== undefined) {
        const loadingScreenInterval = helpers_1.loadingScreen();
        const slack = new Slack(args.team.token);
        // Get users list from Slack team.
        const apiCallArgs = {
            include_locale: false,
            limit: 0,
            presence: false,
        };
        slack.api("users.list", apiCallArgs, (err, response) => {
            clearInterval(loadingScreenInterval);
            if (err) {
                _errorCallback(err.error.message, args, router);
            }
            else if (response.ok === true) {
                let adminDefaultOption;
                const slackUserOptions = response.members.map((member) => {
                    const optionName = `${member.profile.real_name} [${member.id}]`;
                    if (member.id === args.team.admin) {
                        adminDefaultOption = optionName;
                    }
                    return optionName;
                });
                stdout.write("TEAM INFO\n");
                stdout.write(`$key: ${args.team.$key}\n`);
                stdout.write(`name: ${args.team.name}\n`);
                stdout.write(`token: ${args.team.token}\n`);
                stdout.write(`userId: ${args.team.userId}\n`);
                stdout.write(`botId: ${args.team.botId}\n`);
                stdout.write(`botToken: ${args.team.botToken}\n`);
                inquirer.prompt([
                    {
                        choices: slackUserOptions,
                        default: adminDefaultOption,
                        message: "Admin user:",
                        name: "admin",
                        paginated: true,
                        type: "list",
                    },
                    {
                        choices: [TEAM_ACTIVE_TRUE, TEAM_ACTIVE_FALSE],
                        default: args.team.active === true ? TEAM_ACTIVE_TRUE : TEAM_ACTIVE_FALSE,
                        message: "active",
                        name: "active",
                        type: "list",
                    }, {
                        choices: [TEAM_EDIT_SAVE, TEAM_EDIT_CANCEL],
                        message: helpers_1.separator,
                        name: "option",
                        type: "list",
                    },
                ]).then((answers) => {
                    helpers_1.clearConsole();
                    switch (answers.option) {
                        case TEAM_EDIT_SAVE:
                            const teamFirebaseValues = args.team.getFirebaseValue();
                            // Retrieve admin value.
                            const admin = answers.admin.replace(/^.*\[(.*)\]$/i, "$1");
                            teamFirebaseValues.admin = admin;
                            const active = answers.active === TEAM_ACTIVE_TRUE;
                            teamFirebaseValues.active = active;
                            const loadingScreenInterval = helpers_1.loadingScreen();
                            team_1.Team.setTeam(teamFirebaseValues, args.team.$key)
                                .then(() => {
                                clearInterval(loadingScreenInterval);
                                helpers_1.clearConsole();
                                router.teamRoute({ teamKey: args.team.$key }, router);
                            }, (error) => {
                                clearInterval(loadingScreenInterval);
                                _errorCallback(error.message, args, router);
                            });
                            break;
                        case TEAM_EDIT_CANCEL:
                            router.teamRoute({ teamKey: args.team.$key }, router);
                            break;
                    }
                });
            }
            else {
                _errorCallback(`Something went wrong during Slack users.list API call: ${response.error}`, args, router);
            }
        });
    }
    else {
        _errorCallback("Slack API token is not set for this team.", args, router);
    }
}
exports.teamEditRoute = teamEditRoute;
function _errorCallback(message, args, router) {
    helpers_1.clearConsole();
    inquirer.prompt([
        {
            choices: [ERROR_TRY_AGAIN, ERROR_BACK],
            message: `Error occurred: ${message}`,
            name: "option",
            type: "list",
        },
    ]).then((answers) => {
        switch (answers.option) {
            case ERROR_TRY_AGAIN:
                router.teamEditRoute(args, router);
                break;
            case ERROR_BACK:
                router.teamRoute({ teamKey: args.team.$key }, router);
                break;
        }
    });
}
//# sourceMappingURL=teamedit.js.map