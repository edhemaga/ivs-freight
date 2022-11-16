import * as AppConst from 'src/app/const';
import { StatusPipePipe } from '../../../pipes/status-pipe.pipe';
import { LoadStatusPipe } from '../../../pipes/load-status.pipe';
import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from '@angular/core';

@Component({
    selector: 'app-ta-status-select',
    templateUrl: './ta-status-select.component.html',
    styleUrls: ['./ta-status-select.component.scss'],
    providers: [StatusPipePipe, LoadStatusPipe],
})
export class TaStatusSelectComponent implements OnInit {
    @Input() placeholder: string;
    @Input() clearable = true;
    @Input() width: string;
    @Input() searchable = true;
    @Input() value: any;
    @Input() dataType: string;
    @Input() additionalClass: string;
    @Input() extraNewClass: string;
    @Input() dataItems: any;
    @Input() load_status: boolean;
    @Input() hadDriver = false;
    @Output() changeVal = new EventEmitter();
    dispatchStatuses = JSON.parse(
        JSON.stringify(AppConst.DISPATCH_BOARD_STATUS)
    );
    loadStatuses = JSON.parse(JSON.stringify(AppConst.LOAD_STATUS));
    items: any = [];
    hoveredItem = -1;
    addTonyStatusActive: boolean;
    selectOpened: boolean;
    tonyRate: any;
    savedTonuStatus: any;

    constructor(private statusPipe: StatusPipePipe) {}

    ngOnInit(): void {
        //   this.items = this.statusPipe.transform(
        //     this.dataType == 'dispatch' ? this.dispatchStatuses : this.loadStatuses,
        //     this.value,
        //     this.dataType,
        //     this.dataItems
        //   );
    }

    // toggleClass(e: any, type: boolean) {
    //   this.selectOpened = type;

    //   // const select_item = document.querySelectorAll('.ng-select-container');
    //   // if( select_item ) {
    //   //      select_item.forEach(element => {
    //   //        if( type == 'close' ) element.classList.remove('make_it_gray');
    //   //        else element.classList.add('make_it_gray');
    //   //      });
    //   // }
    // }

    // ngOnChanges() {
    //   this.items = this.statusPipe.transform(
    //     this.dataType == 'dispatch' ? this.dispatchStatuses : this.loadStatuses,
    //     this.value,
    //     this.dataType,
    //     this.dataItems
    //   );
    //   this.value = this.dataItems.statusId;
    // }

    // public change(event) {
    //   if (this.dataType == 'load' && event.id == 5) {
    //     this.savedTonuStatus = event;
    //     this.addTonyStatusActive = true;
    //     this.items = this.statusPipe.transform(
    //       this.loadStatuses,
    //       this.dataItems.statusId,
    //       this.dataType,
    //       this.dataItems
    //     );
    //   } else {
    //     if (this.dataType == 'load') {
    //       this.dataItems.statusId = event.id;
    //       this.items = this.statusPipe.transform(
    //         this.loadStatuses,
    //         this.dataItems.statusId,
    //         this.dataType,
    //         this.dataItems
    //       );
    //     }

    //     this.changeVal.emit(event);
    //   }
    // }

    // public saveTonuStatus(): void {
    //   this.savedTonuStatus['tonyRate'] = this.tonyRate;
    //   this.changeVal.emit(this.savedTonuStatus);
    // }

    // public closeStatusChane() {
    //   this.addTonyStatusActive = false;
    // }
}
