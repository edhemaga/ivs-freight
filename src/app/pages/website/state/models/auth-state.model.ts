import { HttpErrorResponse } from "@angular/common/http";

// models
import { SignInResponse } from "appcoretruckassist";

export interface AuthState {
    user: SignInResponse;
    error: HttpErrorResponse;
    loading: boolean;
    hideSIdebar: boolean;
}