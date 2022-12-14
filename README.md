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
- **VITE_SUPABASE_FUNCTIONS_URL**: On [app.supabase.com](https://app.supabase.com/), go to your project -> Settings tab -> API and copy the **Reference ID** and add it to the base setting https://<PROJECT_ID>.functions.supabase.co
- **VITE_MAPBOX_TOKEN**: On [mapbox.com](https://mapbox.com/), go to your account -> Tokens -> Create a token
- **VITE_ENVIRONMENT**: `Development` for all the dev environments and `Production` for the releases.

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

### Live Reload

To enable live reload in the Native App, follow these instructions:

Before starting, you need your phone and your computer connected to the same network.

Start the app in development mode with the `--host` flag to expose it:

```bash
pnpm dev --host
```

Remember your URL, it should be something like `http://192.168.11.3:5173`

Now, sync the native app (replace the value of the URL with yours):

```bash
SERVER_URL=http://192.168.11.3:5173 pnpm cap sync
```

To finish, open the native IDE, and press the Run button to launch the app.

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
