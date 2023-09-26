import Shared, { sharedArgs } from "../base";
import { execFileSync } from "node:child_process";

export default class Run extends Shared {
  static description =
    "Load code blocks from an issue into a file and run them";

  static examples = ["$ repro run owner/repo/issue_id"];

  static flags = {};

  static args = sharedArgs("Issue to load and run");

  async run(): Promise<void> {
    const { args } = await this.parse(Run);

    const { issue } = args;

    const filenames = await this.loadToDisk(issue);

    if (filenames.length === 1) {
      execFileSync(filenames[0]);
    } else if (filenames.length > 1) {
      this.warn("More than one file generated, will not execute");
    }
  }
}
