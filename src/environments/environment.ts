// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  API_ENDPOINT: 'https://api-stage.truckassist.io/api/v2/',
  APPLICANT_API_ENDPOINT: 'https://applicants-api.truckassist.io/api',
  production: false,
  perPage: 1000,
  page: 1,
  dateFormat: {
    displayFormat: 'MM/dd/yy',
    inputFormat: 'MM/dd/yy',
  },
  baseSocketUrl: 'https://chat.truckassist.io',
  baseChatApiUrl: 'https://chat.truckassist.io/api/v1',
  messageLimit: 25
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
