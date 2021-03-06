import { numberAccess, State } from 'picbot-engine';

/**
 * @param {number} xp
 */
export function calculateLevel(xp) {
    return Math.floor(Math.sqrt(xp / 8));
}

export const xpState = new State({
    name: 'xp',
    entityType: 'member',

    defaultValue: 0,

    accessFabric: numberAccess([0, Infinity]),
});

export default xpState;
