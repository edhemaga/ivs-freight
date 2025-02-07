import { FileResponse } from "appcoretruckassist";

export interface DispatcherFilter {
    name: string;
    count: number;
    isSelected: boolean;
    avatar?: FileResponse;
}