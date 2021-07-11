import { State } from "picbot-engine";
import { escapeRegExp } from "../utils/string.js";

export const GREETING_MEMBER_TEMPLATE = '$member';

const templateRegex = new RegExp(escapeRegExp(GREETING_MEMBER_TEMPLATE), 'g');

export const greetingState = new State({
    name: 'greeting',
    entityType: 'guild',

    defaultValue: '',

    accessFabric: access => ({
        ...access,

        async value() {
            return await access.value() || null;
        },

        async formatted(member) {
            const value = await this.value();

            if (!value) {
                return null;
            }

            return value.replace(templateRegex, String(member));
        },

        /**
         * @param {string} value
         */
        set(value) {
            return access.set(value.trim());
        },

        reset() {
            return access.set(greetingState.defaultValue);
        },
    }),
});

export default greetingState;
