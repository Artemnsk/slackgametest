// See https://api.slack.com/docs/oauth

export type SlackOAuthRequestStep1 = {
  client_id: string,
  scope: string,
  redirect_uri?: string,
  state?: string,
  team?: string,
};

export type SlackOAuthResponseStep2 = {
  code: string,
  state?: string,
};

export type SlackOAuthRequestStep3 = {
  client_id: string,
  client_secret: string,
  code: string,
  redirect_uri: string,
};

type SlackAPIError = {
  ok: false,
  error: string, // TODO: enum. Template?
};

type SlackOAuthResponseStep3Success = {
  ok: true,
  access_token: string,
  scope: string,
  team_name: string,
  team_id: string,
  incoming_webhook: {
    url: string,
    channel: string,
    configuration_url: string,
  },
  bot?: {
    bot_user_id: string,
    bot_access_token: string,
  },
  user_id: string,
};

export type SlackOAuthResponseStep3 = SlackAPIError & SlackOAuthResponseStep3Success;
