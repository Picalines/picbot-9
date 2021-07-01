import { memberAccess, State } from 'picbot-engine';

export const partnerState = new State({
    name: 'partner',
    entityType: 'member',

    defaultValue: 'null',

    accessFabric: memberAccess,
});

export default partnerState;
