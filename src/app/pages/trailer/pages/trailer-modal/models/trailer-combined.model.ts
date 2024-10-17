import { TrailerResponse, RegistrationResponse, InspectionResponse, TitleResponse } from "appcoretruckassist";

export interface TrailerCombinedData {
    trailerData: TrailerResponse;
    trailerRegistrations: RegistrationResponse[];
    trailerInspection: InspectionResponse[];
    trailerTitles: TitleResponse[];
}