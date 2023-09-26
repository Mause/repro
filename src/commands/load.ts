import Shared, { sharedArgs } from "../base";

export default class Load extends Shared {
  static description = "Load code blocks from an issue into a file";

  static examples = ["$ repro load owner/repo/issue_id"];

  static flags = {};

  static args = sharedArgs("Issue to load");

  async run(): Promise<void> {
    const { args } = await this.parse(Load);

    const { issue } = args;

    await this.loadToDisk(issue);
  }
}
