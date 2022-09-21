import { Client, GatewayIntentBits, REST, Routes, TextChannel } from 'discord.js';
const { EmbedBuilder } = require('discord.js');
import 'dotenv/config';

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMembers,
	],
});

const gifs = [
	'https://c.tenor.com/Dhrbmr_t3tEAAAAd/forrest-gump-hello.gif',
	'https://c.tenor.com/pqqlX7Ha8PcAAAAC/hello-bob.gif',
	'https://c.tenor.com/y6aIM8CBK2cAAAAd/hey-fr-stuart-long.gif',
	'https://c.tenor.com/nVSmF0rmEOsAAAAd/whats-up-wazzup.gif',
	'https://c.tenor.com/1lscxdaCK4IAAAAC/starwars-greetings.gif',
	'https://c.tenor.com/95ycw_CgVHoAAAAC/napoleon-dynamite-wave.gif',
];

client.on('ready', () => {
	console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('guildMemberAdd', async (member) => {
	member.roles.add(['849359794451251240']);
	const channel = client.channels.cache.get('810216198397624384');

	(channel as TextChannel).send({
		embeds: [
			new EmbedBuilder()
				.setColor(0x0099ff)
				.setTitle('Welcome to Hack-A-Project')
				.setURL('https://hack-a-project.org')
				.setImage(gifs[Math.floor(Math.random() * (gifs.length + 1))]),
		],
	});
});

client.login(process.env.DISCORD_TOKEN);
