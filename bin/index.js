#!/usr/bin/env node

import * as p from "@clack/prompts";
import chalk from "chalk";
import { randomBytes } from "node:crypto";
import clipboardy from "clipboardy";
import fs from "fs";
import path from "path";

// Parse CLI arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "-b" || args[i] === "--bytes") {
      options.bytes = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === "-t" || args[i] === "--type") {
      options.type = args[i + 1];
      i++;
    } else if (args[i] === "--save") {
      options.save = args[i + 1] && !args[i + 1].startsWith("-") ? args[i + 1] : true;
      if (options.save !== true) i++;
    }
  }
  return options;
}

function getDefaultFilename() {
  const now = new Date();
  const stamp = now.toISOString().replace(/[:.]/g, "-");
  return `key_${stamp}.txt`;
}

async function main() {
  const cliOpts = parseArgs();

  p.intro(`${chalk.bgBlue(chalk.white(" KEYGN "))}`);

  let length, type;

  // اگر مقدار از CLI نیومده بود، پرامپت بیاد
  if (cliOpts.bytes) {
    length = cliOpts.bytes;
  } else if (process.argv.length <= 2) {
    length = await p.text({
      message: "How many bytes you want your key to be?",
      defaultValue: "64",
      placeholder: "Press [Enter] if you want to use default (64 bytes)",
      validate: value => {
        if (isNaN(+value) || +value <= 0) {
          return chalk.bgRed(chalk.black("Please enter a positive number"));
        }
      },
    });
  } else {
    length = 64;
  }

  if (cliOpts.type) {
    type = cliOpts.type;
  } else if (process.argv.length <= 2) {
    type = await p.select({
      message: "Which type you want your key to be?",
      defaultValue: "hex",
      options: [
        { label: "Hexadecimal", value: "hex" },
        { label: "Base64", value: "base64" },
        { label: "Base64url", value: "base64url" },
        { label: "UTF-8", value: "utf-8" },
        { label: "ASCII", value: "ascii" },
        { label: "Binary", value: "binary" },
        { label: "UCS2", value: "ucs2" },
      ],
      initialValue: "hex",
    });
  } else {
    type = "hex";
  }

  try {
    randomBytes(+length, async (err, buffer) => {
      if (err) {
        console.error(chalk.bgRed(chalk.black(" Error generating key: ")), err.message);
        process.exit(1);
      }

      const key = buffer.toString(type);

      try {
        await clipboardy.write(key);
        console.log(`YOUR KEY: ${chalk.green(key)} (✨ Copied to clipboard)`);
      } catch (clipErr) {
        console.warn(chalk.yellow("⚠ Could not copy to clipboard: "), clipErr.message);
        console.log(`YOUR KEY: ${chalk.green(key)}`);
      }

      if (cliOpts.save) {
        // اگر فلگ save داده شده بود
        const filename = cliOpts.save === true ? getDefaultFilename() : cliOpts.save;
        try {
          fs.writeFileSync(path.resolve(filename), key);
          console.log(chalk.blue(`Key saved to ${filename} 📂`));
        } catch (fileErr) {
          console.error(chalk.bgRed(" Error saving file: "), fileErr.message);
        }
      } else if (process.argv.length <= 2) {
        // فقط در حالت interactive بپرس
        const saveToFile = await p.confirm({
          message: "Do you want to save the key to a file?",
          initialValue: false,
        });

        if (saveToFile) {
          const filename = getDefaultFilename();
          try {
            fs.writeFileSync(path.resolve(filename), key);
            console.log(chalk.blue(`Key saved to ${filename} 📂`));
          } catch (fileErr) {
            console.error(chalk.bgRed(" Error saving file: "), fileErr.message);
          }
        }
      }

      p.outro(`${chalk.bgBlue(chalk.white(" KEYGN "))} Made by NimaCodez (extended).`);
    });
  } catch (err) {
    console.error(chalk.bgRed(chalk.black(" Unexpected error: ")), err.message);
    process.exit(1);
  }
}

main();
