import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { onFileActionMethods } from 'src/app/core/utils/methods.globals';
import { card_component_animation } from '../../../../shared/animations/card-component.animations';
import { RoadsideInspectionResponse } from '../../../../../../../../appcoretruckassist/model/roadsideInspectionResponse';

@Component({
   selector: 'app-violation-details-single',
   templateUrl: './violation-details-single.component.html',
   encapsulation: ViewEncapsulation.None,
   styleUrls: ['./violation-details-single.component.scss'],
   animations: [card_component_animation('showHideCardBody')],
})
export class ViolationDetailsSingleComponent implements OnInit {
   @Input() violationData: any;
   public toggler: boolean[] = [];
   public note: FormControl = new FormControl();
   constructor() {}

   ngOnInit(): void {}
   /**Function return id */
   public identity(index: number, item: any): number {
      return item.id;
   }
   public getViolationContainer(violation: RoadsideInspectionResponse) {}
   public onFileAction(action: string) {
      onFileActionMethods(action);
   }
   /**Function for toggle page in cards */
   public toggleResizePage(value: number, indexName: string) {
      this.toggler[value + indexName] = !this.toggler[value + indexName];
   }
}
