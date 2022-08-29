import Shared from "../base";

export default class Load extends Shared {
  static description = "Load code blocks from an issue into a file";

  static examples = [
    `$ repro load owner/repo/issue_id`,
  ];

  static flags = {};

  static args = [
    {
      name: "issue",
      description:
        "Issue to load - either a URL or owner/name/issue_id triplet",
      required: true,
    },
  ];

  async run(): Promise<void> {
    const { args } = await this.parse(Load);

    let { issue } = args;

    await this.loadToDisk(issue);
  }
}
