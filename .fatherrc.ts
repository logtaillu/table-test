import { defineConfig } from "father";
export default defineConfig({
    esm: {
        ignores:["src/stories/**/*"]
    },
    prebundle: {}
})