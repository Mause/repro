import { Command } from "@oclif/core";

export default class Config extends Command {
  static description = "Dumps current config";

  async run(): Promise<void> {
    console.log("Config");
    console.log("------");
    console.log(this.config.configDir);
    console.log(this.config.theme);
  }
}
