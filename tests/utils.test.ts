import { describe, it , expect } from "vitest"
import { getFirstGithubUrlByRegex, splitMarkdownByHeadings } from "../src/utils"

const githubUrl = 'https://github.com/nuxt/nuxt'

describe('test get github url', () => {
    it('expect to get the first github url', () => {
        
        expect(getFirstGithubUrlByRegex(
            `the reproduction is here ${githubUrl}. And this is another link, just ignore it https://github.com/huang-julien/reproduire-sur-stackblitz`
        )).toBe(githubUrl)
    })
})

describe('test markdow split', () => {
    it('should correctly split', () => {
        const result = splitMarkdownByHeadings(
            [
                '# Something',
                'Some content',
                '## Reproduction',
                'This is the reproduction',
                '## Multiple line break\n',
                '\nhey \n',
            ].join('\n')
        )
        expect(result).toHaveLength(3)
        expect(result).toMatchInlineSnapshot(`
          [
            "# Something
          Some content",
            "## Reproduction
          This is the reproduction",
            "## Multiple line break


          hey",
          ]
        `)
    })
})