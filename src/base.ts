import { Command } from "@oclif/core";
import { Octokit, RestEndpointMethodTypes } from "@octokit/rest";
import { TxtNode, ASTNodeTypes } from "@textlint/ast-node-types";
import { parse } from "@textlint/markdown-to-ast";
import { mkdir, writeFile } from "node:fs/promises";
import type { PromptModule } from "inquirer";
import hljs from "highlight.js";
import _ from "lodash";
import { supportsHyperlink } from "supports-hyperlinks";
import hyperlinker from "hyperlinker";
// eslint-disable-next-line unicorn/import-style
import type { ChalkInstance } from "chalk";

// eslint-disable-next-line no-new-func, unicorn/prefer-top-level-await
const chalk = new Function('return import("chalk")')().then(
  (chalk: any) => chalk.default as ChalkInstance
);

const issues = new Octokit().issues;

export const line = async (key: string, value: any) => {
  const newLocal = await chalk;
  return console.log(`${newLocal.blue(key)}: %s`, value);
};

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
          { mode: "755" }
        );

        line("Written to", filename);

        return filename;
      })
    );

    if (filenames.length === 0) {
      const chalkInstance = await chalk;
      this.warn(chalkInstance.red("No supported code blocks found"));
    }

    return filenames;
  }

  private printInfo(
    query: { owner: string; repo: string; issueNumber: number },
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

async function extract(
  issue: string
): Promise<{ owner: string; repo: string; issueNumber: number }> {
  try {
    issue = new URL(issue).pathname.slice(1);
  } catch {}

  const parts = issue.split("/");

  const [owner, repo] = parts;
  let issueNumber = _.last(parts);

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
  const executable =
    { py: "python3", js: "node", ts: "ts-node" }[blockType] || blockType;
  return `#!/usr/bin/env ${executable}`;
}
