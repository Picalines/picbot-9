import { State } from 'picbot-engine';

/**
 * @param {string} prefix
 */
const validatePrefix = (prefix) => prefix.length > 0 && !prefix.includes(' ');

export const prefixesState = new State({
    name: 'prefixes',
    entityType: 'guild',

    defaultValue: ['picbot.', '+', '>'],

    accessFabric: access => ({
        ...access,

        /**
         * @param {string} prefix
         */
        async add(prefix) {
            prefix = prefix.toLowerCase();

            const oldPrefixes = await this.value();

            if (!validatePrefix(prefix) || oldPrefixes.includes(prefix)) {
                return false;
            }

            await this.set([...oldPrefixes, prefix]);

            return true;
        },

        /**
         * @param {string} prefix
         */
        async remove(prefix) {
            prefix = prefix.toLowerCase();

            const oldPrefixes = [...await this.value()];
            if (oldPrefixes.length <= 1) {
                return false;
            }

            const removedIndex = oldPrefixes.indexOf(prefix);
            if (removedIndex < 0) {
                return false;
            }

            oldPrefixes.splice(removedIndex, 1);

            await this.set(oldPrefixes);
            return true;
        },

        /**
         * @param {string} prefix
         */
        async has(prefix) {
            const prefixes = await this.value();
            return prefixes.includes(prefix.toLowerCase());
        },
    }),
});

export default prefixesState;
