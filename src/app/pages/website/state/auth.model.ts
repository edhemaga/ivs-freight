import { HttpErrorResponse } from "@angular/common/http";

// models
import { SignInResponse } from "appcoretruckassist";

export interface LoginProps {
    email: string;
    password: string;
}

export interface AuthState {
    user: SignInResponse;
    error: HttpErrorResponse;
    loading: boolean;
    hideSIdebar: boolean;
}