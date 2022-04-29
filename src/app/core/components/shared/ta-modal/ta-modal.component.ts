import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-ta-modal',
  templateUrl: './ta-modal.component.html',
  styleUrls: ['./ta-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TaModalComponent {
  @Input() modalTitle: string;
  @Input() editName: string;
  @Input() editData: any;
  @Input() customClass: string;
  @Input() isModalValid: boolean;

  @Output() modalActionTypeEmitter: EventEmitter<string> =
  new EventEmitter<string>(null);

  private timeout = null;

  public isDeactivated: boolean = false;

  constructor(private ngbActiveModal: NgbActiveModal) {}

  ngOnInit() {
    console.log(this.editData)
  }

  public onAction(action: string) {
    switch (action) {
      case 'save': {
        this.modalActionTypeEmitter.emit(action);
        break;
      }
      case 'close': {
        this.modalActionTypeEmitter.emit(action);
        $('.pac-container').remove();
        this.timeout = setTimeout(() => {
          this.ngbActiveModal.dismiss();
          clearTimeout(this.timeout);
        }, 150);
        break;
      }
      case 'deactivate': {
        this.isDeactivated = !this.isDeactivated;
        this.modalActionTypeEmitter.emit(action);
        break;
      }
      case 'delete': {
        this.modalActionTypeEmitter.emit(action);
        break;
      }
      default: {
        break;
      }
    }
  }
}