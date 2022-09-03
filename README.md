# cheers.li

## Installation

### Requirements
* Node >= 14
* PNPM
* IOS or Android development tools, see [here](https://capacitorjs.com/docs/getting-started/environment-setup) for more info.

### React app
```bash
git clone https://github.com/cheers-li/cheers-li-app
cd https://github.com/cheers-li/cheers-li-app
pnpm install # npm i -g pnpm (if you don't have it)
pnpm dev
```

### Native app

First, you can start the vite development server:

```bash
pnpm dev
```

You also can just build the code with the following command: ```pnpm build``` if you don't want to listen to changes.

Everytime you change the code, you have to run these commands to update the app:

```bash
pnpm build
pnpm cap sync
pnpm cap run ios/android # choose one of them
```

If you want to open the project in the native IDE (Xcode or Android Studio), you can run:

```bash
pnpm cap open ios/android # choose one of them
```

## Code style

We are using ESLint and Prettier to lint and format the code. An husky pre-commit hook is also configured to run the linter and the formatter before each commit on the staged files.

If you want to lint the entire codebase manually, you can run the following command:

```bash
pnpm lint
```

And If you want to fix the whole codebase code style, you can run:

```bash
pnpm format
```
