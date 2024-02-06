#!/usr/bin/env node

import * as p from "@clack/prompts";
import chalk from "chalk";
import { randomBytes } from "node:crypto";

async function main() {
	p.intro(
		`${chalk.bgBlue(
			chalk.white(" KEYGEN.JS "),
		)}`,
	);

	const length = await p
		.text({
			message: "How many bytes you want your key to be?",
			defaultValue: 64,
			placeholder: "Press [Enter] if you want to use default (64 bytes)",
			validate: value => {
				if (isNaN(+value)) {
					return chalk.bgRed(chalk.black("Please enter a number"));
				}
			},
		})
		
	const type = await p
	.select({
		message: "Which type you want your key to be?",
		defaultValue: 'hex',
		options: [
			{
				label: 'Hexadecimal',
				hint: 'hex',
				value: 'hex',
			},
			{
				label: 'Base64',
				hint: 'base64',
				value: 'base64',
			},
			{
				label: 'Base64url',
				hint: 'base64url',
				value: 'base64url',
			},
			{
				label: 'UTF-8',
				hint: 'utf-8',
				value: 'utf-8',
			},
			{
				label: 'ASCII',
				hint: 'ascii',
				value: 'ascii',
			},
			{
				label: 'Binary',
				hint: 'binary',
				value: 'binary',
			},
			{
				label: 'UCS2',
				hint: 'ucs2',
				value: 'ucs2',
			}
		],
		initialValue: 'hex'
	})
	
	randomBytes(+length, async (err, buffer) => {
		if (err) throw err;
		else process.stdout.end(`YOUR KEY: ${chalk.green(buffer.toString(type))}`);
	});

	p.outro(
		`${chalk.bgBlue(
			chalk.white(" KEYGEN.JS "),
		)} Made by NimaCodez.`,
	);}

main();
