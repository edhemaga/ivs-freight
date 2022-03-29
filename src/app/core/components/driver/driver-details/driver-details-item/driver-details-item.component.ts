import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import moment from 'moment';
import { Subject } from 'rxjs';
import { CustomModalService } from 'src/app/core/services/modals/custom-modal.service';
import { driver_details_animation } from '../driver-details.animation';
import { DriverCdlModalComponent } from '../driver-modals/driver-cdl-modal/driver-cdl-modal.component';
import { DriverDrugAlcoholModalComponent } from '../driver-modals/driver-drugAlcohol-modal/driver-drugAlcohol-modal.component';
import { DriverMedicalModalComponent } from '../driver-modals/driver-medical-modal/driver-medical-modal.component';
import { DriverMvrModalComponent } from '../driver-modals/driver-mvr-modal/driver-mvr-modal.component';

@Component({
  selector: 'app-driver-details-item',
  templateUrl: './driver-details-item.component.html',
  styleUrls: ['./driver-details-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: [driver_details_animation('showHideDetails')],
})
export class DriverDetailsItemComponent implements OnInit, OnDestroy {
  @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize;
  @Input() data: any = null;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private customModalService: CustomModalService) {}

  ngOnInit() {
    console.log(this.data);
  }

  public onModalAction() {
    console.log(this.data.template)
    const data = {
      type: 'new',
      vehicle: 'truck',
    };

    switch (this.data.template) {
      case 'cdl': {
        this.customModalService.openModal(
          DriverCdlModalComponent,
          { data },
          null,
          { size: 'small' }
        );
        break;
      }
      case 'drugAlcohol': {
        this.customModalService.openModal(
          DriverDrugAlcoholModalComponent,
          { data },
          null,
          { size: 'small' }
        );
        break;
      }
      case 'medical': {
        this.customModalService.openModal(
          DriverMedicalModalComponent,
          { data },
          null,
          { size: 'small' }
        );
        break;
      }
      case 'mvr': {
        this.customModalService.openModal(
          DriverMvrModalComponent,
          { data },
          null,
          { size: 'small' }
        );
        break;
      }
      default: {
        break;
      }
    }
  }

  public onButtonAction(data: { template: string; action: string }) {
    switch (data.template) {
      case 'cdl': {
        if (data.action === 'attachments') {
          // TODO: attachments
        } else if (data.action === 'notes') {
          // TODO: notes
        } else {
          // TODO: dots
        }
        break;
      }
    }
  }

  public onShowDetails(componentData: any) {
    componentData.showDetails = !componentData.showDetails;
  }

  public formatDate(date: string) {
    return moment(date).format('MM/DD/YY');
  }

  public formatText(data: any, type: boolean, numOfCharacters: string) {
    if (!type) {
      return data.map((item) =>
        item.endorsementName?.substring(0, numOfCharacters)
      );
    }
    return data.map(
      (item) =>
        `<span class='first-character'>${item.endorsementName?.substring(
          0,
          numOfCharacters
        )}</span>` + item.endorsementName.substring(numOfCharacters)
    );
  }

  public identity(index: number, item: any): number {
    return item.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
