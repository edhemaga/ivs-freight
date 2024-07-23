import { LoadModalStringEnum } from "@pages/load/pages/load-modal/enums/load-modal-string.enum";

export class AssignDispatchCard {
    showReorderButton: boolean;
    showFinishReordering: boolean;

    constructor() {
        this.showReorderButton = true;
        this.showFinishReordering = false;
    }

    public startReordering(): void {
        this.showReorderButton = false;
        this.showFinishReordering = true;
    }

    public finishReordering(): void {
        this.showReorderButton = true;
        this.showFinishReordering = false;
    }

    public action(data: { action: string }): void {
        if (data.action === LoadModalStringEnum.REORDERING) {
            this.finishReordering();
        } else {
            this.startReordering();
        }
    }
}