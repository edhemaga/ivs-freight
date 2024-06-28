import { Observable, of } from "rxjs";

export class ChatService {
    constructor() { }

    getCompanyUserList(): Observable<any[]> {
        return of([]);
    }
}