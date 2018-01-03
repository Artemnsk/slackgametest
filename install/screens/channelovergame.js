"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer = require("inquirer");
const helpers_1 = require("../helpers");
const CHANNEL_OVER_GAME_OK = "Over Game";
const CHANNEL_OVER_GAME_BACK = "Back";
const ERROR_BACK = "Back";
function channelOverGameRoute(args, router) {
    inquirer.prompt([
        {
            choices: [CHANNEL_OVER_GAME_OK, CHANNEL_OVER_GAME_BACK],
            message: `Over game in Channel ${args.channel.name}[${args.channel.$key}]?`,
            name: "option",
            type: "list",
        },
    ]).then((answers) => {
        switch (answers.option) {
            case CHANNEL_OVER_GAME_OK:
                helpers_1.clearConsole();
                const loadingScreenInterval = helpers_1.loadingScreen();
                args.channel.overGame()
                    .then(() => {
                    clearInterval(loadingScreenInterval);
                    helpers_1.clearConsole();
                    router.channelRoute({ team: args.team, channelKey: args.channel.$key }, router);
                }, (err) => {
                    clearInterval(loadingScreenInterval);
                    _errorCallback(err.message, args, router);
                });
                break;
            case CHANNEL_OVER_GAME_BACK:
                helpers_1.clearConsole();
                router.channelRoute({ team: args.team, channelKey: args.channel.$key }, router);
                break;
            default:
                process.exit(1);
                break;
        }
    });
}
exports.channelOverGameRoute = channelOverGameRoute;
function _errorCallback(message, args, router) {
    helpers_1.clearConsole();
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
                helpers_1.clearConsole();
                router.channelRoute({ team: args.team, channelKey: args.channel.$key }, router);
                break;
            default:
                process.exit(1);
                break;
        }
    });
}
//# sourceMappingURL=channelovergame.js.map