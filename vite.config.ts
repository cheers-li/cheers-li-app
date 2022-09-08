import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Pages from 'vite-plugin-pages';
import tsconfigPaths from 'vite-tsconfig-paths';
import { ValidateEnv } from '@julr/vite-plugin-validate-env';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), Pages(), tsconfigPaths(), ValidateEnv()],
});
