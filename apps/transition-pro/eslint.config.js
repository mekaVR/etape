import { config as reactConfig } from "@etape/eslint-config/react-internal";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([globalIgnores(["dist"]), ...reactConfig]);
