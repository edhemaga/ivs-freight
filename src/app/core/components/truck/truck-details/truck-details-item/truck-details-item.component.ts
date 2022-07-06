
import { FormControl } from '@angular/forms';
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { TtRegistrationModalComponent } from '../../../modals/common-truck-trailer-modals/tt-registration-modal/tt-registration-modal.component';
import { TtFhwaInspectionModalComponent } from '../../../modals/common-truck-trailer-modals/tt-fhwa-inspection-modal/tt-fhwa-inspection-modal.component';
import { TruckResponse } from 'appcoretruckassist';
import { card_component_animation } from '../../../shared/animations/card-component.animations';

@Component({
  selector: 'app-truck-details-item',
  templateUrl: './truck-details-item.component.html',
  styleUrls: ['./truck-details-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [card_component_animation('showHideCardBody')],
})
export class TruckDetailsItemComponent implements OnInit {
  @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize;
  @Input() truck: TruckResponse | any = null;
  public note: FormControl = new FormControl();
  public fhwaNote: FormControl = new FormControl();
  public purchaseNote: FormControl = new FormControl();
  public registrationNote: FormControl = new FormControl();
  public titleNote: FormControl = new FormControl();

  public toggler: boolean[] = [];
  cardNumberFake: string = '1234567890';
  truckName: string = '';
  isAccountVisible: boolean = true;
  accountText: string = null;
  public truckData: any;
  public dataEdit: any;

  constructor(
    private modalService: ModalService,
    private activated_route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initTableOptions();
  }
  ngOnDestroy(): void {}

  public onShowDetails(componentData: any) {
    componentData.showDetails = !componentData.showDetails;
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

  /**Function retrun id */
  public identity(index: number, item: any): number {
    return index;
  }

  /**Function for toggle page in cards */
  public toggleResizePage(value: number) {
    this.toggler[value] = !this.toggler[value];
    console.log(this.toggler);
  }

  public optionsEvent(any: any, action: string) {
    switch (action) {
      case 'edit-registration': {
        this.modalService.openModal(
          TtRegistrationModalComponent,
          { size: 'small' },
          {
            id: this.truck.id,
            file_id: any.id,
            type: action,
            modal: 'truck',
          }
        );
        break;
      }
      case 'edit-inspection': {
        this.modalService.openModal(
          TtFhwaInspectionModalComponent,
          { size: 'small' },
          {
            id: this.truck.id,
            file_id: any.id,
            type: action,
            modal: 'truck',
          }
        );
        break;
      }
      case 'edit-title': {
        break;
      }
      default: {
        break;
      }
    }
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
