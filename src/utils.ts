export const getStackblitzLinkMessage = (repo: string) => {
    return `
Stackblitz link for the reproduction: [Stackblitz](https://stackblitz.com/github/${repo})
`
}

export function splitMarkdownByHeadings(text: string) {
 return text.replace(/\r\n/g, '\n').match(/(?<title>^#{1,6} .*)(?<content>(?:\n(?!#{1,6} ).*)*)/gm)?.map(v => v.trim())   
}

export function getRepo(text: string) {
    const url = /github\.com\/([^/ ]+\/[a-z-0-9]+)/.exec(text)
    if(url && url.length) {
        return url[0].split('github.com/')[1]
    }
}