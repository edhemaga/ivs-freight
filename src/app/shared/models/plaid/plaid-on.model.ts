import { EPlaidLinkStableEvent } from "@shared/enums";

// Models
import {
    IPlaidLinkError,
    IPlaidLinkOnEventMetadata,
    IPlaidLinkOnExitMetadata,
    IPlaidLinkOnSuccessMetadata
} from '@shared/models';

export type IPlaidLinkOnSuccess = (
    public_token: string,
    metadata: IPlaidLinkOnSuccessMetadata
) => void;

export type IPlaidLinkOnExit = (
    error: null | IPlaidLinkError,
    metadata: IPlaidLinkOnExitMetadata
) => void;

export type IPlaidLinkOnEvent = (
    eventName: EPlaidLinkStableEvent | string,
    metadata: IPlaidLinkOnEventMetadata
) => void;

export type IPlaidLinkOnLoad = () => void;
