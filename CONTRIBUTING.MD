# How to contribute

## Developing Locally

### Developing Packages that depend on one another at the same time

1. Run `yarn` at the root of the repo.

2. Run `yarn lerna link --force-local` at the root of the repo.

3. Run `yarn build` at the root of the repo.

4. Run `yarn develop` at each of the packages that depends on the other.

> You can run a package individually: `yarn workspace {packageName} develop`

### Developing packages while also testing on a store

1. Repeat the steps from the above section

2. Run `yarn link` on the package that you are developing

3. Run `yarn` at the store's repo

4. If the store's repo already have the package that you are developing as a dependency, just run `yarn link {packageName}`

5. If your package is not an npm dependency yet, you can develop locally by referring to your local version of the package on gatsby config.

Example:

```ts
{
  resolve: '/Users/jmgris/work/faststore/packages/gatsby-plugin-pixel-facebook'
}
```

## Creating Pull Requests

1. Create a production build by running `yarn build` at the root of the package that you are developing

2. Commit your changes in a branch

3. Push your changes to the remote repo by running `lerna publish --dist-tag next`

4. Take note of the version of your packages and add them as a dependency in the `package.json` file of the [storecomponents](https://github.com/vtex-sites/storecomponents.store).

5. Submit a Pull Request with this changes to `storecomponents`

6. Wait for checks to pass and reviews to be approved.

## Release

1. After acquiring the necessary approval, rebase and squash-merge your PR in master

2. Locally, go to the master branch pull the changes with `git pull origin master`

3. Clear any artifact and release a clean build with
```
git clean -fdx && yarn && lerna run build && lerna publish minor --yes
```

4. Go grab a coffe ☕

5. Update `package.json` of the `storecomponents` with:
```
yarn upgrade -L --scope @vtex
```

6. Stage, commit and push your changes with:
```
git add . && git commit -m "upgrade deps" && git push
```

7. Rebase with master
```
git rebase origin/master && git push --force
```

8. Wait for the bots to approve the PR.

9. Squash-merge for releasing a new store version 🎉
