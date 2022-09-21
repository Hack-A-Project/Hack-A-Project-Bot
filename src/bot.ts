import { Client, GatewayIntentBits, REST, Routes, TextChannel } from 'discord.js';
import 'dotenv/config';

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMembers,
	],
});

const gifs = [
	'https://tenor.com/view/forrest-gump-hello-wave-hi-waving-gif-22571528',
	'https://tenor.com/view/hello-bob-minions-the-rise-of-gru-hi-greetings-gif-26087717',
	'https://tenor.com/view/hey-fr-stuart-long-mark-wahlberg-father-stu-hello-gif-25066833',
	'https://tenor.com/view/whats-up-wazzup-scary-movie-scream-gif-16474707',
	'https://tenor.com/view/starwars-greetings-alec-guinness-obi-wan-hello-gif-4813375',
	'https://tenor.com/view/napoleon-dynamite-wave-bye-gif-15387504',
];

client.on('ready', () => {
	console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('guildMemberAdd', async (member) => {
	member.roles.add(['1021977112405610647']);
	const channel = client.channels.cache.get('1016153877566984276');
	(channel as TextChannel).send(gifs[Math.floor(Math.random() * (gifs.length + 1))]);
});

client.login(process.env.DISCORD_TOKEN);
