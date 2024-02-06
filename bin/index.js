#! /usr/bin/env node

const { program } = require("commander");
const { randomBytes } = require("crypto");

program.parse(process.argv);
const options = program.opts();
console.log(options);

program
	.command("keygn", "Generate random key")
	.option("-bytes, --bytes <bytes>", "Number of bytes", 64)
	.action(() => {
		randomBytes(64, (err, buffer) => {
			if (err) throw err;
			else console.log(buffer.toString("hex"));
		});
	});


program.parse()