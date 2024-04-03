import { FileEvent } from './file-event.model';

type DocumentActionFunction = (event: FileEvent) => void;

export interface DocumentActionConfig {
    [key: string]: DocumentActionFunction;
}
