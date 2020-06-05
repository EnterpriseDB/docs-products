## Setup

1. This project uses `nvm` to manage the node version. You should install the correct node version with `nvm install`.
2. Install yarn and gatsby with `npm i -g gatsby-cli` and `npm i -g yarn`
3. Install all the bits and bobs with `yarn`
4. Pull the shared icon files down with `git submodule update --init`
5. Run the site locally with `gatsby develop`

### Running Katacoda embeds locally
If you need to run the Katacoda embeds during local development, you'll need to have SSL setup locally.

1. Run the server with `gatsby develop --https`. When promped, enter your root password. This will configured a local certificate for the development server to use.
2. Install `certutil`, which will handle browser acceptance of your local cert. See [this Gatsby doc](https://www.gatsbyjs.org/docs/local-https/#manual-installation-of-certutil) to accomplish that. TLDR on Mac, run `brew install nss`.
3. Run `gatsby develop --https` again. The site should now be available at `https://localhost:8000`, and katacoda embeds should work.

## Deployment

Deploy the site to GH Pages with `yarn run deploy`

## Icons

We're using the shared [edb-icons repository](https://github.com/rocketinsights/edb-icons) as a git submodule. Any updates to icons should be made in this repository. When you're ready to pull in changes, run `git submodule update --remote`. This will create a change in your local repository that you should commit as part of your next PR.

## Migrating RST files

To migrate RST files, place the folder in a new `content` folder and run `yarn convert`

The results will show up in the `content_build` folder. These can then be moved to the `docs` folder.

The folder structure in docs is `{product}/{version number}/{content folder}`. If there is no version involved, just make it "1"
