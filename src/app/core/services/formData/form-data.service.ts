import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class FormDataService {
    private formData = new FormData();

    constructor() {}

    extractFormDataFromFunction(data) {
        this.formData = new FormData();
        Object.entries(data).map((item: any) => {
            if (item[1] instanceof Array) {
                item[1].forEach((element, ind) => {
                    if (element instanceof Object && !(item[1][0] instanceof Blob)) {
                        Object.entries(element).map((it, indx) => {
                            if (it[1] instanceof Object) {
                                Object.entries(it[1]).map((at, indx) => {
                                    this.formData.append(
                                        `${item[0]}[${ind}].${it[0]}.${at[0]}`,
                                        at[1] as any
                                    );
                                });
                            } else {
                                this.formData.append(
                                    `${item[0]}[${ind}].${it[0]}`,
                                    it[1] as any
                                );
                            }
                        });
                    } else {
                        this.formData.append(item[0], element);
                    }
                });
            } else if (
                item[1] instanceof Object &&
                !(item[1][0] instanceof Blob)
            ) {
                Object.entries(item[1]).map((it, indx) => {
                    const insideData =
                        it[1] instanceof Object
                            ? JSON.stringify(it[1])
                            : (it[1] as any);
                    this.formData.append(`${item[0]}.${it[0]}`, insideData);
                });
            }
            else {
                if (item[0] && item[1]) this.formData.append(item[0], item[1]);
            }
        });
    }

    get formDataValue() {
        return this.formData;
    }
}
