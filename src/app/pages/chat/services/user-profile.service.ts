import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';

// Models
import { ConversationInfoResponse } from "appcoretruckassist";

@Injectable({
    providedIn: 'root',
})
export class UserProfileService {
    private userProfile: BehaviorSubject<ConversationInfoResponse | null> =
        new BehaviorSubject(null);

    public getProfile(): Observable<ConversationInfoResponse> {
        return new Observable((observer) => {
            observer.next(this.userProfile.value);
        })
    }

    public setProfile(profileDetails: ConversationInfoResponse): void {
        this.userProfile.next(profileDetails);
    }
}