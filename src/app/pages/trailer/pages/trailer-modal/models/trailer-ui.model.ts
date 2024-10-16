import { InspectionResponse, RegistrationResponse, TitleResponse, TrailerResponse } from "appcoretruckassist";

export interface TrailerUiData {
    trailerData: TrailerResponse;
    registrations: RegistrationResponse[];
    inspections: InspectionResponse[];
    titles: TitleResponse[];
}