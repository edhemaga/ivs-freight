import { environment } from 'src/environments/environment';
import { Configuration, ConfigurationParameters } from './../../appcoretruckassist/configuration';

export const configFactory = (): Configuration => {
    const params: ConfigurationParameters = {
        basePath: environment.API_ENDPOINT
    }
    return new Configuration(params);
}