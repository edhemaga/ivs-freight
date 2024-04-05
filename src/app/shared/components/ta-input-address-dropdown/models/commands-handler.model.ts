import type { CommandProperties } from './command-properties.model';

export interface CommandsHandler {
    commands: {
        firstCommand: CommandProperties;
        secondCommand: CommandProperties;
    };
}
