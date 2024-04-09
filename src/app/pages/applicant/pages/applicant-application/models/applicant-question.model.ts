import { AnswerChoices } from './answer-choices.model';

export interface ApplicantQuestion {
    title: string;
    formControlName?: string;
    formControlNameExplain?: string;
    answerChoices?: AnswerChoices[];
}
