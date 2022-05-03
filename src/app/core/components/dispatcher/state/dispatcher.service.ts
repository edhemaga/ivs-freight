import { DispatcherStore } from './dispatcher.store';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { SharedService } from "src/app/core/services/shared/shared.service";

@Injectable({ providedIn: "root" })
export class DispatcherStoreService {

    public parkingOpened: boolean = false;

    constructor(private dispatcherStore: DispatcherStore, private http: HttpClient, private sharedService: SharedService) { }
    getDispatcherList() {
        return this.http.get(environment.API_ENDPOINT + 'select/dispatcher/list');
    }

    set dispatcherList(list){
        this.dispatcherStore.update((store) => ({
            ...store,
            dispatchers: list
        }));
    }
}
