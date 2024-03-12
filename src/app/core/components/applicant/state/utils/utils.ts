export const isFormValueEqual = (formValue: object, newFormValue: object) => {
    const formValueKeys = Object.keys(formValue);
    const newFormValueKeys = Object.keys(newFormValue);

    if (formValueKeys.length !== newFormValueKeys.length) {
        return false;
    }

    for (let key of formValueKeys) {
        if (formValue[key] !== newFormValue[key]) {
            return false;
        }
    }

    return true;
};

export const isFormValueNotEqual = (
    formValue: object,
    newFormValue: object
) => {
    const formValueKeys = Object.keys(formValue);
    const newFormValueKeys = Object.keys(newFormValue);

    if (formValueKeys.length !== newFormValueKeys.length) {
        return false;
    }

    for (let key of formValueKeys) {
        if (formValue[key] === newFormValue[key]) {
            return false;
        }
    }

    return true;
};

export const anyInputInLineIncorrect = (lineInputs: boolean[]) => {
    return lineInputs.some((item: boolean) => item);
};

export const isAnyValueInArrayTrue = (values: boolean[]) => {
    return values.some((item: boolean) => item);
};

export const isAnyValueInArrayFalse = (values: boolean[]) => {
    return values.some((item: boolean) => !item);
};

export const isEveryValueInArrayTrue = (values: boolean[]) => {
    return values.every((item: boolean) => item);
};

export const isAnyPropertyInObjectFalse = (selectedObject: object) => {
    return JSON.stringify(Object.values(selectedObject)).includes('false');
};

export const isAnyRadioInArrayUnChecked = (
    values: { isChecked: boolean }[]
) => {
    return values.some(({ isChecked }) => isChecked === null);
};

export const filterUnceckedRadiosId = (
    values: { id: number; isChecked: boolean }[]
) => {
    return values
        .filter(({ isChecked }) => isChecked === null)
        .map((item) => item.id);
};
