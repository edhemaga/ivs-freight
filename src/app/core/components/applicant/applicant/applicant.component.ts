import { Component, OnInit } from '@angular/core';
import { SelectedMode } from '../state/enum/selected-mode.enum';

import { INavigation } from '../state/model/navigation.model';

@Component({
  selector: 'app-applicant',
  templateUrl: './applicant.component.html',
  styleUrls: ['./applicant.component.scss'],
})
export class ApplicantComponent implements OnInit {
  public selectedMode = SelectedMode.FEEDBACK;

  public menuItems: INavigation[] = [
    {
      title: 'Personal Info',
      route: '1',
      class: 'bullet-1',
    },
    {
      title: 'Work experience',
      route: '2',
      class: 'bullet-2',
    },
    {
      title: 'CDL Information',
      route: '3',
      class: 'bullet-3',
    },
    {
      title: 'Accident records',
      route: '4',
      class: 'bullet-4',
    },
    {
      title: 'Traffic violations',
      route: '5',
      class: 'bullet-5',
    },
    {
      title: 'Education',
      route: '6',
      class: 'bullet-6',
    },
    {
      title: '7 Days HOS',
      route: '7',
      class: 'bullet-7',
    },
    {
      title: 'Drug & Alchocol statement',
      route: '8',
      class: 'bullet-8',
    },
    {
      title: 'Driver rights',
      route: '9',
      class: 'bullet-9',
    },
    {
      title: 'Disclosure & release',
      route: '10',
      class: 'bullet-10',
    },
    {
      title: 'Authorization',
      route: '11',
      class: 'bullet-11',
    },
  ];

  storeArr = [
    { id: 0, isCompleted: false },
    { id: 1, isCompleted: false },
    { id: 2, isCompleted: false },
    { id: 3, isCompleted: false },
    { id: 4, isCompleted: false },
    { id: 5, isCompleted: false },
    { id: 6, isCompleted: false },
    { id: 7, isCompleted: false },
    { id: 8, isCompleted: false },
    { id: 9, isCompleted: false },
    { id: 10, isCompleted: false },
  ];

  reviewStoreArr = [
    { id: 0, isReviewed: true, hasIncorrectAnswer: false },
    { id: 1, isReviewed: true, hasIncorrectAnswer: false },
    { id: 2, isReviewed: true, hasIncorrectAnswer: true },
    { id: 3, isReviewed: true, hasIncorrectAnswer: false },
    { id: 4, isReviewed: true, hasIncorrectAnswer: false },
    { id: 5, isReviewed: true, hasIncorrectAnswer: false },
    { id: 6, isReviewed: true, hasIncorrectAnswer: false },
    { id: 7, isReviewed: true, hasIncorrectAnswer: false },
    { id: 8, isReviewed: true, hasIncorrectAnswer: false },
    { id: 9, isReviewed: true, hasIncorrectAnswer: false },
    { id: 10, isReviewed: true, hasIncorrectAnswer: false },
  ];

  feedbackStoreArr = [
    { id: 0, hasIncorrectAnswer: false, sentToReview: false },
    { id: 1, hasIncorrectAnswer: true, sentToReview: false },
    { id: 2, hasIncorrectAnswer: false, sentToReview: true },
    { id: 3, hasIncorrectAnswer: false, sentToReview: false },
    { id: 4, hasIncorrectAnswer: false, sentToReview: false },
    { id: 5, hasIncorrectAnswer: false, sentToReview: false },
    { id: 6, hasIncorrectAnswer: false, sentToReview: false },
    { id: 7, hasIncorrectAnswer: false, sentToReview: false },
    { id: 7, hasIncorrectAnswer: false, sentToReview: false },
    { id: 7, hasIncorrectAnswer: false, sentToReview: false },
    { id: 7, hasIncorrectAnswer: false, sentToReview: false },
  ];

  constructor() {}

  ngOnInit(): void {}

  public trackByIdentity = (index: number, item: any): number => index;
}
