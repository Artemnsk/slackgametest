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

// See https://api.slack.com/methods/users.list

export type SlackUsersListRequest = {
  cursor?: string,
  include_locale?: boolean, // true
  limit?: number, // 0
  presence?: boolean, // true
};

type SlackUserInfo = {
  id: string,
  team_id: string,
  name: string,
  deleted: boolean,
  color: string,
  real_name: string,
  tz: string,
  tz_label: string,
  tz_offset: number,
  profile: {
    avatar_hash?: string,
    status_text?: string,
    status_emoji?: string,
    real_name: string,
    display_name: string,
    real_name_normalized: string,
    display_name_normalized: string,
    email: string,
    image_24: string,
    image_32: string,
    image_48: string,
    image_72: string,
    image_192: string,
    image_512: string,
    team: string,
  },
  is_admin: boolean,
  is_owner: boolean,
  is_primary_owner: boolean,
  is_restricted: boolean,
  is_ultra_restricted: boolean,
  is_bot: boolean,
  updated: number,
  is_app_user: boolean,
  has_2fa: boolean,
};

type SlackUsersListResponseSuccess = {
  ok: true,
  members: SlackUserInfo[],
  cache_ts: number,
  response_metadata: {
    next_cursor: string,
  },
};

export type SlackUsersListResponse = SlackAPIError & SlackUsersListResponseSuccess;

// See https://api.slack.com/methods/users.info

export type SlackUsersInfoRequest = {
  include_locale?: boolean, // true
  user: string,
};

type SlackUsersInfoResponseSuccess = {
  ok: true,
  user: SlackUserInfo,
};

export type SlackUsersInfoResponse = SlackAPIError & SlackUsersInfoResponseSuccess;

// See https://api.slack.com/methods/groups.create

export type SlackGroupsCreateRequest = {
  name: string,
  validate?: boolean, // true
};

type SlackGroupInfo = {
  id: string,
  name: string,
  is_group: string,
  created: number,
  creator: string,
  is_archived: boolean,
  is_open: boolean,
  last_read: string,
  latest: null, // TODO: other options?
  unread_count: number,
  unread_count_display: number,
  members: string[],
  topic: {
    value: string,
    creator: string,
    last_set: number,
  },
  purpose: {
    value: string,
    creator: string,
    last_set: number,
  },
};

type SlackGroupsCreateResponseSuccess = {
  group: SlackGroupInfo,
  ok: true,
};

export type SlackGroupsCreateResponse = SlackAPIError & SlackGroupsCreateResponseSuccess;

// See https://api.slack.com/methods/groups.invite

export type SlackGroupsInviteRequest = {
  channel: string,
  user: string,
};

type SlackGroupsInviteResponseSuccess = {
  ok: true,
  group: SlackGroupInfo,
  already_in_group?: true,
};

export type SlackGroupsInviteResponse = SlackAPIError & SlackGroupsInviteResponseSuccess;
