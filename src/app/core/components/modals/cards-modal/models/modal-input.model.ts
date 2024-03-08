import { CardRows } from '../../../shared/model/cardData';

export interface InputModels {
    numberOfRows: number;
    checked: boolean;
    selectedTitle_0: InputModel;
    selectedTitle_1: InputModel;
    selectedTitle_2: InputModel;
    selectedTitle_3: InputModel;
    selectedTitle_4: InputModel;
    selectedTitle_5: InputModel;
    selectedTitle_back_0: InputModel;
    selectedTitle_back_1: InputModel;
    selectedTitle_back_2: InputModel;
    selectedTitle_back_3: InputModel;
    selectedTitle_back_4: InputModel;
    selectedTitle_back_5: InputModel;
}

export interface InputModel {
    id: number;
    key: string;
    selected: boolean;
    title: string;
}

export interface ModalModelData {
    checked: boolean;
    front_side: CardRows[];
    back_side: CardRows[];
    numberOfRows: number;
}
