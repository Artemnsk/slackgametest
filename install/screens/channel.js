"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer = require("inquirer");
const channel_1 = require("../../models/channel/channel");
const helpers_1 = require("../helpers");
const stdout = process.stdout;
const CHANNEL_START_GAME = "Start Game";
const CHANNEL_OVER_GAME = "Over Game";
const CHANNEL_BACK = "Back";
const ERROR_TRY_AGAIN = "Try Again";
const ERROR_BACK = "Back";
function channelRoute(args, router) {
    const loadingScreenInterval = helpers_1.loadingScreen();
    channel_1.Channel.getChannel(args.team.$key, args.channelKey)
        .then((channel) => {
        clearInterval(loadingScreenInterval);
        if (channel !== null) {
            helpers_1.clearConsole();
            stdout.write("CHANNEL INFO\n");
            stdout.write(`$key: ${channel.$key}\n`);
            stdout.write(`name: ${channel.name}\n`);
            stdout.write(`phase: "${channel.phase}"\n`);
            stdout.write(`timeStep: ${channel.timeStep}\n`);
            stdout.write(`breakTime: ${channel.breakTime}\n`);
            stdout.write(`nextGame: ${channel.nextGame ? channel.nextGame : "NOT SET"} ${channel.nextGame ? `[${new Date(channel.nextGame)}]` : ""}\n`);
            stdout.write(`currentGame: [${channel.currentGame ? channel.currentGame : "NOT SET"}]\n`);
            stdout.write(`active: ${(channel.active === true ? "true" : "false")}\n`);
            // TODO: show details of current game if exists.
            inquirer.prompt([
                {
                    // TODO:
                    choices: [
                        {
                            disabled: channel.phase !== "BREAK" /* BREAK */ ? `Disabled: phase is not "${"BREAK" /* BREAK */}"` : "",
                            name: CHANNEL_START_GAME,
                        }, {
                            disabled: channel.phase !== "IN_GAME" /* IN_GAME */ ? `Disabled: phase is not "${"IN_GAME" /* IN_GAME */}"` : "",
                            name: CHANNEL_OVER_GAME,
                        },
                        CHANNEL_BACK,
                    ],
                    message: helpers_1.separator,
                    name: "option",
                    type: "list",
                },
            ]).then((answers) => {
                helpers_1.clearConsole();
                switch (answers.option) {
                    case CHANNEL_OVER_GAME:
                        router.channelOverGameRoute({ team: args.team, channel }, router);
                        break;
                    case CHANNEL_START_GAME:
                        router.channelStartGameRoute({ team: args.team, channel }, router);
                        break;
                    case CHANNEL_BACK:
                        router.channelsRoute({ team: args.team }, router);
                        break;
                    default:
                        process.exit(1);
                        break;
                }
            });
        }
        else {
            _errorCallback("Channel doesn't exist.", args, router);
        }
    }, (error) => {
        clearInterval(loadingScreenInterval);
        _errorCallback(error.message, args, router);
    });
}
exports.channelRoute = channelRoute;
/**
 *
 * @param {string} message
 * @param {{team: Team, channelKey: string}} args
 * @param {InstallationRouter} router
 */
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
                router.channelRoute(args, router);
                break;
            case ERROR_BACK:
                router.channelsRoute({ team: args.team }, router);
                break;
        }
    });
}
//# sourceMappingURL=channel.js.map