import { defineConfig, Schema } from '@julr/vite-plugin-validate-env';

export default defineConfig({
  VITE_SUPABASE_URL: Schema.string(),
  VITE_SUPABASE_KEY: Schema.string(),
  VITE_SUPABASE_FUNCTIONS_URL: Schema.string(),
  VITE_MAPBOX_TOKEN: Schema.string(),
  VITE_ENVIRONMENT: Schema.string(),
});
