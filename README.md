# GitStalker

## THIS PROJECT IS NOT MAINTAINED ANY LONGER! If you still want to backup your GIT repos, I recommend Gickup: https://github.com/cooperspencer/gickup

This is a small Docker image to automatically clone / pull GIT and backup GitHub repos.

- Clone and pull specific GIT repositories every 15 minutes
- Backup all your GitHub repos (including private ones) daily
- Automatically remove old backups (default is 7 days)

I originally wrote this to run on my QNAP NAS drive, but it can be used on any system that suits you.

## Sample usage

    $ docker run --name gitstalker \
                 -e GITHUB_USERNAME=igoramadas \
                 -e GITHUB_TOKEN=my_personal_token \
                 -e BACKUP_DAYS=30 \
                 -e REPO_strautomator=https://another_user:my_password@github.com/strautomator/web.git \
                 -e REPO_pandagainz=https://github.com/igoramadas/pandagainz.git \
                 -v /share/backup:/backup \
                 -v /share/GIT/repos:/repos \
                 igoramadas/gitstalker:latest

## Environment variables

#### GITHUB_USERNAME

Your GitHub username. If not provided then the backup feature will not run.

#### GITHUB_TOKEN

Your personal GitHub access token. To get one, follow [these instructions](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token).

#### BACKUP_DAYS

For how many days should backups be kept? Default value is **7**.

#### INCLUDE_ARCHIVED

If 1 or true, archived repos will also be backed up. Default is **false**.

#### USER_AGENT

Allows you to change the User-Agent header connecting to GitHub. Default is **GitStalker**.

#### REPO_id

Any environment variable starting with *REPO_* will be considered a repository to be cloned / pulled.

## Folders

- **/backup** - where backups should be saved
- **/repos** - where individual repos should be cloned to

## Limitations

- Backup only compatible with GitHub for now. BitBucket and others might be added in the future (no promises!).
- At the moment you can only clone via https://, trying to clone using SSH will fail.
- Credentials need to be passed directly on the URL when needed.
    - For GitHub repos, if no credentials were passed and you have set the GITHUB_USERNAME and GITHUB_TOKEN, these will be added automatically.
