import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const noCrossModuleDeepImports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Imports to other modules must go through the barrel index (index.ts) as a public interface, not a direct subfolder.",
    },
    messages: {
      deepImport:
        "Import between modules must go through their barrel index: " +
        "`@/modules/{{importedModule}}`. " +
        "Make sure what you want to import is exported from the index.ts file of that module.",
    },
    schema: [],
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;

        // Cek apakah import menuju subfolder module: @/modules/<X>/<...>
        const importMatch = importPath.match(/^@\/modules\/([^/]+)\/.+/);
        if (!importMatch) return;

        const importedModule = importMatch[1];

        // Dapatkan nama module dari file yang sedang diproses
        const currentFile = context.filename ?? context.getFilename();
        const normalizedFile = currentFile.replace(/\\/g, "/");
        const currentModuleMatch = normalizedFile.match(
          /\/src\/modules\/([^/]+)\//
        );
        const currentModule = currentModuleMatch?.[1];

        // Jika file berada di module yang SAMA → boleh (internal import)
        if (currentModule === importedModule) return;

        context.report({
          node,
          messageId: "deepImport",
          data: { importedModule },
        });
      },
    };
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    plugins: {
      local: {
        rules: {
          "no-cross-module-deep-imports": noCrossModuleDeepImports,
        },
      },
    },
    rules: {
      "local/no-cross-module-deep-imports": "error",
    },
  },
]);

export default eslintConfig;
