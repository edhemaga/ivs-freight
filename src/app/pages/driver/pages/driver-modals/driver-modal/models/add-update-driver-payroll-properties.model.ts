export interface AddUpdateDriverPayrollProperties {
    conditionalDriverType: number;
    conditionalSoloEmptyMile: number;
    conditionalSoloLoadedMile: number;
    conditionalSoloPerStop: number;
    conditionalPerMileSolo: number;
    conditionalTeamEmptyMile: number;
    conditionalTeamLoadedMile: number;
    conditionalTeamPerStop: number;
    conditionalPerMileTeam: number;
    conditionalCommissionSolo: number;
    conditionalCommissionTeam: number;
    conditionalFlatRateSolo: number;
    conditionalFlatRateTeam: number;
    conditionalPayrollShared: boolean;
    conditionalPayrollCalculated: boolean;
}
