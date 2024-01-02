import { Args, Command, ux } from "@oclif/core";
import { Octokit, RestEndpointMethodTypes } from "@octokit/rest";
import { TxtNode, ASTNodeTypes } from "@textlint/ast-node-types";
import { parse } from "@textlint/markdown-to-ast";
import { mkdir, writeFile } from "node:fs/promises";
import type { PromptModule } from "inquirer";
import hljs from "highlight.js";
import _ from "lodash";
import { supportsHyperlink } from "supports-hyperlinks";
import hyperlinker from "hyperlinker";

const { issues } = new Octokit();

export const sharedArgs = (description: string) => ({
  issue: Args.string({
    name: "issue",
    description: `${description} - either a URL or owner/name/issue_id triplet`,
    required: true,
  }),
});

export default abstract class extends Command {
  protected async loadToDisk(issue: any): Promise<string[]> {
    const query = await extract(issue);
    const { owner, repo, issueNumber } = query;

    const details = await issues.get({
      owner,
      repo,
      // eslint-disable-next-line camelcase
      issue_number: issueNumber,
    });

    this.printInfo(query, details);

    const markdown = parse(details.data.body ?? "");

    const rootBlocks = _.chain([...extractCode(markdown)])
      .groupBy(([lang]) => hljs.getLanguage(lang)!.aliases![0]!)
      .mapValues((blocks) => _.map(blocks, 1))
      .value();

    const folder = `${owner}/${repo}`;
    await mkdir(folder, { recursive: true });

    const filenames = await Promise.all(
      Object.entries(rootBlocks).map(async ([lang, blocks]) => {
        const filename = `${folder}/${issueNumber}.${lang}`;
        await writeFile(
          filename,
          [generateShebang(lang), ...blocks].join("\n"),
          { mode: "755" },
        );

        this.line("Written to", filename);

        return filename;
      }),
    );

    if (filenames.length === 0) {
      this.warn(
        ux.colorize(
          this.config.theme?.warn ?? "red",
          "No supported code blocks found",
        ),
      );
    }

    return filenames;
  }

  private printInfo(
    query: { owner: string; repo: string; issueNumber: number },
    details: RestEndpointMethodTypes["issues"]["get"]["response"],
  ) {
    this.line("Repo", `${query.owner}/${query.repo}`);
    let { title } = details.data;
    // eslint-disable-next-line camelcase
    const { html_url } = details.data;
    const links = supportsHyperlink(process.stdout);
    if (links) {
      title = hyperlinker(title, html_url);
    }

    this.line("Issue", title);
    if (!links) {
      this.line("Url", html_url);
    }
  }

  public async line(key: string, value: any) {
    this.log(ux.colorize(this.config.theme?.info ?? "blue", key), value);
  }
}

async function extract(
  issue: string,
): Promise<{ owner: string; repo: string; issueNumber: number }> {
  try {
    issue = new URL(issue).pathname.slice(1);
  } catch {}

  const parts = issue.split("/");

  const [owner, repo] = parts;
  let issueNumber = parts.at(-1);

  if (!issueNumber) {
    issueNumber = await promptForIssue(repo, owner);
  }

  return { owner, repo, issueNumber: Number(issueNumber) };
}

async function promptForIssue(repo: string, owner: string) {
  const prompt = await getInquirer();
  const repoIssues = await issues.listForRepo({
    repo,
    owner,
  });

  const response = await prompt({
    name: "Issue",
    type: "list",
    choices: repoIssues.data.map((issue) => ({
      name: issue.title,
      value: issue.number,
    })),
  });

  return response.Issue;
}

async function getInquirer() {
  // eslint-disable-next-line no-new-func
  const inquirer = await new Function('return import("inquirer")')();
  return inquirer.default.prompt as PromptModule;
}

function* extractCode(markdown: TxtNode): Generator<[string, string]> {
  for (const child of markdown.children ?? []) {
    if (child.type === ASTNodeTypes.CodeBlock) {
      yield [child.lang?.toLowerCase() || "txt", child.value];
    }

    yield* extractCode(child);
  }
}

function generateShebang(blockType: string) {
  if (blockType === "java") {
    return `///usr/bin/env jbang "$0" "$@" ; exit $?`;
  }

  const executable =
    { py: "python3", js: "node", ts: "ts-node" }[blockType] || blockType;
  return `#!/usr/bin/env ${executable}`;
}
