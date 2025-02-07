import {
    IPlaidLinkOnEvent,
    IPlaidLinkOnExit,
    IPlaidLinkOnLoad,
    IPlaidLinkOnSuccess,
} from '@shared/models';

export interface IPlaidLinkOptions {
    token: string;
    onSuccess?: IPlaidLinkOnSuccess;
    onExit?: IPlaidLinkOnExit;
    onLoad?: IPlaidLinkOnLoad;
    onEvent?: IPlaidLinkOnEvent;
}

export interface IPlaidCreated {
    open(): void;
}

export interface IPlaid {
    create(config: IPlaidLinkOptions): IPlaidCreated;
}
