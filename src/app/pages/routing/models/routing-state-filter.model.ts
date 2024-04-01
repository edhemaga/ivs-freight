import { ID } from '@datorama/akita';

export interface RoutingState {
    id: ID;
    type: string;
}

/**
 * A factory function that creates RoutingState
 */
export function createRoutingState(params: Partial<RoutingState>) {
    return {} as RoutingState;
}
