import { type Message, Collection } from 'discord.js';
import { Event } from '../interfaces/Event';
import { modelSchema as guildSchema } from '../models/guildModel';
import config from '../../config.json';
import { Command } from '../interfaces/Command';

// TODO: Object with perms
export const event: Event<Message> = {
	name: 'messageCreate',
	on: async (client, message: Message) => {
		const guildData = await guildSchema.findOne({ guildID: message.guild?.id });

		if (!guildData) {
			await guildSchema.create({ guildID: message.guild?.id });
			return;
		}
		const prefix: string = guildData.prefix;

		if (message.author.bot || !message.content.startsWith(prefix)) return;
		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const commandName = args.shift()?.toLowerCase();
		if (!commandName) return;

		const command =
			client.commands.get(commandName) ||
			client.commands.find(
				(cmd: Command) => cmd.aliases && cmd.aliases.includes(commandName)
			);

		if (!command) return;
		if (command.permissions) {
			const authorPerms = message.member?.permissions.has(command.permissions);
			if (!authorPerms) {
				// return message.reply(
				// 	`you need ` +
				// 		'`' +
				// 		`${command.permissions}` +
				// 		'`' +
				// 		` in order to execute this command.`
				// );
				return message.reply(
					'You do\'t have the permissions to use this command.'
				);
			}
		}

		if (!command.enabled) {
			return message.reply('This command is disabled.');
		}
		if (command.ownerOnly && !config.owners.includes(message.author.id)) {
			return message.reply('Only the bot owner can use this!');
		}
		if (!client.cooldowns.has(command.name)) {
			client.cooldowns.set(command.name, new Collection());
		}
		const now = Date.now();
		const timestamps = client.cooldowns.get(command.name);
		const cooldownAmount = command.cooldown * 1000;

		if (timestamps?.has(message.author.id)) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const expirationTime = timestamps.get(message.author.id)! + cooldownAmount;
			const timeLeft = (expirationTime - now) / 1000;
			if (now < expirationTime && timeLeft < 60) {
				return message.channel.send(
					`Please wait ${timeLeft.toFixed(
						1
					)} seconds to use this command again.`
				);
			} else if (now < expirationTime && timeLeft > 60) {
				return message.channel.send(
					`Please wait ${(timeLeft / 60).toFixed(
						0
					)} minutes to use this command again.`
				);
			}
			timestamps.set(message.author.id, now);
			setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
		} else {
			timestamps?.set(message.author.id, now);
		}
		try {
			command.execute(client, message, args);
		} catch (e) {
			message.channel.send('An error had occured!');
			console.log(e);
		}
	},
};