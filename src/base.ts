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

    const blocks = [generateShebang("python")];
    for (const [lang, block] of extractCode(markdown)) {
      if (lang == "py" || lang == "python") {
        blocks.push(block);
      }
    }

    const folder = `${owner}/${repo}`;
    await mkdir(folder, { recursive: true });

    const filename = `${folder}/${issue_number}.py`;
    await writeFile(filename, blocks.join("\n"), { mode: "755" });

    this.log("Written to %s", filename);

    return filename;
  }
}

function extract(issue: string) {
  let owner, repo, issue_number, _;
  try {
    issue = new URL(issue).pathname.slice(1);
    ([owner, repo, _, issue_number] = issue.split("/"));
  } catch (e) {
    ([owner, repo, issue_number] = issue.split("/"));
  }

  if (!issue_number) {
  }

  return { owner, repo, issue_number: Number(issue_number) };
}

function* extractCode(markdown: TxtNode): Generator<[string, string]> {
  for (const child of markdown.children ?? []) {
    if (child.type == ASTNodeTypes.CodeBlock) {
      yield [child.lang, child.value];
    }

    yield* extractCode(child);
  }
}

function generateShebang(arg0: string) {
    return '#!/usr/bin/env python3';
}

