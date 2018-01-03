"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer = require("inquirer");
const channel_1 = require("../../models/channel/channel");
const helpers_1 = require("../helpers");
const LIST_BACK = "Back";
const NEW_CHANNEL = "Create new channel";
const ERROR_TRY_AGAIN = "Try again";
const ERROR_BACK = "Back";
function channelsRoute(args, router) {
    const loadingScreenInterval = helpers_1.loadingScreen();
    channel_1.Channel.getChannels(args.team.$key, true)
        .then((channels) => {
        clearInterval(loadingScreenInterval);
        helpers_1.clearConsole();
        const channelOptions = [];
        if (channels.length === 0) {
            channelOptions.push({
                disabled: "Create new game channel using option below",
                name: "This team has no active channels with game run.",
            });
        }
        else {
            channels.map((channel) => {
                channelOptions.push(`${channel.name} [${channel.$key}] ${channel.active ? "ACTIVE" : "NON-ACTIVE"}`);
            });
        }
        channelOptions.push(new inquirer.Separator());
        channelOptions.push(NEW_CHANNEL);
        channelOptions.push(LIST_BACK);
        inquirer.prompt([
            {
                choices: channelOptions,
                message: args.team.name + " team channels:",
                name: "channel",
                type: "list",
            },
        ]).then((answers) => {
            helpers_1.clearConsole();
            switch (answers.channel) {
                case NEW_CHANNEL:
                    router.channelCreateRoute(args, router);
                    break;
                case LIST_BACK:
                    router.teamRoute({ teamKey: args.team.$key }, router);
                    break;
                default:
                    // We suppose some channel being chosen.
                    const channelAnswerRegExp = /^.*\[(.*)\].*$/;
                    if (!channelAnswerRegExp.test(answers.channel)) {
                        _errorCallback("Invalid option chosen.", args, router);
                    }
                    else {
                        const channelKey = answers.channel.replace(channelAnswerRegExp, "$1");
                        // Load channel screen.
                        router.channelRoute({ team: args.team, channelKey }, router);
                    }
                    break;
            }
        });
    }, (error) => {
        clearInterval(loadingScreenInterval);
        _errorCallback(error.message, args, router);
    });
}
exports.channelsRoute = channelsRoute;
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
                router.channelsRoute(args, router);
                break;
            case ERROR_BACK:
                router.teamRoute({ teamKey: args.team.$key }, router);
                break;
        }
    });
}
//# sourceMappingURL=channels.js.map