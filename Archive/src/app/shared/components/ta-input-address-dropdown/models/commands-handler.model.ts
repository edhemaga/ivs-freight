import type { CommandProperties } from '@shared/components/ta-input-address-dropdown/models/command-properties.model';

export interface CommandsHandler {
    commands: {
        firstCommand: CommandProperties;
        secondCommand: CommandProperties;
    };
}
