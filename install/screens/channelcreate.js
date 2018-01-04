"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer = require("inquirer");
const Slack = require("slack-node");
const channel_1 = require("../../models/channel/channel");
const helpers_1 = require("../helpers");
const CHANNEL_CREATE = "Create channel";
const CHANNEL_CANCEL = "Cancel";
const ERROR_BACK = "Back";
function channelCreateRoute(args, router) {
    const botId = args.team.botId;
    if (botId !== undefined) {
        inquirer.prompt([
            {
                message: "Channel name:",
                name: "name",
                type: "input",
                validate: (value) => {
                    const channelNameRegExp = /^[a-z\-_]{1,21}$/;
                    if (channelNameRegExp.test(value)) {
                        return true;
                    }
                    return "Private channel names can only contain lowercase letters, numbers, hyphens, and underscores, and must be 21 characters or less.";
                },
            }, {
                message: "timeStep (ms):",
                name: "timeStep",
                type: "input",
                validate: (value) => {
                    const timeStepNameRegExp = /^[1-9]+[0-9]*$/;
                    if (timeStepNameRegExp.test(value)) {
                        return true;
                    }
                    return "Time step must be positive number.";
                },
            }, {
                message: "breakTime (ms):",
                name: "breakTime",
                type: "input",
                validate: (value) => {
                    const timeStepNameRegExp = /^[1-9]+[0-9]*$/;
                    if (timeStepNameRegExp.test(value)) {
                        return true;
                    }
                    return "Break time must be positive number.";
                },
            }, {
                choices: [CHANNEL_CREATE, CHANNEL_CANCEL],
                message: helpers_1.separator,
                name: "option",
                type: "list",
            },
        ]).then((answers) => {
            helpers_1.clearConsole();
            switch (answers.option) {
                case CHANNEL_CREATE:
                    const apiCallArgs = {
                        name: answers.name,
                        validate: true,
                    };
                    const slack = new Slack(args.team.token);
                    process.stdout.write("About to create new private channel (group).\n");
                    let loadingScreenInterval = helpers_1.loadingScreen();
                    slack.api("groups.create", apiCallArgs, (err, response) => {
                        if (err) {
                            clearInterval(loadingScreenInterval);
                            _errorCallback(err.message, args, router);
                        }
                        else if (response.ok === true) {
                            clearInterval(loadingScreenInterval);
                            process.stdout.write("\nAbout to invite bot to newly created channel.\n");
                            loadingScreenInterval = helpers_1.loadingScreen();
                            // Invite app bot into channel.
                            const apiCallArgs = {
                                channel: response.group.id,
                                user: botId,
                            };
                            slack.api("groups.invite", apiCallArgs, (err, response2) => {
                                if (err) {
                                    clearInterval(loadingScreenInterval);
                                    _errorCallback(err.message, args, router);
                                }
                                else if (response.ok === true) {
                                    clearInterval(loadingScreenInterval);
                                    process.stdout.write("\nCreating channel in Firebase now.\n");
                                    loadingScreenInterval = helpers_1.loadingScreen();
                                    const currentDate = new Date();
                                    const channelFirebaseValues = {
                                        active: true,
                                        breakTime: parseInt(answers.breakTime, 10),
                                        currentGame: null,
                                        name: response.group.name,
                                        // Set next game time to now + break time like break has just begun.
                                        nextGame: currentDate.getTime() + parseInt(answers.breakTime, 10),
                                        phase: "BREAK" /* BREAK */,
                                        timeStep: parseInt(answers.timeStep, 10),
                                    };
                                    channel_1.Channel.setChannel(channelFirebaseValues, args.team.$key, response.group.id)
                                        .then(() => {
                                        clearInterval(loadingScreenInterval);
                                        helpers_1.clearConsole();
                                        router.channelsRoute(args, router);
                                    }, (error) => {
                                        clearInterval(loadingScreenInterval);
                                        _errorCallback(`Actually Slack Channel being created... BUT!\n\n${error.message}`, args, router);
                                    });
                                }
                                else {
                                    clearInterval(loadingScreenInterval);
                                    _errorCallback(`Something went wrong during invitation of bot user into channel: ${response2.error}`, args, router);
                                }
                            });
                        }
                        else {
                            clearInterval(loadingScreenInterval);
                            _errorCallback(`Something went wrong. Probably this channel name already being taken by some archived channel: ${response.error}`, args, router);
                        }
                    });
                    break;
                case CHANNEL_CANCEL:
                    router.channelsRoute(args, router);
                    break;
                default:
                    process.exit(1);
                    break;
            }
        });
    }
    else {
        _errorCallback("Something went wrong: botId is not set for this team.", args, router);
    }
}
exports.channelCreateRoute = channelCreateRoute;
function _errorCallback(message, args, router) {
    inquirer.prompt([
        {
            choices: [ERROR_BACK],
            message: `Error occurred: ${message}`,
            name: "option",
            type: "list",
        },
    ]).then((answers) => {
        switch (answers.option) {
            case ERROR_BACK:
                router.channelsRoute(args, router);
                break;
            default:
                process.exit(1);
                break;
        }
    });
}
//# sourceMappingURL=channelcreate.js.map