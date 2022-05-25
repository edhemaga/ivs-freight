import { ActivatedRoute, Router } from '@angular/router';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-ta-details-header',
  templateUrl: './ta-details-header.component.html',
  styleUrls: ['./ta-details-header.component.scss'],
})
export class TaCommonHeaderComponent implements OnInit {
  @Input() headerText: string = null;
  @Input() tooltipHeaderName: string = '';
  @Input() route: string = '';
  @Input() options: any = [];
  @Input() counterData: any;
  @Output() openModalAction = new EventEmitter<any>();
  @Input() hasIcon:boolean=false;
  @Input() hasDateArrow:boolean=false;
  @Input() hidePlus:boolean=true;
  @Input() customText:string='Date';
  @Output() changeDataArrowUp=new EventEmitter<any>();
  @Output() changeDataArrowDown=new EventEmitter<any>();
  @Input() arrayIcons:any[]=[];
  public up:boolean=false;
  public down:boolean=false;
  constructor(private routes: ActivatedRoute) {}

  ngOnInit(): void {}

 
  openModal(val: any) {
    console.log(val);
    this.openModalAction.emit(val);
  }
  changeDataArrowUpFun(val:any){
     this.up=true;
     if(this.down==true){
       this.down=false;
     }
     this.changeDataArrowUp.emit(val);
  }
  changeDataArrowDownFun(val:any){
    this.down=true;
    if(this.up==true){
      this.up=false;
    }
    this.changeDataArrowDown.emit(val);
  }
  trackByIndex(index: number, obj: any): any {
    return index;
  }
}
