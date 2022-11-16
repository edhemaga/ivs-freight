import {
   Configuration,
   ConfigurationParameters,
} from './../../appcoretruckassist/configuration';

import { UserLoggedService } from './core/components/authentication/state/user-logged.service';
import { environment } from '../environments/environment';

export const configFactory = (
   userLoggedService?: UserLoggedService
): Configuration => {
   const params: ConfigurationParameters = {
      basePath: environment.API_ENDPOINT,
      credentials: {
         bearer: userLoggedService.getAccessToken.bind(userLoggedService),
      },
   };
   return new Configuration(params);
};
