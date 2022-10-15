import { Client, GatewayIntentBits, REST, Routes, TextChannel, DiscordAPIError } from 'discord.js';
import { parsePoints } from '../utils/functions';
const { EmbedBuilder } = require('discord.js');
import axios from 'axios';
import { load } from 'cheerio';
import 'dotenv/config';

const get = axios.get;

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMembers,
	],
});

const SECOND = 1000;
const MINUTE = 60 * SECOND;

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
	var channel = client.channels.cache.get(`${process.env.NEWS_CHANNEL}`);

	const sendNews = async () => {
		const { data } = await get('https://news.ycombinator.com/');
		const $ = load(data);

		const max_points = {
			link: '',
			title: '',
			image: '',
			description: '',
			points: -1,
		};

		$('table.itemlist tbody tr').each((i, el) => {
			if (i % 3 == 1) {
				const points = parsePoints(
					$(el).children('td.subtext').children('span.subline').children('span.score').text()
				);
				if (points > max_points.points) {
					const link = $(el.prev!)
						.children('td:eq(2)')
						.children('span.titleline')
						.children('a')
						.attr('href');

					max_points.link = link!;
					max_points.points = points;
				}
			}
		});

		if (max_points.link === '') max_points.link = 'ERROR';
		(channel as TextChannel).send(max_points.link);
	};

	async function callback() {
		const now = new Date();
		if (now.getUTCHours() - 4 == 6 && now.getUTCMinutes() == 0) {
			await sendNews();
		}
		if (now.getUTCHours() - 4 == 13 && now.getUTCMinutes() == 0) {
			await sendNews();
		}
		if (now.getUTCHours() - 4 == 20 && now.getUTCMinutes() == 0) {
			await sendNews();
		}
	}

	(() => {
		setInterval(callback, MINUTE);
	})();
});

client.on('guildMemberAdd', async (member) => {
	setTimeout(() => {
		member.roles.add([`${process.env.MEMBER_ROLE}`]);
		const channel = client.channels.cache.get(`${process.env.GENERAL_CHANNEL}`);

		(channel as TextChannel).send({
			embeds: [
				new EmbedBuilder()
					.setColor(0x0099ff)
					.setTitle(`Welcome to Hack-A-Project ${member.nickname} 👋`)
					.setURL('https://hack-a-project.org')
					.setImage(gifs[Math.floor(Math.random() * (gifs.length + 1))]),
			],
		});
	}, 3000);
});

client.login(process.env.DISCORD_TOKEN);
