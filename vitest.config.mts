import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [tsconfigPaths()], // tsconfigPaths allows vitest to work with typescript
    test: {
        environment: 'jsdom', // uses jsdom to simulate a browser enviroment for the tests
        exclude: ['**/node_modules/**', '**/test/**', 'playwright-report/**', 'test-results/**'],
        deps: {
            inline: ['wagmi', '@wagmi/core'] // bundles and copy pastes the repositories into the code not important unless we decide to add them to our tests 
        }
    },

})