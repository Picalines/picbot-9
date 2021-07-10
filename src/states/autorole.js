import { roleAccess, State } from "picbot-engine";

export const autoroleState = new State({
    name: 'autorole',
    entityType: 'guild',

    defaultValue: 'null',

    accessFabric: roleAccess,
});

export default autoroleState;
