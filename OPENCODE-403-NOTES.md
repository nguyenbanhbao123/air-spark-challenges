# OpenCode + ASU AIR: the `Forbidden` trap

Field notes from losing about two hours to this on Sept 4. Read before you start coding
against the ASU model API. — Lucian

**Keep this file outside the project folder**, same as `ARCHITECTURE-NOTES.md`.

> **This file is safe to feed to your AI assistant.** Every trigger string below is
> deliberately broken with a `·` so that reading this document does not itself get you
> blocked. Wherever you see `·`, there is nothing in the real string. Same for `[BT]`,
> which stands for a single backtick.

---

## The one-line version

> There is no list of forbidden **actions**. There is a list of forbidden **strings**.
> If certain text appears anywhere in your conversation, the request dies at ASU's
> firewall and never reaches the model.

The error you see is:

```
Forbidden: request was blocked by a gateway or proxy.
You may not have permission to access this resource — check your account and provider settings.
```

That message is misleading. Your account is fine. Your API key is fine. Your network is fine.

---

## Why it happens

The ASU endpoint sits behind Cloudflare, and ASU left the standard "protect a website from
hackers" managed rules switched on. Those rules scan the body of every request. A coding
agent's request body contains your code, your files, and your tool output — so it routinely
looks like an attack to a rule that was written for web forms.

The block happens **at Cloudflare, before ASU's own gateway**. Proof: a successful response
carries `x-litellm-*` headers, a blocked one carries none at all. The model never saw it.

---

## What gets you blocked

Five things. Verified by testing, not guessed.

| String appearing anywhere in the conversation | Result |
|---|---|
| `<·script` — opening tag, closing tag, or with a `src=` attribute | **403** |
| An inline code span (single backticks) wrapping a fetch command **plus a target** | **403** |
| ↳ `[BT]curl -s https://…[BT]` | **403** |
| ↳ `[BT]wget https://…[BT]` | **403** |
| ↳ `[BT]nslookup some.domain[BT]` | **403** |
| `/etc/·passwd`, `/etc/·hosts`, `/proc/self/·environ` | **403** |
| `${j·ndi:ldap://…}` | **403** |

### What does NOT get you blocked

All of these were tested and returned 200. Do not waste time avoiding them:

- `rm -rf`, `chmod 777`, and even curl piped into bash, as long as it is not inside a
  single-backtick code span
- Backticks around anything that is not a network fetch: `ls -la`, `git status`,
  `npm install`, `node index.js`, `docker run nginx`, `ssh user@host`
- `git clone https://github.com/…` — even inside backticks. git is not on the list.
- SQL injection strings, `<iframe`, `<?php`, `eval(`, `document.cookie`, `onerror=`
- `../../../../` at any depth, `..%2f`, `%00`
- React JSX like `<Button onClick={…}>` — only the script tag is special
- 120 KB payloads, streaming, function calling, images

The rule is narrow. Five patterns out of the forty-odd we tried. But two of them are
things we type every day.

---

## The part that actually costs you time

**One 403 destroys the whole conversation. Permanently.**

1. Something in your request trips a rule.
2. Cloudflare replies with an HTML error page.
3. That page is an ASU-branded web page — and it contains script tags
   (Google Tag Manager, Cloudflare's own challenge snippet).
4. OpenCode stores the page in the session as if it were normal content.
5. Every retry now ships that page along with your history, hits the same rule, fails again.

One session logged **17 consecutive** `Forbidden` errors this way. Retrying can never work.
The conversation is dead — the only exit is a new session.

---

## Git and GitHub are fine

This is the question everyone asks first. Tested:

| | |
|---|---|
| `git clone` / `checkout -b` / `push` | 200 |
| `git commit -m "…"` | 200 |
| `git status`, `git log` output | 200 |
| `gh pr create --title … --body …` | 200 |
| `git diff` on a `.ts` / `.tsx` file | 200 |
| **`git diff` on a `.html` file** | **403** — the diff prints a script tag |

The operation is never the problem. What the operation *prints into the conversation* is.

---

## Rules for this project

We are building an Electron app, so `.html` files are unavoidable and every one of them
contains a script tag. Three habits:

1. **Never let OpenCode read, write, or diff an `.html` file.**
   `src/ui/index.html` and `src/capture/overlay.html` are permanent landmines. Edit them by
   hand, or ask the agent to tell you which lines to change rather than touching the file.
   Tell the agent this up front, in the first message of the session.

2. **Writing docs: no single-backtick network commands.**

   ```
   Bad     [BT]nslookup openai.rc.asu.edu[BT]        inline span + fetch command + target
   Fine    nslookup openai.rc.asu.edu                same text, no inline span
   Fine    a fenced block containing the same line
   ```

   This is not hypothetical. Line 674 of `ARCHITECTURE-NOTES.md` had a backticked nslookup
   command in it, and it blocked every agent that read the file — including the one trying
   to fix the very problem that line documents. Already fixed.

3. **The moment you see `Forbidden`, stop.**
   Do not retry. Do this instead:
   - Run `git status` **first**. The 403 almost always lands *after* the files were written
     and *before* the commit, so your work is usually all on disk. Check before you panic.
   - Find and remove the trigger, or the new session will hit it too.
   - Open a brand new session. Not a new window — a new session.

---

## Two other things worth knowing

**Campus wifi breaks the API in a different way.** On the `asu` SSID, ASU's DNS answers the
API hostname with an internal `10.139.64.x` address that the wireless VLAN cannot route, and
every call times out after ten seconds. Set your DNS to 1.1.1.1 / 8.8.8.8 and it resolves to
Cloudflare instead. The API gateway itself is public — VPN is only needed once, to collect
your key from Voyager.

**OpenCode desktop caches the model list at launch.** If a model you added does not appear,
fully quit the app — task manager, all processes — and reopen.

---

## Please report it

This is an ASU misconfiguration, not something we can engineer around. Every team doing
anything web-related will hit it. File at <https://rto.asu.edu/request-help/>:

> The Cloudflare WAF on the ASU AIR API hostname is blocking legitimate API requests that
> contain code. A script tag, a system file path, or a backtick-wrapped network command
> returns 403 with an HTML error page instead of a JSON API error. This makes coding agents
> unusable. Please disable the XSS / LFI / RCE managed rules for this API hostname.
>
> Blocked CF-Ray IDs: a358264f4994598b-PHX, a3582655efe4c490-PHX, a3582664e9071937-PHX

The Ray IDs are how they find the block in their logs — always include them.
