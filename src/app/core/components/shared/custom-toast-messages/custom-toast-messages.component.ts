import { Component, OnInit } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Toast, ToastrService, ToastPackage } from 'ngx-toastr';

@Component({
  selector: 'app-custom-toast-messages',
  templateUrl: './custom-toast-messages.component.html',
  styleUrls: ['./custom-toast-messages.component.scss'],
  animations: [
    trigger('flyInOut', [
      state('inactive', style({
        display: 'flex',
        position: 'relative',
        top: '100px',
        opacity: 1,
        transform: 'scale(1)',
      })),
      transition('inactive => active', animate('150ms ease-out', keyframes([ 
        style({
          top: '100px',
        }),
        style({
          top: '0px',
        })
      ]))),
      
      
      transition(
        'active => removed',
        animate(
          '150ms ease-out',
          keyframes([
            style({
              opacity: 1,
            }),
            style({
              opacity: 0,
            }),
          ])
        )
      ),
    ]),
  ],
  
})
export class CustomToastMessagesComponent extends Toast implements OnInit {

  undoString = 'undo';
  customTitle = this.title;
  retryStarted = false;
  retryHover = false;

  constructor(
    protected toastrService: ToastrService,
    public toastPackage: ToastPackage,
  ) {
    super(toastrService, toastPackage);
  }

  ngOnInit(): void {
  }

  action(event: Event) {
    event.stopPropagation();
    this.undoString = 'undid';
    this.toastPackage.triggerAction();
    return false;
  }

  clickOnRetry(){
    this.retryStarted = true;

    let splitStr = this.title?.split(' ');
    let lastWordNum = splitStr.length - 1;
    let lastWordText = splitStr[lastWordNum];
    let newTitle = 'CREATING ' + lastWordText;
    this.customTitle = newTitle;
  }

  hoverOnRetry(){
    let newTitle = '';
    let mainTitle = this.title;
    let splitStr = mainTitle?.split(' ');
    
    for (var i = 0; i < splitStr.length; i++) 
      {
        splitStr[0] = 'RETRY';
        newTitle = newTitle + ' ' + splitStr[i];
      }
    this.customTitle = newTitle;
    this.retryHover = true;
  }

  hoverOutRetry(){
    let newTitle = '';
    let mainTitle = this.title;
    let splitStr = mainTitle?.split(' ');
    
    for (var i = 0; i < splitStr.length; i++) 
      {
        splitStr[0] = 'FAILED';
        newTitle = newTitle + ' ' + splitStr[i];
      }
    this.customTitle = newTitle;
    this.retryHover = false;
  }
}
