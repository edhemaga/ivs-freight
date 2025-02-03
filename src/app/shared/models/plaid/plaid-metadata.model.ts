import {
    IPlaidAccount,
    IPlaidInstitution
} from "..";

export interface IPlaidLinkOnExitMetadata {
    institution: null | IPlaidInstitution;
    status: null | string;
    link_session_id: string;
    request_id: string;
}

export interface IPlaidLinkOnEventMetadata {
    error_type: null | string;
    error_code: null | string;
    error_message: null | string;
    exit_status: null | string;
    institution_id: null | string;
    institution_name: null | string;
    institution_search_query: null | string;
    mfa_type: null | string;
    view_name: null | string;
    selection: null | string;
    timestamp: string;
    link_session_id: string;
    request_id: string;
}
export interface IPlaidLinkOnSuccessMetadata {
    institution: null | IPlaidInstitution;
    accounts: Array<IPlaidAccount>;
    link_session_id: string;
    transfer_status?: string;
}