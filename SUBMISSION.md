# How a week actually works

One week = one branch = one pull request. That is the whole "submission package".

**Always read the current version here:** https://adexsimply.github.io/craftudy-sde-plan/submission.html
(This file is a snapshot from the day you created your repo. The web version is the live one.)

---

## First, what a pull request actually is

You already know: clone, branch, commit, push, merge.

A pull request is the **merge**, with a pause in it.

Normally you would finish `week-1` and merge it into `main` yourself, alone, and nobody ever
sees the work. Instead you push `week-1` to GitHub and say "I would like to merge this into
main". GitHub holds the merge open. People read the code, ask questions, leave comments on
specific lines. When it is approved, the merge happens.

Same merge. Same two branches. The only new thing is that it happens in the open, and someone
looks before the button is pressed. That is the entire idea, and it is how every team you will
ever join ships code.

So: nothing new to learn. You already have the skills. You are just merging in public.

## Access: does Shina need to be added?

Your repo is public, so he can already read everything and comment on any pull request without
being added. But **add him and each other as collaborators anyway** so that review requests and
notifications work properly:

Repo → **Settings** → **Collaborators** → **Add people** →
add `adexsimply` and your peer (`RotimiJude` or `Ayemo-AndrewGold`) → role **Write**.

Do that once, now. You never touch it again.

---

If you only read one thing, read this: **you push every day, not once a week.** The log for
today must be on GitHub tonight. A folder full of logs pushed on Sunday counts as one day,
and the bot will have opened an issue every night in between.

---

## Monday: start the week's branch

The branch is named `week-1`, `week-2`, and so on. **With the hyphen.** It is a small thing, but
three repos reviewed side by side are much easier to read when they are laid out identically.

```bash
git checkout main
git pull
git checkout -b week-1
```

Named it wrong already? Rename it, do not start over:

```bash
git branch -m week1 week-1
git push origin -u week-1
git push origin --delete week1
```

You now work on `week-1` all week. `main` stays as it was until the PR is merged.

## Every day: work, log, push

Do the hour. Then write today's log and push it:

```bash
# ... you did the work, files are changed ...
cp logs/TEMPLATE.md logs/2026-09-15.md     # today's date
# fill in the 5 lines
git add -A
git commit -m "day 1: ssh keys working, started backup.sh"
git push
```

Three sentences and twenty focused minutes is a valid day. A day with no push is a missed day,
and at 23:30 the bot opens an issue saying so. Close the issue by pushing the log.

## Sunday, before 9pm: open the pull request

```bash
git push
gh pr create --base main --head week-1 --title "Week 1"
```

Or press the green "Compare & pull request" button GitHub shows you.

A form appears already filled with headings. Complete it. That filled-in form **is** the
submission package. Nothing is emailed, nothing is uploaded anywhere else.

### What a finished one looks like

> ## Week 1 submission
>
> **What runs:** `bash backup.sh ~/projects` creates `backup-2026-09-20.tar.gz` and skips
> `node_modules`. Tested on a fresh Ubuntu VM.
>
> **Done-when line met?** yes
>
> **DSA:** 3/3 · Two Sum 25 min · Best Time to Buy and Sell Stock 40 min (needed a hint on the
> running-minimum idea) · Contains Duplicate 10 min
>
> **What I'd do differently:** I fought the tar flags for an hour before reading `man tar`.
> Next time I read the manual first.
>
> **Where I need review most:** the error handling in `backup.sh` when the folder does not
> exist. I am not sure my exit codes are right.
>
> ## Checklist
> - [x] 7 daily logs in `logs/`
> - [x] No secrets committed
> - [x] README updated if setup changed
> - [x] A peer has reviewed this before mentor review

Honest beats impressive. "Done-when met? partly" with a clear reason is a good submission.
A vague "everything works" is not.

## Monday: review each other

Open the other person's PR, read the code, leave **at least two real comments**. A real comment
asks or points at something specific:

- "Why `chmod 777` here? Would 755 work?"
- "This breaks if the folder name has a space in it, try it."

"Nice work 👍" is not a review.

## By Wednesday: Shina reviews

He approves, or requests changes. If he requests changes, push fixes to the same branch, the
PR updates itself. Once approved, merge it, and start the next branch from `main`.

---

## The fortnightly call

Sundays at 8pm, every second week: 27 Sep, 11 Oct, 25 Oct, 8 Nov, 22 Nov, 6 Dec. Sixty minutes.
You demo what runs, ask what you could not solve in writing, and hear what the next fortnight is.

The call is **not** where work gets submitted or checked. That happens in the PR, weekly, whether
or not a call is happening. On the six weeks with no call, nothing changes: branch, push daily,
PR by Sunday 9pm.

The call holds even if only one person shows up.


## Where the DSA solutions go

In `dsa/`. **One file per problem, not one file per week**, and not buried in the daily log.

```
dsa/two-sum.md
dsa/contains-duplicate.md
dsa/best-time-to-buy-and-sell-stock.md
```

Each file has three parts, in this order:

```markdown
# Two Sum

Given an array of numbers and a target, return the indices of the two
numbers that add up to the target.

## Approach

Walk the array once. For each number, work out what its partner would
have to be (target minus this number) and check whether we have already
seen that partner. If we have, we are done. If not, remember this number
and where it was.

## Code

​```js
function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const needed = target - nums[i];
    if (seen.has(needed)) return [seen.get(needed), i];
    seen.set(nums[i], i);
  }
}
​```

## Complexity

O(n) time, because we touch each number once.
O(n) space, because the Map can grow to the size of the input.

Brute force would be O(n²) time and O(1) space. The Map buys time with space.
```

**The approach goes first, in plain English, before any code.** If you cannot say what
you are going to do in three sentences, you are not ready to type. That section is the
part being marked, not the code.

**Why a folder and not the log.** The log is a diary — it is ordered by date and you will
never read it again. `dsa/` is a reference. By the end of the cycle it holds three dozen
problems, each with the approach that worked and the trade-off you made. That folder is
what you revise from the night before an interview. The log cannot do that job.

Still mention the problem in the day's log, one line, with how long it took. Then the
solution itself lives in `dsa/`.

## If you use GitHub Desktop

Everything above in buttons instead of commands.

**Monday, start the week's branch**
1. `Current Branch` dropdown → **New Branch** → name it `week-1` → **Create Branch**.
2. Click **Publish branch** so it exists on GitHub too.

**Every day**
1. Do the work. Create `logs/2026-09-15.md` in your editor and fill it in.
2. GitHub Desktop shows the changed files under **Changes**.
3. Type a short summary at the bottom left, e.g. `day 1: ssh keys working`.
4. Click **Commit to week-1**.
5. Click **Push origin**. This is the step people forget. Nothing is on GitHub until you push.

**Sunday, open the pull request**
1. Push your last commit.
2. Click **Preview Pull Request** (or menu **Branch → Create Pull Request**). Your browser opens.
3. Check it says `base: main ← compare: week-1`.
4. The description box is already filled with the headings. Complete them.
5. Click **Create pull request**. You are done, that is the submission.

**After it is approved**
1. On the website, click **Merge pull request**.
2. Back in GitHub Desktop: `Current Branch` → `main` → **Fetch/Pull origin**.
3. New week, new branch from `main`.


## On AI, and how we check you actually learned it

Use AI. Seriously. You will use it for the rest of your career and pretending otherwise is
training for a job that no longer exists. It is listed as a resource in the plan.

There is exactly one rule: **you must be able to explain every line you ship.**

That is not a slogan, it is checked. Three ways, and none of them are a gotcha:

**1. You declare it.** The PR asks where AI helped you this week. Answer honestly and specifically.
Nobody is marked down for using it. The only thing that breaks the rule is hiding it, because then
nobody can tell which parts you actually hold.

**2. The five-minute walkthrough.** At each fortnightly call, one file is picked from your pull
request and you talk through it line by line. Why this and not that. What breaks if you delete
this line. Where it fails. Five minutes. Nothing survives this if you did not understand what you
shipped, and everything survives it if you did, no matter who typed it first.

**3. Change it live.** Sometimes you will be asked to make a small modification on the call. Make
it handle an empty folder. Make it exit non-zero on failure. Two minutes. Understanding shows up
instantly here.

We also look at *how* the work arrived. A week that lands in one commit on Sunday night gets
questions, not because a big commit is cheating, but because that is not what learning looks like
from the outside. Steady daily pushes make this a non-issue, which is why the daily log exists.

None of this is about catching you. If you can explain it and change it, it is yours. If you can
not, then whatever produced it, you did not learn anything this week, and that is the only failure
this programme actually cares about.

## Quick answers

**Do I push once a week?** No. Daily. The bot checks nightly.

**Can I commit straight to `main`?** No. Then there is nothing to open a PR from.

**I missed Tuesday.** Log Wednesday and carry on. Two missed *weekly deliverables* pauses you,
one missed daily log does not.

**Finished early?** Open the PR early. Reviews can start sooner.

**Stuck more than 45 minutes?** Write it on the **Blocked on** line in that day's log. That line is
pulled out automatically and shown to Shina, so writing it there is how you ask for help without
having to chase anyone. Put "nothing" when you are not stuck. AI first, then your peer, then Shina.

**We have never used PRs before.** You have merged before. This is a merge with a review pause.
Nothing else is different.

**Do we add Shina as a collaborator?** The repo is public so he can see it regardless, but yes,
add him and each other with Write access. See the access section above.

**Where does the review conversation happen?** On the pull request page itself, on the
"Files changed" tab. Click a line number to comment on that exact line.

**Am I allowed to use AI?** Yes. See the section above. Declare it, and be able to explain and
change what you ship.

**Where do DSA solutions go?** `dsa/`, one file per problem, approach in plain English before
the code. See the section above.
