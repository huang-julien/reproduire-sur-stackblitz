'use strict';

const github = require('@actions/github');
const core = require('@actions/core');

const getStackblitzLinkMessage = (repo) => {
  return `
Stackblitz link for the reproduction: [Stackblitz](https://stackblitz.com/github/${repo})
`;
};

async function main() {
  try {
    const {
      repo,
      payload: {
        issue,
        pull_request: pullRequest
      }
    } = github.context;
    if (pullRequest || !issue?.body)
      return core.info("Not an issue or has no body.");
    const result = issue.body.match(/(?:^|\n)#+\s[^\n]*\n(.*?)(?=\n##?\s|$)/gm)?.map((v) => v.trim());
    if (!result)
      return core.info("No heading found");
    const reproductionSection = result.find((v) => v.toLowerCase().startsWith(core.getInput("reproduction-section")));
    if (!reproductionSection)
      return core.info("No reproduction section found");
    const ghLink = reproductionSection.match(/github\.com\/([^/ ]+\/[^/ ]+)/g);
    if (!ghLink || !ghLink.length)
      return core.info("No github repo found");
    const linkRepo = ghLink[0].replace(/github\.com\/([^/ ]+\/[^/ ]+)/g, (match, repo2) => {
      core.info(`Found repo: ${repo2}`);
      return repo2;
    });
    const token = core.getInput("repo-token") ?? process.env.GITHUB_TOKEN;
    const client = github.getOctokit(token).rest;
    client.issues.createComment({
      ...repo,
      issue_number: issue.number,
      body: getStackblitzLinkMessage(linkRepo)
    });
    return core.info(`Comment created for issue: ${issue.number} to the repo: ${linkRepo} on stackblitz`);
  } catch (error) {
    core.setFailed(error instanceof Error ? error.message : "Unknown error");
  }
}
main();
