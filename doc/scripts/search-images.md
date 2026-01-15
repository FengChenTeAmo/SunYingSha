# 图片搜索脚本和工具

## 使用 Python 搜索图片（示例）

### 安装依赖
```bash
pip install requests beautifulsoup4 pillow
```

### 搜索脚本示例
```python
import requests
from bs4 import BeautifulSoup
import os
from pathlib import Path

def search_images(keyword, max_images=10):
    """
    搜索图片（示例代码）
    注意：实际使用时需要遵守网站的 robots.txt 和使用条款
    """
    # 这里只是示例，实际需要根据具体网站调整
    print(f"搜索关键词: {keyword}")
    print(f"最多下载: {max_images} 张")
    
    # 实际实现需要：
    # 1. 访问图片搜索网站
    # 2. 解析搜索结果
    # 3. 下载图片
    # 4. 保存到对应目录
    
    pass

# 使用示例
# search_images("孙颖莎", 20)
```

## 使用浏览器扩展

### Chrome 扩展
1. **Image Downloader**
   - 可以批量下载页面上的图片
   - 支持筛选和选择

2. **Fatkun Batch Image Downloader**
   - 批量下载图片
   - 支持按尺寸筛选

### Firefox 扩展
1. **Download All Images**
   - 一键下载页面所有图片
   - 支持筛选

## 手动搜索步骤

### 步骤 1: 访问图片网站
1. 打开浏览器
2. 访问推荐网站（见 IMAGE_SEARCH_GUIDE.md）
3. 在搜索框输入"孙颖莎"

### 步骤 2: 筛选图片
1. 选择"大尺寸"或"高清"
2. 选择"照片"类型
3. 选择最近年份

### 步骤 3: 下载图片
1. 点击图片查看大图
2. 右键 → "图片另存为"
3. 保存到 `public/images/` 对应目录

### 步骤 4: 优化图片
1. 使用 TinyPNG 压缩
2. 转换为 WebP 格式（可选）
3. 重命名为对应文件名

## 推荐搜索顺序

1. **新华社图片库** - 官方、高清、安全
2. **人民日报** - 官方媒体
3. **中国体育报** - 专业体育照片
4. **国际乒联官网** - 比赛照片
5. **百度图片** - 补充资源

## 注意事项

⚠️ **重要提醒**:
- 遵守网站使用条款
- 尊重图片版权
- 个人使用通常可以，商业使用需要授权
- 标注图片来源

---

**建议**: 优先使用官方新闻媒体的图片，版权更安全。
