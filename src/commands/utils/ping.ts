import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../interfaces/Command';
import * as PACKAGE from '../../../package.json';

export const command: Command = {
	name: 'ping',

	cooldown: 3,

	ownerOnly: false,
	usage: '',
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with pong with milliseconds'),
	execute: async (client, interaction) => {
		const ping = new EmbedBuilder()
			.setTitle('Ping')
			.setDescription('Pong!')
			.setColor(0xdff8eb)
			.setFooter({ text: `Asomataru v${PACKAGE.version}` });
		// await interaction.reply({ embeds: [ping] });

		// const m = await interaction.reply({ embeds: [ping] });
		// const pong = new EmbedBuilder()
		// 	.setTitle('Ping')
		// 	.setDescription(
		// 		'Pong!' +
		// 			`Latency is ${
		// 				 - m?.interaction.createdTimestamp!
		// 			}ms. 🏓`
		// 	)
		// 	.setColor(0xdff8eb)
		// 	.setFooter({ text: `Asomataru v${PACKAGE.version}` });
		// pong.setDescription(
		// 	`${Number(pong.data.timestamp) - m.interaction.createdTimestamp}`
		// );
		// await interaction.editReply({ embeds: [pong] });
		await interaction.reply({ embeds: [ping] });
	},
};
