export const getStackblitzLinkMessage = (repo: string) => {
    return `
Stackblitz link for the reproduction: [Stackblitz](https://stackblitz.com/github/${repo})
`
}

export function splitMarkdownByHeadings(text: string) {
 return text.replace(/\r\n/g, '\n').match(/(?<title>^#{1,6} .*)(?<content>(?:\n(?!#{1,6} ).*)*)/gm)?.map(v => v.trim())   
}

export function getFirstGithubUrlByRegex(text: string) {
    return text.match(/https?:\/\/(?:www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+/)
}