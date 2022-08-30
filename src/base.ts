import { Command } from "@oclif/core";
import { Octokit } from "@octokit/rest";
import { TxtNode, ASTNodeTypes } from "@textlint/ast-node-types";
import { parse } from "@textlint/markdown-to-ast";
import { mkdir, writeFile } from "fs/promises";
import type { PromptModule } from "inquirer";

const issues = new Octokit().issues;

export default abstract class extends Command {
  protected async loadToDisk(issue: any) {
    let { owner, repo, issue_number } = await extract(issue);
    const query = { owner: owner!, repo: repo!, issue_number: issue_number! };
    this.log(JSON.stringify(query));
    const details = await issues.get(query);

    const markdown = parse(details.data.body ?? "");

    const root_blocks: Record<FileType, string[]> = { py: [], ts: [] };
    for (const [lang, block] of extractCode(markdown)) {
      if (["py", "python"].includes(lang)) {
        root_blocks.py.push(block);
      } else if (["js", "javascript", "typescript"].includes(lang)) {
        root_blocks.ts.push(block);
      }
    }

    const folder = `${owner}/${repo}`;
    await mkdir(folder, { recursive: true });

    const filenames = [];
    for (const [lang, blocks] of Object.entries(root_blocks)) {
      if (blocks.length) {
        const filename = `${folder}/${issue_number}.${lang}`;
        await writeFile(
          filename,
          [generateShebang(lang as FileType)].concat(blocks).join("\n"),
          { mode: "755" }
        );

        this.log("Written to %s", filename);

        filenames.push(filename);
      }
    }

    if (filenames.length === 0) {
      this.warn("No supported code blocks found");
    }

    return filenames;
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
    if (child.type == ASTNodeTypes.CodeBlock && child.lang) {
      yield [child.lang.toLowerCase(), child.value];
    }

    yield* extractCode(child);
  }
}

type FileType = "ts" | "py";

function generateShebang(blockType: FileType) {
  return `#!/usr/bin/env ${blockType == "py" ? "python3" : "node"}`;
}
