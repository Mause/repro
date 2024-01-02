import { Command, ux } from "@oclif/core";

export default class Config extends Command {
  static description = "Dumps current config";

  async run(): Promise<void> {
    this.log("Config");
    this.log("------");
    this.log(this.config.configDir);
    this.log("------");
    this.log(JSON.stringify(this.config.theme, undefined, 2));
  }

  public info(msg: string): void {
    this.log(ux.colorize(this.config.theme?.info, "info:"), msg);
  }
}
