// Fake data only: the form is on a live site.
export const validCallBackData = {
  name: 'Evgeni',
  email: 'test@example.com',
  phone: '000-0000000',
  company: 'EvgAutomation',
  website: 'https://example.com',
};

// Same as valid data, but the website has no https:// (the field needs a full URL).
export const websiteWithoutProtocolData = {
  ...validCallBackData,
  website: 'example.com',
};

export const employeesRange = {
  default: '1-10',
  bonus: '51-500',
};

export const SCREENSHOT_PATH = 'screenshots/request-callback.png';
