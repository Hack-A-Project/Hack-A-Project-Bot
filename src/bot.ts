import { Client, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
	console.log(`Logged in as ${client.user?.tag}!`);
});

client.login(process.env.DISCORD_TOKEN);
