import { setFailed, info, getInput } from "@actions/core"
import { context, getOctokit } from "@actions/github"
import { getStackblitzLinkMessage } from "./message"

async function main() {
    try {
        const {
            repo,
            payload: {
                issue,
                pull_request: pullRequest,
            }
        } = context
        if (pullRequest || !issue?.body) return info("Not an issue or has no body.")
        const result = issue.body.match(/(?:^|\n+)#+\s\S[^\n]*\n+(.*?)(?=\n+##?\s\S|$)/gm)?.map(v => v.trim())
        info('issue content --> ' + issue.body)
         if (!result) return info("No heading found")
            info('headings: ' + JSON.stringify(result))

        const reproductionSection = result.find(v => v.startsWith(getInput('reproduction-heading')))
        if (!reproductionSection) return info("No reproduction section found")
        info('Reproduction section:' + reproductionSection)
        const ghLink = reproductionSection.match(/github\.com\/([^/ ]+\/[^/ ]+)/g)
        if (!ghLink || !ghLink.length) return info("No github repo found")

        const linkRepo = ghLink[0].replace(/github\.com\/([^/ ]+\/[^/ ]+)/g, (match, repo) => {
            info(`Found repo: ${repo}`)
            return repo
        })

        const token = getInput("repo-token") ?? process.env.GITHUB_TOKEN
        const client = getOctokit(token).rest
        client.issues.createComment({
            ...repo,
            issue_number: issue.number,
            body: getStackblitzLinkMessage(linkRepo),
        })

        return info(`Comment created for issue: ${issue.number} to the repo: ${linkRepo} on stackblitz`)
    }
    catch (error) {
        setFailed(error instanceof Error ? error.message : "Unknown error")
    }
}


main()