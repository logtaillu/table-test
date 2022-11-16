both
2. selectRange,，包含行列选择功能
3. 合并/拆分单元格
4.  行列（插入/删除）
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
7. 粗体/斜体/下划线-both
1. border


样式添加位置：
2. theme.less 默认值+值使用
4. getDefaultConfig 添加默认值
5. locale translate

关于边框：
1. 边框持有
a. 普通单元格只有右&下
b. 左侧(col=0)持有左
c. 顶部row=0有上
d. 表头底部type=header&row=0，在只有header的时候才展示，但是当作2个边框设置
css控制只展示一个
变量：
type 类型=>哪些边是0哪些边有宽度
style 样式
width 有宽度的情况下，宽度
color 颜色
先做global/body/header的border设置
global body/header cell
global 和body/header的关系=>虽然范围不同，直接覆盖

遗留问题：
没有改动的动作触发

目录结构：
table table组件
stories 文档
styles 样式
driver 控制器
toolbars 工具栏
locales 语言
utils 辅助函数
plugins 功能部件
components 其他输入控件等
interfaces 接口定义
name=evtable

colgroup
thead-trow-th
tbody-trow-td
column/data 和content的优先级问题
1. content作为修改过程存储，更加优先
2. column/data内容不去变更
a.有1个initContent，和一个content
b.个别量做init
column/data如果有什么关联量，反映到initContent
