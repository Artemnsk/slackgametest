import { Channel } from "../models/channel/channel";
import { Team } from "../models/team/team";
import { ChannelLoop } from "./channelloop";

// That will store all channel loops.
const channelLoops: ChannelLoop[] = [];

export function gameLoop(): void {
  Team.getTeams(true)
    .then((teams) => {
      for (const team of teams) {
        Channel.getChannels(team, true)
          .then((channels) => {
            for (const channel of channels) {
              const channelLoop = new ChannelLoop(channel);
              channelLoops.push(channelLoop);
            }
            // Start games.
            for (const channelLoop of channelLoops) {
              channelLoop.start();
            }
          });
      }
    });
}
