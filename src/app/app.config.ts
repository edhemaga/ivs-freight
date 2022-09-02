import { environment } from 'src/environments/environment';
import {
  Configuration,
  ConfigurationParameters,
} from './../../appcoretruckassist/configuration';

import { UserLoggedService } from './core/components/authentication/state/user-logged.service';

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
