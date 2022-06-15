import { environment } from 'src/environments/environment';
import {
  Configuration,
  ConfigurationParameters,
} from './../../appcoretruckassist/configuration';

export const configFactory = (token?: string): Configuration => {
  const params: ConfigurationParameters = {
    basePath: environment.API_ENDPOINT,
    credentials: { Bearer: token },
  };
  console.log('configFactory');
  console.log(params);
  return new Configuration(params);
};
