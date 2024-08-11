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

        const result = issue.body.match(/(?:^|\n)#+\s[^\n]*\n(.*?)(?=\n##?\s|$)/gm)?.map(v => v.trim())

        if (!result) return info("No heading found")

        const reproductionSection = result.find(v => v.toLowerCase().startsWith(getInput('reproduction-section')))
        if (!reproductionSection) return info("No reproduction section found")

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