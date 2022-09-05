import { DispatcherStore } from './dispatcher.store';
import { Injectable } from "@angular/core";
import { CreateDispatchCommand, DispatchService, UpdateDispatchBoardCommand, UpdateDispatchCommand } from 'appcoretruckassist';

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

    getDispatchboardById(id: number){
        return this.dispatchService.apiDispatchBoardIdGet(id);
    }

    getDispatchBoardRowById(id: number){
        return this.dispatchService.apiDispatchIdGet(id);
    }

    createDispatchBoard(createData: CreateDispatchCommand){
        return this.dispatchService.apiDispatchPost(createData).subscribe(res => {
            console.log("RESULT OF CREATING DISPATCHBOARD", res);
        });
    }

    updateDispatchBoard(updateData: UpdateDispatchCommand){
        return this.dispatchService.apiDispatchPut(updateData).subscribe( res => {
            console.log("RESULT OF UPDATED DISPATCHBOARD", res);
        });
    }

    set dispatcherData(list){
        this.dispatcherStore.update((store) => ({
            ...store,
            modal: list[0],
            dispatchList: list[1]
        }));
    }
}
