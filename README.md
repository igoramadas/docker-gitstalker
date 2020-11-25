# GitStalker

This is a small Docker image to clone and automatically pull the passed GIT repos every 15 minutes. The repos should be passed as environment variables prefixed with "gitstalker_". The destination folder should be mounted to "/repos".

I originally wrote this to run on my QNAP NAS drive, but it can be used on any system that suits you.

## Sample usage

    $ docker run \
      -e gitstalker_strautomator=https://username:password@github.com/strautomator/web.git \
      -e gitstalker_pandagainz=https://username:password@github.com/igoramadas/pandagainz.git \
      -v /share/GIT/repos:/repos \
      -d igoramadas/gitstalker:latest

## Limitations

- At the moment you can only clone via https://, trying to clone using SSH will fail.
