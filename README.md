# Instructions

- First make your own fork


# Resources 

- Repository is so called monorepo, more informations here https://lerna.js.org/

- Package client used is "Yarn" not npm,.... more informations here https://yarnpkg.com/ Using incorrect package manager will break the monorepo.

- Get familiar with storybook, more informations here https://storybook.js.org/

## Your own package... component

- First run... 


```sh
$ lerna create <your packagename>
```
- New package is created under /packages folder.

- Modify default package.json... see example on core package. 

- Setup your own storybook environment.... see example on core package.

- Test new package by running... 

```sh
$ yarn storybook
```
