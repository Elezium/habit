# Contributing Guide

## Forking and Setting up a Local Copy

1) Fork the copy to your github account

2) Clone your copy of the repo

3) Create a new remote that points to the beingbrown:habit repo

[GitHub][forkarepo] has written a very helpful guide to completing this series
of steps.

[forkarepo]: https://help.github.com/articles/fork-a-repo/

## Making Edits, Additions, and Deletions

habit follows a loose version of [gitflow][nviegitflow] on the
[central repository][centrepo], but this really only effects you in a few ways:

1) Do not make commits to master or develop

2) All merges need to be made using --no-ff

In order to protect yourself from forgetfulness, configuring git to not use
fast forward:

```
git config merge.ff false
```

In order to make changes, the first thing you need to do is branch from
develop. You can name your branch whatever, so long as it is relevant to the
changes you are making. Do not, for instance, create f-omnibus which changes all
the things. If you want to change or add content to different and unrelated
areas--for instance, ui and stat tracking--make two different branches to
accomplish this. They can be sequential.

A sample command for creating a branch is shown below:

```
git checkout -b c-someContent develop
```

[centrepo]: https://github.com/beingbrown/habit
[nviegitflow]: http://nvie.com/posts/a-successful-git-branching-model/

## Committing

Make sure that each commit only contains one change. It's a lot less annoying to
have to sift through 20 commits each with 1 different change than 1 commit with
20 different changes. If the change is difficult to summarize in one line, then
you should probably split up the commit with `git add -p`.

When in doubt, follow the
[Erlang OTP Git Commit Guide](https://github.com/erlang/otp/wiki/Writing-good-commit-messages).

## Preparing for and Making a Pull Request

Once you have made all your changes, you want to get them merged into the
central repo. Here is the process:

1) After your last commit on your branch, switch back to develop and sync with upstream

```
git checkout develop
git fetch upstream
git merge upstream/develop
```

2) Merge your branch with develop using --no-ff

```
git merge c-someContent --no-ff
```

3) Resolve any merge conflicts

If you have merge conflicts, you should resolve them. This should guarantee that you do not have merge conflicts when you submit your pull request.

4) Push to your github cloned repo

```
git push origin develop
```

Please note that in order to do this, you will need to ensure your origin remote looks something like the following:

```
git remote origin -v
origin  git@github.com:yourUserName/habit (fetch)
origin  git@github.com:yourUserName/habit (push)
```

5) Submit a pull request

If I cannot look into the branch history, I may ask you to amend your commit to --no-ff and resubmit.

If I cannot automatically merge your pull request because it contains merge conflicts, I will ask you to fix them and resubmit.

Feel free to follow the general rule of pushing early and often.
