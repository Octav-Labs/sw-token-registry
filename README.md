# token-registry

## Publish new version

```shell
npm version patch
git push origin main --tags

# or
npm version patch && git push origin main --tags
```

## Integration tests

```shell
npm run test:integration -- -t 'evmFetcher'
```
