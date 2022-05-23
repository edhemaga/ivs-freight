import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TtFhwaInspectionModalComponent } from '../../modals/common-truck-trailer-details-modals/tt-fhwa-inspection-modal/tt-fhwa-inspection-modal.component';
import { TtRegistrationModalComponent } from '../../modals/common-truck-trailer-details-modals/tt-registration-modal/tt-registration-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';

@Component({
  selector: 'app-trailer-details',
  templateUrl: './trailer-details.component.html',
  styleUrls: ['./trailer-details.component.scss']
})
export class TrailerDetailsComponent implements OnInit {
  public trailerDetailsConfig: any[] = [];
  constructor(private activated_route: ActivatedRoute, private modalService: ModalService) { }

  ngOnInit(): void {
    this.trailerDetailsConfig = [
      {
        id: 0,
        name: 'Trailer Details',
        template: 'general',
      },
      {
        id: 1,
        name: 'Registration',
        template: 'registration',
      },
      {
        id: 2,
        name: 'FHWA Inspection',
        template: 'fhwa-insepction',
   
      },
      {
        id: 3,
        name: 'Title',
        template: 'title',
     
      },
      {
        id: 4,
        name: 'Lease / Purchase',
        template: 'lease-purchase',
       
      },
    ];
  }
  public onModalAction(action: string): void {
    const truck_id = this.activated_route.snapshot.paramMap.get('id');
    switch (action.toLowerCase()) {
      case 'registration': {
        this.modalService.openModal(
          TtRegistrationModalComponent,
          { size: 'small' },
          { id: truck_id, type: 'add-registration', modal: 'trailer' }
        );
        break;
      }
      case 'fhwa inspection': {
        this.modalService.openModal(
          TtFhwaInspectionModalComponent,
          { size: 'small' },
          { id: truck_id, type: 'add-inspection', modal: 'trailer' }
        );
        break;
      }
      default: {
        break;
      }
    }
  }

  public identity(index: number, item: any): number {
    return item.id;
  }
}
