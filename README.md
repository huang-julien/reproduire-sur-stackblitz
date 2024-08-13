# reproduire-sur-stackblitz actions

Github action that comment on issues with a github reproduction.
The action will send a link to open the repository on stackblitz.

## Setup

```yaml
name: reproduire-sur-stackblitz
on:
    issues:
        types:
            opened

permissions:
    issues: write

jobs:
    reproduire-sur-stackblitz:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v3
            - uses: huang-julien/reproduire-sur-stackblitz@v1
```

## Inputs

### repo-token

Token for the repository. Can be passed in using `{{ secrets.GITHUB_TOKEN }}`.

### reproduction-heading

The heading of the issue where the reproduction is located. Default to `## Reproduction`