1. npm create vite@latest 初始化项目
2. 提交格式化 
全局安装commitizen 
yarn add @commitlint/cli @commitlint/config-conventional cz-git --dev
添加.commitlintrc.cjs
3. 提交格式检测 
yarn add husky --dev
npx husky init & yarn
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
4. storybook
npx storybook init
5. install release-it @release-it/conventional-changelog，添加.release-it.json
6. add father for build
7. 其他调整