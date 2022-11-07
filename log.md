每个功能考虑service、keyevents和toolbar、说明、dataComponents后面说
***
5. selectRange，包含行列选择功能-both
6. 合并/拆分单元格-excel
***
7. 边框线[颜色/样式/线宽/有框范围]-both
8. 行列（插入/删除）-excel
***
9. drag/drop-excel
10. sort-data
**
11. search-data
12. 勾选-data
***
13. 序号-data
14. pagination-data,先不考虑分页请求，只接收数据
**
15.scrollFixTable功能-data
16.冻结列-data
**
17. 直接填写 - both
18. 数据展示格式设置 - 共同，数据表以列为单位，自定义表选中范围为单行

已完成：
1. body/header/all select toolbar-data
1. 样式组件确定并调整 ok
3. redo/undo-both ok
4. 给与行号和列头-excel ok
2. 行高/列宽调整/高度自适应-both
5. 字体/字号/颜色-both
6. 文字对齐text align/vertical align-both


样式添加位置：
2. theme.less 默认值+值使用
4. getDefaultConfig 添加默认值
5. locale translate