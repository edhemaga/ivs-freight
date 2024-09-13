import { Component, Input, OnInit } from '@angular/core';

//Models
import { CompanyUserShortResponse } from 'appcoretruckassist';
import { ChatMessageResponse } from '@pages/chat/models';

// Enums
import { ChatImageAspectRatioEnum } from '@pages/chat/enums';

// Helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent implements OnInit {

  @Input() currentUserId!: string;
  @Input() chatParticipants: CompanyUserShortResponse[];
  @Input() message!: ChatMessageResponse;
  @Input() isDateDisplayed: boolean = true;

  public MethodsCalculationsHelper = MethodsCalculationsHelper;

  public singleImageAspectRatio!: ChatImageAspectRatioEnum;

  public messageDateAndTime!: string;

  constructor() { }

  ngOnInit(): void {
    this.checkImageDimensions(this.message.media[0]?.url);
    this.convertDate(this.message.createdAt);
  }

  private checkImageDimensions(url: string): void {
    if (!url) return;

    const image = new Image();
    image.src = url;

    image.onload = () => {

      if (image.width > image.height) {
        this.singleImageAspectRatio = ChatImageAspectRatioEnum.ThreeByTwo;
      } else {
        this.singleImageAspectRatio = ChatImageAspectRatioEnum.TwoByThree;
      }
    };
  }

  private convertDate(date: string): void {
    if (!date) return;

    this.messageDateAndTime = MethodsCalculationsHelper
      .convertDateToTimeFromBackend(
        date,
        true
      )
  }

}
