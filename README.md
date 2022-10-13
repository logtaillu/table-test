# table-test
表格demo
基于rc-table扩展表格功能
table + services集合=>功能table

自定义表针对选中范围(没有则全部),cell维度
数据表区分表头和内容,header,body
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

1. 缓存tableCache
2. 工具栏-toolbars
3. 功能services-actions/props handle
/components 组件列表
/toolbars 工具栏组件，订阅存储结构的内容
/tableDriver 配置交互存储结构
包含配置内容和操作栈
/services 功能
/locales 本地化
/utils 辅助函数
/hooks 辅助hooks
