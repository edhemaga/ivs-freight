import { DocumentAction } from '../components/settings/settings-document/state/enum/settings-document.enum';
import { FileEvent } from './file-event.model';

type DocumentActionFunction = (event: FileEvent) => void;

export interface DocumentActionConfig {
    [key: string]: DocumentActionFunction;
}
