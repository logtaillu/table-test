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


0. 框架搭建
1. toolbars展示-共同
2. redo/undo-共同
3. 行高/列宽调整/高度自适应-共同
4. 字体/字号/颜色-共同
5. 边框线[颜色/样式/线宽/有框范围]-共同
6. 文字对齐text align-共同
7. 合并/拆分单元格-自定义表
8. 隐藏表头，给与行号和列头，提供行列选择功能-自定义表
9. 行列（插入/删除）-自定义表
10. 列排序 - 数据表
11. 列搜索 - 数据表
12. 勾选 - 数据表
13. 序号 - 数据表
14. 分页与分页请求 - 数据表，先不考虑分页请求，只接收数据
15. scrollFixTable功能 - 数据表
16. 固定列 - 数据表
17. 直接填写 - 共同
18. 数据展示格式设置 - 共同，数据表以列为单位，自定义表选中范围为单行
19. 拖拽接收=》还是从datasource取值的