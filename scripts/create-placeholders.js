/**
 * 创建占位符图片脚本
 * 使用 Canvas API 生成占位符图片
 * 
 * 运行方式：
 * node scripts/create-placeholders.js
 */

const fs = require('fs');
const path = require('path');

// 创建目录结构
const directories = [
  'public/images/hero',
  'public/images/about',
  'public/images/career',
  'public/images/matches',
  'public/images/highlights',
  'public/images/medals',
];

directories.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`创建目录: ${dir}`);
  }
});

// 创建占位符说明文件
const placeholderInfo = `
# 占位符图片说明

这些目录已创建，请将真实图片放入对应目录：

- public/images/hero/ - 首页背景图片
- public/images/about/ - 关于页面图片
- public/images/career/ - 职业生涯图片
- public/images/matches/ - 比赛图片
- public/images/highlights/ - 精彩瞬间
- public/images/medals/ - 奖牌图片

## 图片命名规范

请按照数据文件中的路径命名图片，例如：
- career/2015.jpg
- matches/match1.jpg
- highlights/highlight1.jpg

当前组件会显示占位符，替换为真实图片后会自动显示。
`;

fs.writeFileSync(
  path.join(process.cwd(), 'public/images/PLACEHOLDER_INFO.md'),
  placeholderInfo
);

console.log('\n✅ 目录结构创建完成！');
console.log('请将真实图片放入对应目录。\n');
