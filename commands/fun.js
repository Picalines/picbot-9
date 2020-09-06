const { Command } = require('picbot-engine');
const { MessageEmbed, GuildMember } = require('discord.js');
const { randomFrom } = require('../utils');

/**
 * @typedef {import("picbot-engine").CommandInfo} CommandInfo
 * @typedef {import("picbot-engine").CommandExecuteable} CommandExecuteable
 * @typedef {CommandInfo & { execute: CommandExecuteable; }} CommandConstructorInfo
 */

/**
 * @typedef {'never' | 'optional' | 'always'} TargetRequireMode
 * @typedef {'withTarget' | 'noTarget' | 'targetIsBot' | 'selfTarget'} FuncCommandCaseCondition
 */

/**
 * @typedef {Object} FunCommandUseCase
 * @property {string | ((args: any) => string)} message 
 * @property {(string | string[])[]} [images]
 */

/**
 * @typedef {Object} FunCommandInfo
 * @property {TargetRequireMode} requireTarget
 * @property {Partial<Record<FuncCommandCaseCondition, FunCommandUseCase>>} cases
 */

/**
 * @typedef {FunCommandInfo & Omit<CommandConstructorInfo, 'execute'> } FunCommandConstructorInfo
 */

const modifyObject = (obj, edit) => ({ ...obj, ...edit });

class FunCommand extends Command {
    /**
     * @typedef {[string, (m: GuildMember) => string][]} StringReplacements
     * @type {{ target: StringReplacements, executor: StringReplacements }}
     */
    static messageReplacements = {
        target: [
            ['$target', target => `**${target.displayName}**`],
            ['$TARGET', target => `**${target.displayName.toUpperCase()}**`],
        ],
        executor: [
            ['$executor', executor => `**${executor.displayName}**`],
            ['$EXECUTOR', executor => `**${executor.displayName.toUpperCase()}**`],
        ]
    };

    /**
     * @param {FunCommandConstructorInfo} info
     */
    constructor(info) {
        let newSyntax = info.syntax;

        /** @type {CommandExecuteable} */
        let execute;

        if (info.requireTarget != 'never') {
            const isOptional = info.requireTarget == 'optional';
            newSyntax = `<member:target${isOptional ? '=' : ''}> ` + newSyntax || '';

            execute = async ({ message, executor, args, args: { target } }) => {
                let useCase;

                if (!(target instanceof GuildMember)) {
                    useCase = info.cases.noTarget;
                }
                else if (info.cases.targetIsBot && target.id == executor.guild.me.id) {
                    useCase = info.cases.targetIsBot;
                }
                else if (info.cases.selfTarget && target.id == executor.id) {
                    useCase = info.cases.selfTarget;
                }
                else {
                    useCase = info.cases.withTarget;
                }

                if (!useCase) {
                    throw new Error('this use case is not supported');
                }

                await this.executeUseCase(args, message.channel, executor, target, useCase);
            };
        }
        else {
            execute = async ({ message, executor }) => {
                await this.executeUseCase(undefined, message.channel, executor, undefined, info.cases.noTarget);
            };
        }

        info = modifyObject(info, {
            syntax: newSyntax, execute,
        });

        // @ts-ignore
        super(info);
    }

    /**
     * @param {any} [args]
     * @param {import('discord.js').TextChannel} channel
     * @param {GuildMember} executor
     * @param {GuildMember} target
     * @param {FunCommandUseCase} param4
     */
    async executeUseCase(args, channel, executor, target, { images, message }) {
        if (typeof message == 'function') {
            message = message(args || {});
        }

        FunCommand.messageReplacements.executor.forEach(([s, repl]) => {
            // @ts-ignore
            message = message.replace(s, repl(executor));
        });

        if (target) {
            FunCommand.messageReplacements.target.forEach(([s, repl]) => {
                // @ts-ignore
                message = message.replace(s, repl(target));
            });
        }

        let embed = undefined;
        if (images) {
            const image = randomFrom(images);
            if (typeof image == 'string') {
                embed = new MessageEmbed().setImage(image);
            }
            else {
                message += '\n\n' + image.join('\n');
            }
        }

        await channel.send(message, { embed });
    }
}

module.exports = {
    FunCommand,
}
