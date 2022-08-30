import { Command } from "@oclif/core";
import { Octokit } from "@octokit/rest";
import { TxtNode, ASTNodeTypes } from "@textlint/ast-node-types";
import { parse } from "@textlint/markdown-to-ast";
import { mkdir, writeFile } from "fs/promises";

export default abstract class extends Command {
  protected async loadToDisk(issue: any) {
    let { owner, repo, issue_number } = extract(issue);
    const query = { owner: owner!, repo: repo!, issue_number: issue_number! };
    this.log(JSON.stringify(query));
    const details = await new Octokit().issues.get(query);

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
      this.warn('No supported code blocks found, will not execute');
    }

    return filenames;
  }
}

function extract(issue: string) {
  let owner, repo, issue_number, _;
  try {
    issue = new URL(issue).pathname.slice(1);
    [owner, repo, _, issue_number] = issue.split("/");
  } catch (e) {
    [owner, repo, issue_number] = issue.split("/");
  }

  if (!issue_number) {
  }

  return { owner, repo, issue_number: Number(issue_number) };
}

function* extractCode(markdown: TxtNode): Generator<[string, string]> {
  for (const child of markdown.children ?? []) {
    if (child.type == ASTNodeTypes.CodeBlock) {
      yield [child.lang.toLowerCase(), child.value];
    }

    yield* extractCode(child);
  }
}

type FileType = "ts" | "py";

function generateShebang(blockType: FileType) {
  return `#!/usr/bin/env ${blockType == "py" ? "python3" : "node"}`;
}
