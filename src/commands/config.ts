import { Command, ux, Flags } from "@oclif/core";
import * as path from "node:path";
import * as fs from "node:fs/promises";

async function writeJsonFile(file: string, data: any): Promise<void> {
  await fs.writeFile(file, JSON.stringify(data, undefined, 2));
}

const DEFAULT = {
  bin: "white",
  command: "cyan",
  commandSummary: "white",
  dollarSign: "white",
  flag: "white",
  flagDefaultValue: "blue",
  flagOptions: "white",
  flagRequired: "red",
  flagSeparator: "white",
  sectionDescription: "white",
  sectionHeader: "underline",
  topic: "white",
  version: "white",
};

export default class Config extends Command {
  static description = "Dumps current config";

  static flags = {
    "default-config": Flags.boolean({
      type: "boolean" as const,
      default: false,
      description: "Show default config",
      name: "default",
    }),
  };

  async run(): Promise<void> {
    this.log("Config");
    this.log("------");
    const { configDir, theme } = this.config;
    this.log(`Config dir: ${configDir}`);
    const themePath = path.join(configDir, "theme.json");
    this.log("------");
    this.log("Theme: " + JSON.stringify(theme, undefined, 2));

    const { flags } = await this.parse(Config);

    if (flags["default-config"]) {
      await writeJsonFile(themePath, DEFAULT);
    }
  }

  public info(msg: string): void {
    this.log(ux.colorize(this.config.theme?.info, "info:"), msg);
  }
}
