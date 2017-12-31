/**
 * @typedef {Object} SlackMessageActionButton
 * @property {string} name
 * @property {string} text
 * @property {'button'} type
 * @property {string} value
 */

/**
 * @typedef {Object} SlackMessageActionSelectOption
 * @property {string} text
 * @property {string} value
 */

/**
 * @typedef {Object} SlackMessageActionSelect
 * @property {string} name
 * @property {string} text
 * @property {'select'} type
 * @property {Array<SlackMessageActionSelectOption>} options
 */

/**
 * @typedef {SlackMessageActionButton | SlackMessageActionSelect} SlackMessageAction
 */

/**
 * @typedef {Object} SlackMessageAttachmentField
 * @property {string} title
 * @property {string} value
 * @property {boolean} [short]
 */

/**
 * @typedef {Object} SlackMessageAttachment
 * @property {string} color
 * @property {'default'} attachment_type
 * @property {string} callback_id
 * @property {string} [text]
 * @property {string} [author_name]
 * @property {Array<SlackMessageAttachmentField>} [fields]
 * @property {Array<SlackMessageAction>} [actions]
 */