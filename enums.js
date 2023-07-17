export const websiteStatuses = {
  NO_STATUS: 'No status',
  PENDING: 'pending',
  ABOUT_TO_BE_ACTIVE: 'About to be active',
  ACTIVE: 'active',
  ABOUT_TO_BE_INACTIVE: 'About to be inactive',
  INACTIVE: 'inactive',
  ABOUT_TO_BE_DELETED: 'About to be deleted',
  DELETED: 'deleted',
  BACKUP: 'backup',
  ABOUT_TO_BE_RESTORED: 'About to be restored',
};
export const errorMessages = {
  NOT_PERMISSIONS: 'You do not have permissions',
  INVALID_TOKEN: 'Invalid token',
  WEBSITE_NOT_FOUND: 'Website not found',
  UNAUTHORIZED_USER_ID: 'Unauthorized user code',
  COULD_NOT_DELETE_THE_WEBSITE: 'Couldn\'t delete the website',
  THE_VALIDATE_IS_NOT_PROPER: 'The validate is not proper',
  WEBSITE_HAS_ALREADY_BEEN_DELETED: 'Website has already been deleted',
  WEBSITE_IS_ALREADY_PENDING: 'Website status is already pending',
  WEBSITE_IS_ALREADY_INACTIVE: 'Website status is already inactive',
  WEBSITE_IS_IN_PROCESS_OF_DELETION: 'Website is in process of deletion',
  INTERNAL_SEVERAL_ERROR: 'Internal several error',
  BECEND_NOT_FOUND: 'becend doesn\'t found',
  BECEND_IS_ALREADY_RESTORED: 'becend is already restored',
  BECEND_IS_IN_PROCESS_OF_restored: 'becend is in process of restored',
};
export const messages = {
  THE_WEBSITE_IS_GOING_TO_BE_DELETED: 'The website is going to be deleted',
  THE_WEBSITE_HAS_BEEN_SUCCESSFULLY_DELETED: 'the website has been successfully deleted',
};
export const collectionNames = {
  Website: 'Website',
  Backup: 'Backup',
};
export const queuesNames = {
  DELETE_WEBSITE: 'deleteWebsite',
  CREATE_WEBSITE: 'createWebsite',
  CREATE_BACKUP: 'createBackup',
  CHANGE_STATUS: 'changeStatus',
  CREATE_BECEND: 'createbecend',
};
