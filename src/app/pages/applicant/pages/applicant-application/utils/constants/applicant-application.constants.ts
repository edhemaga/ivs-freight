import { AnnotationItem } from '@pages/applicant/pages/applicant-application/models/annotation-item.model';
import { ApplicantQuestion } from '@pages/applicant/pages/applicant-application/models/applicant-question.model';



export class ApplicantApplicationConstants {
    public static displayRadioRequiredNoteArray: { id: number; displayRadioRequiredNote: boolean; }[] = [
        { id: 0, displayRadioRequiredNote: false },
        { id: 1, displayRadioRequiredNote: false },
        { id: 2, displayRadioRequiredNote: false },
        { id: 3, displayRadioRequiredNote: false },
        { id: 4, displayRadioRequiredNote: false },
        { id: 5, displayRadioRequiredNote: false },
        { id: 6, displayRadioRequiredNote: false },
    ];

    public static questions: ApplicantQuestion[] = [
        {
            title: 'Are you a US citizen?',
            formControlName: 'usCitizen',
            formControlNameExplain: 'usCitizenExplain',
            answerChoices: [
                { id: 1, label: 'YES', value: 'usCitizenYes', name: 'usCitizenYes', checked: false, index: 0 },
                { id: 2, label: 'NO', value: 'usCitizenNo', name: 'usCitizenNo', checked: false, index: 0 }
            ]
        },
        {
            title: 'Do you have legal right to work in the US?',
            formControlName: 'legalWork',
            formControlNameExplain: 'legalWorkExplain',
            answerChoices: [
                { id: 3, label: 'YES', value: 'legalWorkYes', name: 'legalWorkYes', checked: false, index: 1 },
                { id: 4, label: 'NO', value: 'legalWorkNo', name: 'legalWorkNo', checked: false, index: 1 }
            ]
        },
        {
            title: 'Have you ever been known by any other name?',
            formControlName: 'anotherName',
            formControlNameExplain: 'anotherNameExplain',
            answerChoices: [
                { id: 5, label: 'YES', value: 'anotherNameYes', name: 'anotherNameYes', checked: false, index: 2 },
                { id: 6, label: 'NO', value: 'anotherNameNo', name: 'anotherNameNo', checked: false, index: 2 }
            ]
        },
        {
            title: 'Were you ever in the military?',
            formControlName: 'inMilitary',
            formControlNameExplain: 'inMilitaryExplain',
            answerChoices: [
                { id: 7, label: 'YES', value: 'inMilitaryYes', name: 'inMilitaryYes', checked: false, index: 3 },
                { id: 8, label: 'NO', value: 'inMilitaryNo', name: 'inMilitaryNo', checked: false, index: 3 }
            ]
        },
        {
            title: 'Have you ever been convicted of a felony?',
            formControlName: 'felony',
            formControlNameExplain: 'felonyExplain',
            answerChoices: [
                { id: 9, label: 'YES', value: 'felonyYes', name: 'felonyYes', checked: false, index: 4 },
                { id: 10, label: 'NO', value: 'felonyNo', name: 'felonyNo', checked: false, index: 4 }
            ]
        },
        {
            title: 'Have you ever been convicted of a misdemeanor?',
            formControlName: 'misdemeanor',
            formControlNameExplain: 'misdemeanorExplain',
            answerChoices: [
                { id: 11, label: 'YES', value: 'misdemeanorYes', name: 'misdemeanorYes', checked: false, index: 5 },
                { id: 12, label: 'NO', value: 'misdemeanorNo', name: 'misdemeanorNo', checked: false, index: 5 }
            ]
        },
        {
            title: 'Have you ever had a DUI, DWI, or OVI?',
            formControlName: 'drunkDriving',
            formControlNameExplain: 'drunkDrivingExplain',
            answerChoices: [
                { id: 13, label: 'YES', value: 'drunkDrivingYes', name: 'drunkDrivingYes', checked: false, index: 6 },
                { id: 14, label: 'NO', value: 'drunkDrivingNo', name: 'drunkDrivingNo', checked: false, index: 6 }
            ]
        }
    ];
    
    public static openAnnotationArray: AnnotationItem[] = [
        { lineIndex: 0, lineInputs: [false, false, false], displayAnnotationButton: false, displayAnnotationTextArea: false },
        { lineIndex: 1, lineInputs: [false], displayAnnotationButton: false, displayAnnotationTextArea: false },
        { lineIndex: 7, lineInputs: [false, false], displayAnnotationButton: false, displayAnnotationTextArea: false },
        { lineIndex: 8, lineInputs: [false, false], displayAnnotationButton: false, displayAnnotationTextArea: false },
        { lineIndex: 9, lineInputs: [false], displayAnnotationButton: false, displayAnnotationTextArea: false },
        { lineIndex: 10, lineInputs: [false], displayAnnotationButton: false, displayAnnotationTextArea: false },
        { lineIndex: 11, lineInputs: [false], displayAnnotationButton: false, displayAnnotationTextArea: false },
        { lineIndex: 12, lineInputs: [false], displayAnnotationButton: false, displayAnnotationTextArea: false },
        { lineIndex: 13, lineInputs: [false], displayAnnotationButton: false, displayAnnotationTextArea: false },
        { lineIndex: 14, lineInputs: [false], displayAnnotationButton: false, displayAnnotationTextArea: false },
        { lineIndex: 15, lineInputs: [false], displayAnnotationButton: false, displayAnnotationTextArea: false }
    ];
    
}
