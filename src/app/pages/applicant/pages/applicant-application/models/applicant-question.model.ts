import { AnswerChoices } from '@pages/applicant/pages/applicant-application/models/answer-choices.model';

export interface ApplicantQuestion {
    title: string;
    formControlName?: string;
    formControlNameExplain?: string;
    answerChoices?: AnswerChoices[];
}
