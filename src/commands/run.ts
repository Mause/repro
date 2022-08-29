import Shared from "../base";
import { execFileSync } from "child_process";

export default class Run extends Shared {
  static description = "Load code blocks from an issue into a file and run them";

  static examples = [
    `$ repro run owner/repo/issue_id`,
  ];

  static flags = {};

  static args = [
    {
      name: "issue",
      description:
        "Issue to load and run - either a URL or owner/name/issue_id triplet",
      required: true,
    },
  ];

  async run(): Promise<void> {
    const { args } = await this.parse(Run);

    let { issue } = args;

    const filename = await this.loadToDisk(issue);

    execFileSync(filename);
  }
}
