import { setFailed, info, getInput } from "@actions/core"
import { context, getOctokit } from "@actions/github"
import { splitMarkdownByHeadings, getStackblitzLinkMessage, getRepo } from "./utils"

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
        const result = splitMarkdownByHeadings(issue.body)

        if (!result) return info("No heading found")

        const reproductionSection = result.find(v => v.startsWith(getInput('reproduction-heading')))
        if (!reproductionSection) return info("No reproduction section found")

        const repositoryName = getRepo(reproductionSection)
        if(!repositoryName) return info("No repo found")
        const token = getInput("repo-token") ?? process.env.GITHUB_TOKEN
        const client = getOctokit(token).rest
        const repositoryExist = await client.repos.get({
            repo: repositoryName.split('/')[1],
            owner: repositoryName.split('/')[0]
        }).then(() => true).catch(() => false)

        if (!repositoryExist) return info("No repo found")

        client.issues.createComment({
            ...repo,
            issue_number: issue.number,
            body: getStackblitzLinkMessage(repositoryName),
        })

        return info(`Comment created for issue: ${issue.number} to the repo: ${repositoryName} on stackblitz`)
    }
    catch (error) {
        setFailed(error instanceof Error ? error.message : "Unknown error")
    }
}


main()