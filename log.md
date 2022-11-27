task list
2. excel sider - excel
3. 行列选择 - excel
4. 行列插入/删除 - both-excel可以在中间插入
问题：改变了row/col count时，合并单元格处理
***
6. drag/drop-excel

***
7. sort-data
8. search-data
9. 勾选-data
***
10. 序号-data
11. pagination-data,先不考虑分页请求，只接收数据
12. scrollFixTable功能-data
13. 冻结列-data
***
14. 直接填写 - both
15. 数据展示格式设置 - 共同，数据表以列为单位，自定义表选中范围为单行
日期/图片/选择/颜色/文本/数字/check/switch
类型/类型渲染/
=>选择框->选项列表
=>日期、数字-格式
***
1. props功能选项构建
2. 刷新测试/日志补充
3. 修正样式问题/组件
4. storybook
5. 右键操作

select/tooltip/dropdown/pagination/input-number/date-picker
已完成：
1. body/header/all select toolbar-data
1. 样式组件确定并调整 ok
3. redo/undo-both ok
4. 给与行号和列头-excel ok
2. 行高/列宽调整/高度自适应-both
5. 字体/字号/颜色-both
6. 文字对齐text align/vertical align-both
7. 粗体/斜体/下划线-both
8. border
9. 合并单元格
10. 范围选择
1. row/col补充 - ok
2. 内间距 - ok


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

行列插入及excel sider及data/content/column改变
1. data/content/column改变
任一改变重置
2. 行号/列号改造
    colkey/rowkey: [keyvalue,keyvalue]，对插入方便
    列插入：增加一个colkey，然后columns里也要塞进取
    行插入：增加一个rowkey
    行删除/列删除：删除key并移除配置，处理selected/merged范围
3. cell有extra类型，在非editable时是没有的
4. 刷新监测
5. 输入组件显示[tooltip/input-number]