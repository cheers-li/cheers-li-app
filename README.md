# cheers.li

## Installation

### Requirements

- Node >= 14
- PNPM
- IOS or Android development tools, see [here](https://capacitorjs.com/docs/getting-started/environment-setup) for more info.

```bash
git clone https://github.com/cheers-li/cheers-li-app
cd https://github.com/cheers-li/cheers-li-app
pnpm install # npm i -g pnpm (if you don't have it)
cp .env .env.local # See below for more info
pnpm dev
```

### Env values

Here are some explanation about the different values you need to set in your `.env.local` file:

- **VITE_SUPABASE_URL**: On [app.supabase.com](https://app.supabase.com/), go to your project -> Settings tab -> API and copy the **Project URL**
- **VITE_SUPABASE_KEY**: On [app.supabase.com](https://app.supabase.com/), go to your project -> Settings tab -> API and copy the **public** one in your **Project API keys**
- **VITE_MAPBOX_TOKEN**: On [mapbox.com](https://mapbox.com/), go to your account -> Tokens -> Create a token

## Native app

Everytime you change the code, you have to run these commands to update the app:

```bash
pnpm build
pnpm cap sync
pnpm cap run ios/android # choose one of them
```

If you want to go faster, you can just run this helper, it will do the same as the commands above:

```bash
pnpm deploy:ios # or deploy:android
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
