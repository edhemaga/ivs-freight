import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-ta-details-header-card',
  templateUrl: './ta-details-header-card.component.html',
  styleUrls: ['./ta-details-header-card.component.scss']
})
export class TaDetailsHeaderCardComponent implements OnInit {
  
  @Input() cardDetailsName:string;
  @Input() cardDetailsDate:string='';
  @Input() cardDetailsDateTerminated:string='';
  @Input() hasSvgHeader:string='';
  @Input() tooltipNext:string='';
  @Input() tooltipPrevious:string='';
  @Input() searchName:string='';
  @Input() optionsCmp:any=[];
  @Output() selectValue=new EventEmitter<string>();
  @Output() nextValue=new EventEmitter<any>();
  @Output() previousValue=new EventEmitter<any>();
  id:number=0;
  public inputFormControl: FormControl = new FormControl();


  constructor() { }

  ngOnInit(): void {
  }
  onSelectDetail(val:any){
    console.log(val);
    this.selectValue.emit(val)
  }

  onNextAction(){

    this.nextValue.emit();
    
  }
  onPreviousAction(val:any){
    this.previousValue.emit(val);   
  }
}
