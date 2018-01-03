export type SlackActionSubmissionButton = {
  name: string,
  value: string,
};

export type SlackActionSubmissionSelect = {
  name: string,
  selected_options: [SlackMessageActionSelectOption],
};

// Operator OR doesn't work.
export type SlackActionSubmission = SlackActionSubmissionButton & SlackActionSubmissionSelect;

export type ParsedSlackActionPayload = {
  actions: SlackActionSubmission[],
  action_ts: string,
  attachment_id: string,
  callback_id: string,
  channel: {
    name: string,
    id: string,
  },
  is_app_unfurl: boolean,
  message_ts: string,
  response_url: string,
  team: {
    domain: string,
    id: string,
  },
  token: string,
  trigger_id: string,
  type: string,
  user: {
    name: string,
    id: string,
  },
};

export type SlackCommandRequestBody = {
  channel_id: string,
  channel_name: string,
  command: string,
  response_url: string,
  team_domain: string,
  team_id: string,
  text: string,
  token: string,
  trigger_id: string,
  user_id: string,
  user_name: string,
};

export type SlackMessageActionButton = {
  name: string,
  text: string,
  value: string,
  type: "button",
};

export type SlackMessageActionSelectOption = {
  text: string,
  value: string,
};

export type SlackMessageActionSelect = {
  text: string,
  name: string,
  type: "select",
  options: SlackMessageActionSelectOption[],
};

export type SlackMessageAction = SlackMessageActionButton|SlackMessageActionSelect;

export type SlackMessageAttachmentField = {
  title: string,
  value: string,
  short?: boolean,
};

export type SlackMessageAttachment = {
  color: string,
  mrkdwn_in?: string[],
  callback_id: string,
  text?: string,
  author_name?: string,
  attachment_type: "default",
  fields?: SlackMessageAttachmentField[],
  actions?: SlackMessageAction[],
};
