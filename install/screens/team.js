"use strict";

const stdout = process.stdout;
const inquirer = require('inquirer');
const getTeam = require('../../models/team/teams').getTeam;
const helpers = require('../helpers');

const Slack = require('slack-node');

const TEAM_EDIT = 'Edit';
const TEAM_CHANNELS = 'View Channels';
const TEAM_BACK = 'Back';
const ERROR_TRY_AGAIN = 'Try Again';
const ERROR_BACK = 'Back';

module.exports = teamRoute;

/**
 * @typedef {Function} TeamRoute
 * @param {{teamKey: string}} args
 * @param {InstallationRouter} router
 */
function teamRoute(args, router) {
  var loadingScreen = helpers.loadingScreen();
  getTeam(args.teamKey)
    .then((team) => {
      if (team.admin) {
        let apiCallArgs = {
          user: team.admin,
          // TODO:
          include_locale: false
        };
        const slack = new Slack(team.token);
        slack.api("users.info", apiCallArgs, (err, /** SlackUserInfoResponse */ response) => {
          if (err || response.ok !== true) {
            clearInterval(loadingScreen);
            helpers.clearConsole();
            teamViewPart(args, router, team, team.admin + ' ERROR: ' + (err ? err.error : 'MAYBE THIS USER DOESN\'T EXIST ANYMORE'));
          } else if(response.ok === true) {
            clearInterval(loadingScreen);
            helpers.clearConsole();
            teamViewPart(args, router, team, response.user.profile.real_name + ' [' + response.user.id + ']');
          }
        });
      } else {
        clearInterval(loadingScreen);
        helpers.clearConsole();
        teamViewPart(args, router, team, 'WARNING! NOT SET!');
      }
    }, (error) => {
      clearInterval(loadingScreen);
      _errorCallback(error.message, args, router);
    });
}

/**
 * Used to build team info depends on different team admin values.
 * @param {{teamKey: string}} args
 * @param {InstallationRouter} router
 * @param {Team} team
 * @param {string} teamAdminLabel
 */
function teamViewPart(args, router, team, teamAdminLabel) {
  stdout.write('TEAM INFO\n');
  stdout.write('$key: ' + team.$key + '\n');
  stdout.write('name: ' + team.name + '\n');
  stdout.write('token: ' + team.token + '\n');
  stdout.write('userId: ' + team.userId + '\n');
  stdout.write('botId: ' + team.botId + '\n');
  stdout.write('botToken: ' + team.botToken + '\n');
  stdout.write('admin: ' + teamAdminLabel + '\n');
  stdout.write('active: ' + (team.active === true ? 'true' : 'false') + '\n');
  let choices = team.admin ? [TEAM_EDIT, TEAM_CHANNELS, TEAM_BACK] : [TEAM_EDIT, { name: TEAM_CHANNELS, disabled: 'Set app admin for this Slack team first.'}, TEAM_BACK];
  inquirer.prompt([
    {
      type: 'list',
      name: 'option',
      message: helpers.separator,
      choices: choices
    }
  ]).then((/** {option: string} */ answers) => {
    helpers.clearConsole();
    switch(answers.option) {
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

/**
 *
 * @param {string} message
 * @param {{teamKey: string}} args
 * @param {InstallationRouter} router
 */
function _errorCallback(message, args, router) {
  helpers.clearConsole();
  inquirer.prompt([
    {
      type: 'list',
      name: 'option',
      message: "Error occurred: " + message,
      choices: [ERROR_TRY_AGAIN, ERROR_BACK]
    }
  ]).then((/** {option: string} */ answers) => {
    switch(answers.option) {
      case ERROR_TRY_AGAIN:
        router.teamRoute(args, router);
        break;
      case ERROR_BACK:
        router.teamsRoute(router);
        break;
    }
  });
}