import {
    Configuration,
    ConfigurationParameters,
} from './../../appcoretruckassist/configuration';

import { environment } from '../environments/environment';

import { UserLoggedService } from './pages/website/state/service/user-logged.service';

export const configFactory = (
    userLoggedService?: UserLoggedService
): Configuration => {
    const params: ConfigurationParameters = {
        basePath: environment.API_ENDPOINT,
        credentials: {
            bearer: userLoggedService.getAccessToken.bind(userLoggedService),
            'x-api-key': 'f72ad2c9-d4a6-46c5-9093-7085d43cf6b2',
        },
    };
    return new Configuration(params);
};
