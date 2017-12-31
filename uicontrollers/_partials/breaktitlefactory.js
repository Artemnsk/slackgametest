"use strict";

const moment = require('moment');

module.exports = breakTitleFactory;

const daySizeMs = 24 * 60 * 60 * 1000;

/**
 *
 * @param {string} callback_id
 * @param {Channel} channel
 * @param {Player} player
 * @return SlackMessageAttachment
 */
function breakTitleFactory(callback_id, channel, player) {
  let newGameTimer = _getNextGameTime(channel.nextGame);
  return {
    text: `:moneybag:${player.gold} Next game in ${newGameTimer}`,
    color: "#950001",
    callback_id,
    attachment_type: "default"
  };
}

/**
 *
 * @param {number} timestamp_ms
 * @return string
 * @private
 */
function _getNextGameTime(timestamp_ms) {
  let difference = timestamp_ms - Date.now();
  if (difference < 0) {
    return '..now!';
  } else if (difference > daySizeMs) {
    return '> 1 day';
  } else {
    let date = moment(difference).utc(false);
    return date.format("H:mm:ss");
  }
}