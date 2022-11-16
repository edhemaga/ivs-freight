export interface AnswerChoices {
    id: number;
    label: string;
    value: string;
    name: string;
    checked: boolean;
    index?: number;
}

export interface ApplicantQuestion {
    title: string;
    formControlName?: string;
    formControlNameExplain?: string;
    answerChoices?: AnswerChoices[];
}
