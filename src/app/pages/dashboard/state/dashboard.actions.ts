import { Action } from '@ngrx/store';
import { Article } from '@pages/dashboard/state/dashboard.model';

export enum ArticleActionType {
    ADD_ITEM = '[ARTICLE] Add ARTICLE',
}

export class AddArticleAction implements Action {
    readonly type = ArticleActionType.ADD_ITEM;
    constructor(public payload: Article) {}
}

export type ArticleAction = AddArticleAction;
