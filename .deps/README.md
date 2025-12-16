# Next.js 16 and React 19 Upgrade

This directory contains the nextjs-adapter package built from the branch:
`https://github.com/enonic/npm-nextjs-adapter/tree/copilot/upgrade-react-components-next-16`

## Why is this needed?

The nextjs-adapter has a nested file: dependency for `@enonic/react-components` that npm 
cannot properly resolve when installing directly from GitHub. To work around this:

1. The adapter was built and packaged into `enonic-nextjs-adapter-0.0.0.tgz`
2. This tarball is checked into the repository in the `.deps` directory
3. A setup script extracts it before npm install

## Installation

After cloning this repository, run:

```bash
./scripts/setup-adapter.sh
```

Or manually:

```bash
mkdir -p node_modules/@enonic/nextjs-adapter
tar -xzf .deps/enonic-nextjs-adapter-0.0.0.tgz -C node_modules/@enonic/nextjs-adapter --strip-components=1
npm install
```

## Future

Once the nextjs-adapter branch is merged and published to npm, this workaround 
can be removed by:

1. Removing the `.deps` directory
2. Removing the `scripts/setup-adapter.sh` script
3. Updating `package.json` to use the published version:
   ```json
   "@enonic/nextjs-adapter": "^4.0.0"
   ```
4. Running `npm install` normally

The temporary local file dependency approach was chosen because npm cannot properly 
handle nested file: dependencies when installing directly from GitHub branches.
