import { DocumentAction } from 'src/app/pages/settings/enums/settings-document.enum';
import { FileEvent } from './file-event.model';

type DocumentActionFunction = (event: FileEvent) => void;

export interface DocumentActionConfig {
    [key: string]: DocumentActionFunction;
}
