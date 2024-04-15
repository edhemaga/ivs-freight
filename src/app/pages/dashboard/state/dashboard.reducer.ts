import {
    ArticleAction,
    ArticleActionType,
} from '@pages/dashboard/state/dashboard.actions';
import { Article } from '@pages/dashboard/state/dashboard.model';

const initialState: Array<Article> = [
    {
        id: '1',
        name: 'Angular State Management with NgRx',
        author: 'Chameera Dulanga',
        publisher: 'SyncFusion',
    },
];

export function ArticleReducer(
    state: Array<Article> = initialState,
    action: ArticleAction
) {
    switch (action.type) {
        case ArticleActionType.ADD_ITEM:
            return [...state, action.payload];
        default:
            return state;
    }
}
