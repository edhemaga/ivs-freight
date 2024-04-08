import { ID } from '@datorama/akita';

export interface FilterState {
  id: ID;
}

/**
 * A factory function that creates TelematicState
 */
export function createTelematicState(params: Partial<FilterState>) {
  return {

  } as FilterState;
}
