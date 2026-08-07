# R2 Public Asset URLs on Vercel

## Bug

Event resources and images worked locally, but failed on Vercel with 404s. For example, the
Authority PDF should load from R2:

```text
https://pub-51349ba358244889889234b209966c9a.r2.dev/events/20261016/Authority.pdf
```

Instead, the deployed site rendered an app-relative URL:

```text
/events/20261016/Authority.pdf
```

The browser resolved that relative URL against the production domain:

```text
https://www.saima.com.au/events/20261016/Authority.pdf
```

Vercel then served the request as an app route/static asset request and returned 404.

## Root Cause

`VITE_R2_PUBLIC_BASE_URL` was configured in Vercel, but it was missing from `turbo.json`.
Because the Vercel build runs through Turbo, the variable was not passed through to the web build.

At build time, `import.meta.env.VITE_R2_PUBLIC_BASE_URL` became `undefined`, so event asset URLs
were generated without the R2 origin.

## Fix

Add `VITE_R2_PUBLIC_BASE_URL` to `globalPassThroughEnv` in `turbo.json`:

```json
{
  "globalPassThroughEnv": [
    "VITE_R2_PUBLIC_BASE_URL"
  ]
}
```

Keep the variable configured in the Vercel web project:

```text
VITE_R2_PUBLIC_BASE_URL=https://pub-51349ba358244889889234b209966c9a.r2.dev
```

After changing either Vercel env vars or `turbo.json`, redeploy. Vite reads this value at build
time, so existing deployments do not update until rebuilt.

## Verification

- The built site should render event resource links with the R2 origin.
- `import.meta.env.VITE_R2_PUBLIC_BASE_URL` should not be `undefined` during the web build.
- Opening the Authority PDF should request the R2 host, not `www.saima.com.au`.
