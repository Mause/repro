import { Command } from "@oclif/core";
import { Octokit, RestEndpointMethodTypes } from "@octokit/rest";
import { TxtNode, ASTNodeTypes } from "@textlint/ast-node-types";
import { parse } from "@textlint/markdown-to-ast";
import { mkdir, writeFile } from "fs/promises";
import type { PromptModule } from "inquirer";
import * as chalk from "chalk";
import { getLanguage } from "highlight.js";
import * as _ from "lodash";

const { supportsHyperlink } = require("supports-hyperlinks");
const hyperlinker = require("hyperlinker");

const issues = new Octokit().issues;

export const line = (key: string, value: any) =>
  console.log(`${chalk.blue(key)}: %s`, value);

export default abstract class extends Command {
  protected async loadToDisk(issue: any): Promise<string> {
    let { owner, repo, issue_number } = await extract(issue);
    const query = { owner: owner!, repo: repo!, issue_number: issue_number! };
    const details = await issues.get(query);

    this.printInfo(query, details);

    const markdown = parse(details.data.body ?? "");

    const root_blocks = _.chain(Array.from(extractCode(markdown)))
      .groupBy(([lang]) => getLanguage(lang)!.aliases![0]!)
      .mapValues((blocks) => _.map(blocks, 1))
      .value();

    const folder = `${owner}/${repo}`;
    await mkdir(folder, { recursive: true });

    const filenames = [];
    for (const [lang, blocks] of Object.entries(root_blocks)) {
      const filename = `${folder}/${issue_number}.${lang}`;
      await writeFile(
        filename,
        [generateShebang(lang)].concat(blocks).join("\n"),
        { mode: "755" }
      );

      line("Written to", filename);

      filenames.push(filename);
    }

    if (filenames.length === 0) {
      this.warn(chalk.red("No supported code blocks found"));
    }

    return filenames;
  }

  private printInfo(
    query: { owner: string; repo: string; issue_number: number },
    details: RestEndpointMethodTypes["issues"]["get"]["response"]
  ) {
    line("Repo", `${query.owner}/${query.repo}`);
    let title = details.data.title;
    if (supportsHyperlink()) {
      title = hyperlinker(title, details.data.html_url);
    }
    line("Issue", title);
    if (!supportsHyperlink()) {
      line("Url", details.data.html_url);
    }
  }
}

async function extract(issue: string) {
  let owner: string, repo: string, issue_number, _;
  try {
    issue = new URL(issue).pathname.slice(1);
    [owner, repo, _, issue_number] = issue.split("/");
  } catch (e) {
    [owner, repo, issue_number] = issue.split("/");
  }

  if (!issue_number) {
    issue_number = await promptForIssue(repo, owner);
  }

  return { owner, repo, issue_number: Number(issue_number) };
}

async function promptForIssue(repo: string, owner: string) {
  const prompt = await getInquirer();
  const repoIssues = (
    await issues.listForRepo({
      repo,
      owner,
    })
  ).data;
  return (
    await prompt({
      name: "Issue",
      type: "list",
      choices: repoIssues.map((issue) => ({
        name: issue.title,
        value: issue.number,
      })),
    })
  ).Issue;
}

async function getInquirer() {
  const inquirer = await Function('return import("inquirer")')();
  return inquirer.default.prompt as PromptModule;
}

function* extractCode(markdown: TxtNode): Generator<[string, string]> {
  for (const child of markdown.children ?? []) {
    if (child.type === ASTNodeTypes.CodeBlock && child.lang) {
      yield [child.lang.toLowerCase(), child.value];
    }

    yield* extractCode(child);
  }
}

function generateShebang(blockType: string) {
  const executable =
    { py: "python3", js: "node", ts: "ts-node" }[blockType] || blockType;
  return `#!/usr/bin/env ${executable}`;
}
