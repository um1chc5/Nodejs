export const USER_MESSAGES = {
  REQUIRED_EMAIL: 'Email is required',
  REQUIRED_ACCESS_TOKEN: 'Access token is required',
  REQUIRED_REFRESH_TOKEN: 'Refresh token is required',
  REQUIRED_EMAIL_VERIFY_TOKEN: 'Email verify token is required',
  REQUIRED_FORGOT_PASSWORD_TOKEN: 'Forgot password token is required',
  REQUIRED_NEW_PASSWORD: 'New password is required',
  REQUIRED_USERNAME: 'Username is required',
  REQUIRED_USER_ID: 'Username is required',
  INVALID_USER_ID: 'User id is invalid',
  CHANGE_PASSWORD_SUCCESSFULLY: 'Change password successfully',
  REFRESH_TOKEN_SUCCESSFULLY: 'Refresh token successfully',
  REFRESH_TOKEN_INVALID: 'Refresh token is invalid',
  REFRESH_TOKEN_UNAVAILABLE: 'Refresh token is unavailable or duplicated',
  EXISTED_EMAIL: 'Email is already existed',
  LOGIN_SUCCESSFULLY: 'Login successfully',
  LOGOUT_SUCCESSFULLY: 'Logout successfully',
  EMAIL_OR_PASSWORD_INCORRECT: 'Email or password is incorrect',
  EMAIL_VERIFY_SUCCESSFULLY: 'Email verify successfully',
  EMAIL_VERIFY_TOKEN_INVALID: 'Email verify token is invalid',
  EMAIL_VERIFY_TOKEN_EXPIRED: 'Email verify token is expired',
  EMAIL_VERIFY_TOKEN_UNAVAILABLE: 'Email verify token is unavailable or duplicated',
  EMAIL_VERIFIED: 'Email verified',
  USER_NOT_FOUND: 'User not found',
  USERNAME_EXISTED: 'User name already exists',
  INVALID_USERNAME: 'Invalid username',
  VALIDATION_ERROR: 'Validation error',
  RESEND_VERIFY_EMAIL_SUCCESSFULLY: 'Resend verify email successfully',
  FORGOT_PASSWORD_TOKEN_VALID: 'Forgot password token is valid',
  FORGOT_PASSWORD_TOKEN_INVALID: 'Forgot password token is invalid',
  VERIFY_FORGOT_PASSWORD_SUCCESSFULLY: 'Verify forgot password token successfully',
  PASSWORD_NOT_MATCH: 'Passwords do not match',
  GET_PROFILE_SUCCESSFULLY: 'Get profile successfully',
  USER_NOT_VERIFIED: 'User is not verified',
  UPDATE_PROFILE_SUCCESSFULLY: 'Update profile successfully',
  ADD_FOLLOW_SUCCESSFULLY: 'Add follow to profile successfully',
  REMOVE_FOLLOW_SUCCESSFULLY: 'Remove follow from profile successfully',
  FOLLOW_EXISTED: 'This user has already been followed',
  FOLLOW_NOT_EXISTED: 'This user has not been followed yet',
  OLD_PASSWORD_NOT_MATCH: 'Old password does not match',
  PASSWORD_NOT_CHANGE: 'New password must be different from old password',
  EMAIL_NOT_VERIFIED: 'Email is not verified'
} as const

export const MEDIA_MESSAGES = {
  UPLOAD_IMAGE_SUCCESSFULLY: 'Upload image successfully',
  UPLOAD_VIDEO_SUCCESSFULLY: 'Upload video successfully',
  UPLOAD_VIDEO_HLS_SUCCESSFULLY: 'Upload HLS video successfully'
} as const

export const TWEET_MESSAGES = {
  INVALID_TWEET_ID: 'Invalid tweet id or tweet id is not found',
  INVALID_TWEET_TYPE: 'Invalid tweet type',
  INVALID_TWEET_AUDIENCE: 'Invalid tweet audience',
  PARENT_ID_REQUIRED: 'Parent ID required',
  PARENT_ID_NULL: 'Parent ID must be null in primary tweet',
  CONTENT_NOT_EMPTY_STRING: 'Content must not be empty string',
  CONTENT_MUST_EMPTY_STRING: 'Content must be empty string',
  HASHTAGS_MUST_STRINGS: 'Hashtags must be an array of strings',
  MENTION_INVALID_USER_ID: 'Mention invalid user id',
  INVALID_MEDIA_OBJECT: 'Invalid media object'
} as const

export const BOOKMARK_MESSAGES = {
  ADD_BOOKMARK_SUCCESSFULLY: 'Add bookmark successfully',
  DELETE_BOOKMARK_SUCCESSFULLY: 'Delete bookmark successfully'
} as const
