import { ID } from '@datorama/akita';

export interface TelematicState {
  id: ID;
}

/**
 * A factory function that creates TelematicState
 */
export function createTelematicState(params: Partial<TelematicState>) {
  return {

  } as TelematicState;
}
