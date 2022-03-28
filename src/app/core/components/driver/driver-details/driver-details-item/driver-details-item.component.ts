import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import moment from 'moment';
import { Subject, take, takeUntil } from 'rxjs';
import { driver_details_animation } from '../driver-details.animation';

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

  constructor(private _ngZone: NgZone) {}

  ngOnInit() {}

  public onAction(data: { template: string; action: string }) {
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

  public triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  public onShowDetails(cdl: any) {
    cdl.showDetails = !cdl.showDetails;
  }

  public formatDate(date: string) {
    return moment(date).format('MM/DD/YY');
  }

  public formatTextPreview(endorsement: any, type: boolean) {
    if (!type) {
      return endorsement.map((data) => data.endorsementName?.charAt(0));
    }
    console.log(endorsement.map((data) => data.endorsementName))
    return endorsement.map((data) => data.endorsementName);
  }

  public identity(index: number, item: any): number {
    return item.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
