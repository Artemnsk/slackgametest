"use strict";

const stdout = process.stdout;
const inquirer = require('inquirer');
const setTeam = require('../../models/team/teams').setTeam;
const helpers = require('../helpers');

const Slack = require('slack-node');

const TEAM_EDIT_SAVE = 'Save';
const TEAM_EDIT_CANCEL = 'Cancel';
const TEAM_ACTIVE_TRUE = 'true';
const TEAM_ACTIVE_FALSE = 'false';
const ERROR_TRY_AGAIN = 'Try Again';
const ERROR_BACK = 'Back';

module.exports = teamEditRoute;

/**
 * @typedef {Function} TeamEditRoute
 * @param {{team: Team}} args
 * @param {InstallationRouter} router
 */
function teamEditRoute(args, router) {
  helpers.clearConsole();
  var loadingScreen = helpers.loadingScreen();
  const slack = new Slack(args.team.token);
  // Get users list from Slack team.
  let apiCallArgs = {
    include_locale: false,
    limit: 0,
    presence: false
  };
  slack.api("users.list", apiCallArgs, function(err, response) {
    clearInterval(loadingScreen);
    if (err) {
      _errorCallback(err.error.message, args, router);
    } else if(response.ok === true) {
      var adminDefaultOption = undefined;
      const slackUserOptions = response.members.map(member => {
        let optionName = member.profile.real_name + ' [' + member.id + ']';
        if (member.id === args.team.admin) {
          adminDefaultOption = optionName;
        }
        return optionName;
      });
      stdout.write('TEAM INFO\n');
      stdout.write('$key: ' + args.team.$key + '\n');
      stdout.write('name: ' + args.team.name + '\n');
      stdout.write('token: ' + args.team.token + '\n');
      stdout.write('userId: ' + args.team.userId + '\n');
      stdout.write('botId: ' + args.team.botId + '\n');
      stdout.write('botToken: ' + args.team.botToken + '\n');
      inquirer.prompt([
        {
          type: 'list',
          name: 'admin',
          paginated: true,
          message: 'Admin user:',
          default: adminDefaultOption,
          choices: slackUserOptions
        },
        {
          type: 'list',
          name: 'active',
          message: 'active',
          default: args.team.active === true ? TEAM_ACTIVE_TRUE : TEAM_ACTIVE_FALSE,
          choices: [TEAM_ACTIVE_TRUE, TEAM_ACTIVE_FALSE]
        }, {
          type: 'list',
          name: 'option',
          message: helpers.separator,
          choices: [TEAM_EDIT_SAVE, TEAM_EDIT_CANCEL]
        }
      ]).then((/** {active: string, option: string, admin: string} */ answers) => {
        helpers.clearConsole();
        switch(answers.option) {
          case TEAM_EDIT_SAVE:
            let teamFirebaseValues = args.team.getFirebaseValue();
            // Retrieve admin value.
            let admin = answers.admin.replace(/^.*\[(.*)\]$/i, '$1');
            teamFirebaseValues.admin = admin;
            let active = answers.active === TEAM_ACTIVE_TRUE;
            teamFirebaseValues.active = active;
            var loadingScreen = helpers.loadingScreen();
            setTeam(teamFirebaseValues, args.team.$key)
              .then(() => {
                clearInterval(loadingScreen);
                helpers.clearConsole();
                router.teamRoute({ teamKey: args.team.$key }, router);
              }, (error) => {
                clearInterval(loadingScreen);
                _errorCallback(error.message, args, router);
              });
            break;
          case TEAM_EDIT_CANCEL:
            router.teamRoute({ teamKey: args.team.$key }, router);
            break;
        }
      });
    } else {
      _errorCallback('Something went wrong during Slack users.list API call.', args, router);
    }
  });
}

/**
 *
 * @param {string} message
 * @param {{team: Team}} args
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
        router.teamEditRoute(args, router);
        break;
      case ERROR_BACK:
        router.teamRoute({ teamKey: args.team.$key }, router);
        break;
    }
  });
}