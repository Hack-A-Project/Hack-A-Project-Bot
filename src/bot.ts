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
let gifIndex = 0;

let postedNews: string[] = [];

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

		$('table#hnmain tbody tr:eq(3) table tbody tr').each((i, el) => {
			if (i % 3 == 1) {
				const points = parsePoints(
					$(el).children('td.subtext').children('span.subline').children('span.score').text()
				);
				const link = $(el.prev!)
					.children('td:eq(2)')
					.children('span.titleline')
					.children('a')
					.attr('href');
				if (points > max_points.points && !postedNews.includes(link!)) {
					postedNews.push(link!);
					max_points.link = link!;
					max_points.points = points;
				}
			}
		});

		if (max_points.link === '') max_points.link = 'NO NEW NEWS || ERROR';
		(channel as TextChannel).send(max_points.link);
	};

	async function callback() {
		const now = new Date();
		if (now.getDate() == 1) postedNews = [];
		if (now.getUTCHours() - 4 == 6 && now.getUTCMinutes() == 0) {
			await sendNews();
		}
		if (now.getUTCHours() - 4 == 13 && now.getUTCMinutes() == 0) {
			await sendNews();
		}
		if (now.getUTCHours() - 4 == 19 && now.getUTCMinutes() == 0) {
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
		gifIndex = (gifIndex + 1) % gifs.length;

		(channel as TextChannel).send({
			embeds: [
				new EmbedBuilder()
					.setColor(0x0099ff)
					.setTitle(`Welcome to Hack-A-Project ${member.displayName} 👋`)
					.setURL('https://hack-a-project.org')
					.setImage(gifs[gifIndex]),
			],
		});
	}, 30 * SECOND);
});

client.login(process.env.DISCORD_TOKEN);
