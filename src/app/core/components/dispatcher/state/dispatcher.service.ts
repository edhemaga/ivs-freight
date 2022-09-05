import { DispatcherStore } from './dispatcher.store';
import { Injectable } from "@angular/core";
import { CreateDispatchCommand, DispatchService, UpdateDispatchBoardCommand, UpdateDispatchCommand } from 'appcoretruckassist';
import { flatMap, ObservableInput, pipe } from 'rxjs';

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

    createDispatchBoard(createData: CreateDispatchCommand, dispatch_id: number){
        return this.dispatchService.apiDispatchPost(createData)
        .pipe(
            flatMap(params => {
                console.log("params", params);
                return this.getDispatchBoardRowById(params.id)
            })
        )
        .subscribe(res => {
            console.log("ADDED OF CREATING DISPATCHBOARD", res);
        });
    }

    updateDispatchBoard(updateData: UpdateDispatchCommand, dispatch_id: number){
        return this.dispatchService.apiDispatchPut(updateData)
        .pipe(
            flatMap(params => {
                return this.getDispatchBoardRowById(updateData.id)
            })
        )
        .subscribe( res => {
            console.log("RESULT OF UPDATED DISPATCHBOARD", res);

        });
    }

    set dispatchBoardItem(boardData){
        this.dispatcherStore.update((store) => ({
            ...store,
            dispatchList: store.dispatchList.map(item => {
                if(item.id == boardData.id){
                    item.dispatches.map(data => {
                        if(data.id == boardData.item.id){
                            data = boardData.item;
                        }
                        return data;
                    })
                }
                return item;
            })
        }));   
    }

    set dispatcherData(list){
        this.dispatcherStore.update((store) => ({
            ...store,
            modal: list[0],
            dispatchList: list[1]
        }));
    }
}
