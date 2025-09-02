import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginVitest from '@vitest/eslint-plugin'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

// --- 新增：导入 import 插件 ---
import pluginImport from 'eslint-plugin-import'
// ------------------------------

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  // --- 新增：添加 import 插件配置，用于解析路径别名 ---
  {
    name: 'app/import-alias-resolver',
    plugins: {
      import: pluginImport,
    },
    settings: {
      'import/resolver': {
        // 开启 typescript 路径解析
        // 它会自动查找并使用 jsconfig.json 或 tsconfig.json 中定义的 paths
        typescript: true,
        node: true,
      },
    },
  },
  // ----------------------------------------------------

  {
    rules: {
      // 关闭 <script> 标签必须有 lang 属性的规则
      'vue/block-lang': 'off',

      // 如果未来还需要添加其他规则，可以写在这里，例如：
      // 'no-console': 'warn', // 对 console.log 提出警告
    },
  },
  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },
  skipFormatting,
)
