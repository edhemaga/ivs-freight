import {
    Configuration,
    ConfigurationParameters,
} from './../../appcoretruckassist/configuration';

import { environment } from '../environments/environment';

import { UserLoggedService } from './core/components/website/state/service/user-logged.service';

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
