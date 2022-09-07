import { DispatcherStore } from './dispatcher.store';
import { Injectable } from "@angular/core";
import { CreateDispatchCommand, DispatchService, UpdateDispatchBoardCommand, UpdateDispatchCommand } from 'appcoretruckassist';
import { flatMap, delay, debounce, of, interval } from 'rxjs';
import { map } from 'rxjs/operators';

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
            this.dispatchBoardItem = {id: dispatch_id, item: res};
            return of(true);
        });
    }

    updateDispatchBoard(updateData: UpdateDispatchCommand, dispatch_id: number){
        return this.dispatchService.apiDispatchPut(updateData)
        .pipe(
            flatMap(params => {
                return this.getDispatchBoardRowById(updateData.id)
            })
        ).pipe(
            map(res => {
                console.log("IS THIS OK RES", res);
                this.dispatchBoardItem = {id: dispatch_id, item: res};
            })
        )
    }

    set dispatchBoardItem(boardData){
        this.dispatcherStore.update((store) => ({
            ...store,
            dispatchList: {
                ...store.dispatchList,
                pagination: {
                    ...store.dispatchList.pagination,
                    data: store.dispatchList.pagination.data.map(item => {
                        let findedItem = false;
                        if(item.id == boardData.id){
                            
                            item.dispatches = item.dispatches.map(data => {
                                if(data.id == boardData.item.id){
                                    findedItem = true;
                                    data = {...boardData.item};
                                }
                                return data;
                            });

                            if( !findedItem ) {
                                item.dispatches.push({...boardData.item});
                            }
                        }
                        return item;
                    })
                }
            }
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
