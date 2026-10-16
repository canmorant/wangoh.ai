import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, renameSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

test("Vercel skips mobile, API and documentation changes but builds every website, shared package, root config and dependency change since the last deployment", () => {
  const repo = mkdtempSync(join(tmpdir(), "wangoh-ignore-build-"));
  const script = fileURLToPath(new URL("./vercel-ignore-build.mjs", import.meta.url));
  const git = (...args) => execFileSync("git", args, { cwd: repo, encoding: "utf8" }).trim();
  const write = (path, text) => {
    mkdirSync(dirname(join(repo, path)), { recursive: true });
    writeFileSync(join(repo, path), text);
  };
  const commit = () => {
    git("add", ".");
    git("commit", "-qm", "fixture");
    return git("rev-parse", "HEAD");
  };
  const decision = (previous, current) => spawnSync(process.execPath, [script], {
    cwd: repo,
    env: { ...process.env, VERCEL_GIT_PREVIOUS_SHA: previous, VERCEL_GIT_COMMIT_SHA: current },
  }).status;
  try {
    git("init", "-q");
    git("config", "user.email", "fixture@example.com");
    git("config", "user.name", "Fixture");
    write("apps/web/src/page.tsx", "initial");
    write("apps/mobile/App.tsx", "mobile");
    const base = commit();
    write("README.md", "docs");
    write("apps/mobile/App.tsx", "mobile update");
    write("apps/web/docs/notes.md", "docs inside the web app");
    write("apps/web/AGENTS.md", "agent notes");
    const documentation = commit();
    assert.equal(decision(base, documentation), 0, "mobile and documentation only");

    let previousCommit = documentation;
    for (const rootFile of ["package.json", "package-lock.json", "pnpm-lock.yaml", "pnpm-workspace.yaml", "turbo.json"]) {
      write(rootFile, rootFile);
      const rootChange = commit();
      assert.equal(decision(previousCommit, rootChange), 1, `${rootFile} affects the website build`);
      previousCommit = rootChange;
    }
    write("apps/mobile/package.json", "mobile dependency");
    const mobileManifest = commit();
    assert.equal(decision(previousCommit, mobileManifest), 0, "apps/mobile alone does not affect the website");

    write("apps/api/src/main.ts", "api server");
    write("apps/api/openapi.json", "{}");
    write("apps/api/drizzle/0000_init.sql", "create table t ();");
    write("apps/api/package.json", "api dependency");
    const apiOnly = commit();
    assert.equal(decision(mobileManifest, apiOnly), 0, "apps/api alone does not affect the website");

    write("apps/api/src/app.module.ts", "api module");
    write("apps/mobile/app/index.tsx", "mobile screen");
    write("docs/backend-mobil-mimarisi.md", "docs");
    const apiMobileDocs = commit();
    assert.equal(decision(apiOnly, apiMobileDocs), 0, "api, mobile and documentation together still skip");

    write("apps/api/src/users.ts", "api");
    write("apps/web/src/lib/api/ApiProvider.tsx", "website wiring");
    const apiAndWebsite = commit();
    assert.equal(decision(apiMobileDocs, apiAndWebsite), 1, "a website file next to API changes still builds");

    write("packages/api-client/src/mutator.ts", "shared client");
    const clientSource = commit();
    assert.equal(decision(apiAndWebsite, clientSource), 1, "packages/* is compiled into the website");
    write("packages/api-client/package.json", "client manifest");
    const clientManifest = commit();
    assert.equal(decision(clientSource, clientManifest), 1, "a packages/* manifest affects the website install");

    write("apps/api/src/later.ts", "api only again");
    const apiAfterPackages = commit();
    assert.equal(decision(clientManifest, apiAfterPackages), 0);
    assert.equal(decision(apiAndWebsite, apiAfterPackages), 1, "an earlier unpublished packages change must still trigger a build");

    write("apps/web/src/page.tsx", "website update");
    const website = commit();
    assert.equal(decision(base, website), 1);
    write("reports/audit.md", "another docs change");
    const latest = commit();
    assert.equal(decision(base, latest), 1, "an earlier unpublished web change must still trigger a build");
    assert.equal(decision(website, latest), 0);

    renameSync(join(repo, "apps/web/src/page.tsx"), join(repo, "reports/page.tsx"));
    const renamed = commit();
    assert.equal(decision(latest, renamed), 1, "moving a website file into an ignored folder changes the website");
    assert.equal(decision("", renamed), 1);
    assert.equal(decision("0000000000000000000000000000000000000000", renamed), 1);
    write("apps/web/messages/es.json", "{}");
    const messages = commit();
    assert.equal(decision(renamed, messages), 1);
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});
