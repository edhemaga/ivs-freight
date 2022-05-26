import { Subject } from 'rxjs';
import { CustomModalService } from 'src/app/core/services/modals/custom-modal.service';
import { FormControl } from '@angular/forms';
import { truck_details_animation } from './../truck-details.animation';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

import moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { TruckTService } from '../../state/truck.service';

@Component({
  selector: 'app-truck-details-item',
  templateUrl: './truck-details-item.component.html',
  styleUrls: ['./truck-details-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [truck_details_animation('showHideDetails')],
})
export class TruckDetailsItemComponent implements OnInit {
  @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize;
  @Input() data: any = null;
  public note: FormControl = new FormControl();
  public fhwaNote: FormControl = new FormControl();
  public purchaseNote: FormControl = new FormControl();
  public registrationNote: FormControl = new FormControl();
  public titleNote: FormControl = new FormControl();

  private destory$: Subject<void> = new Subject<void>();
  public toggler: boolean = false;
  cardNumberFake: string = '1234567890';
  truckName: string = '';
  isAccountVisible: boolean = true;
  accountText: string = null;
  public truckData: any;
  public dataEdit: any;
  constructor(
    private customModalService: CustomModalService,
    private activated_route: ActivatedRoute,
    private truckTService: TruckTService
  ) {
   
  }

  ngOnInit(): void {
    this.initTableOptions();
    this.getTruckById();
  }
  ngOnDestroy(): void {
    this.destory$.next();
    this.destory$.complete();
  }

  public onShowDetails(componentData: any) {
    componentData.showDetails = !componentData.showDetails;
  }
 /** return truck by id, truckData.trcuk value from resolver for id truck */
  public getTruckById() {
    this.truckData = this.activated_route.snapshot.data;
  }
  
  /**Function for dots in cards */
  public initTableOptions(): void {
    this.dataEdit = {
      disabledMutedStyle: null,
      toolbarActions: {
        hideViewMode: false,
      },
      config: {
        showSort: true,
        sortBy: '',
        sortDirection: '',
        disabledColumns: [0],
        minWidth: 60,
      },
      actions: [
        {
          title: 'Edit',
          name: 'edit',
          class: 'regular-text',
          contentType: 'edit',
        },

        {
          title: 'Delete',
          name: 'delete-item',
          type: 'driver',
          text: 'Are you sure you want to delete driver(s)?',
          class: 'delete-text',
          contentType: 'delete',
        },
      ],
      export: true,
    };
  }

  public onModalAction() {}
  /**Function return format date from DB */
  public formatDate(date: string) {
    return moment(date).format('MM/DD/YY');
  }
  /**Function formating text */
  public formatText(data: any, type: boolean, numOfCharacters: string) {
    if (!type) {
      return data.map((item) =>
        item.endorsementName?.substring(0, numOfCharacters)
      );
    }
    return data.map(
      (item) =>
        `<span class='first-character'>
    ${item.endorsmentName?.substring(0, numOfCharacters)}</span> ` +
        item.endorsementName.substring(0, numOfCharacters)
    );
  }
  /**Function retrun id */
  public identity(index: number, item: any): number {
    return item.id;
  }
  
  /**Function for toggle page in cards */
  public toggleResizePage(value: boolean) {
    this.toggler = value;
    console.log(this.toggler);
  }

  public onFileAction(action: string) {
    switch (action) {
      case 'download': {
        this.downloadFile(
          'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf',
          'truckassist0'
        );
        break;
      }
      default: {
        break;
      }
    }
  }
  public downloadFile(url: string, filename: string) {
    fetch(url).then((t) => {
      return t.blob().then((b) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(b);
        a.setAttribute('download', filename);
        a.click();
      });
    });
  }

  public hiddenPassword(value: any, numberOfCharacterToHide: number) {
    const lastFourCharaters = value.substring(
      value.length - numberOfCharacterToHide
    );
    let hiddenCharacter = '';

    for (let i = 0; i < numberOfCharacterToHide; i++) {
      hiddenCharacter += '*';
    }
    return hiddenCharacter + lastFourCharaters;
  }

  public showHideValue(value: string) {
    this.isAccountVisible = !this.isAccountVisible;
    if (!this.isAccountVisible) {
      this.accountText = this.hiddenPassword(value, 4);
      return;
    }
    this.accountText = value;
  }
}
