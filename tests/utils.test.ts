import { describe, it , expect } from "vitest"
import { getRepo, splitMarkdownByHeadings } from "../src/utils"

describe('test get github repo', () => {
  it.each([
    'some text https://github.com/nuxt/scripts some text',
    'some text https://github.com/nuxt/scripts some text and another url https://github.com/nuxt/nuxt',
    'some text https://github.com/nuxt/scripts. some text',
  ])('should return the github repo', (text) => {
    expect(getRepo(text)).toBe('nuxt/scripts')
  })

  it.each([
    {
      text: 'https://github.com/nuxt/scripts',
      result: 'nuxt/scripts'
    },
    {
      text: 'https://github.com/a-dash/some-repo',
      result: 'a-dash/some-repo'
    },
    {
      text: 'https://github.com/a-dash/some-repo.',
      result: 'a-dash/some-repo'
    },
    {
      text: 'https://github.com/a-dash/some-repo some text',
      result: 'a-dash/some-repo'
    },
    {
      text: 'https://github.com/a-dash/some-repo123 some text',
      result: 'a-dash/some-repo123'
    }
  ])('should return the github repo', ({ text, result }) => {
    expect(getRepo(text)).toBe(result)
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