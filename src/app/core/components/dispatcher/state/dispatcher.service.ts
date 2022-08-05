import { DispatcherStore } from './dispatcher.store';
import { Injectable } from "@angular/core";
import { DispatchService } from 'appcoretruckassist';

@Injectable({ providedIn: "root" })
export class DispatcherStoreService {

    public parkingOpened: boolean = false;

    constructor(private dispatcherStore: DispatcherStore, private dispatchService: DispatchService) { }
    getDispatcherList() {
        return this.dispatchService.apiDispatchModalGet();
    }

    getDispatchboardList(){
        return this.dispatchService.apiDispatchBoardListGet();
    }

    set dispatcherData(list){
        this.dispatcherStore.update((store) => ({
            ...store,
            modal: list[0],
            dispatchList: list[1]
        }));
    }
}
