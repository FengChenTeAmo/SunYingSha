# 图片下载指南

## 方法一：手动下载（推荐）

### 步骤
1. 访问以下网站搜索"孙颖莎"相关图片：
   - 新华社：http://www.xinhuanet.com/
   - 人民日报：http://www.people.com.cn/
   - 国际乒联：https://www.ittf.com/
   - 中国乒乓球协会：http://www.ctta.cn/

2. 下载图片并按照目录结构放置：
   ```
   public/images/
   ├── hero/hero-bg.jpg
   ├── about/profile.jpg
   ├── career/2015.jpg
   └── ...
   ```

3. 重命名图片以匹配数据文件中的路径

## 方法二：使用 Python 脚本（需要安装依赖）

### 安装依赖
```bash
pip install requests beautifulsoup4 pillow
```

### 脚本示例
```python
import requests
from pathlib import Path

# 注意：此脚本仅作为示例，实际使用时需要：
# 1. 确认图片版权和使用许可
# 2. 遵守网站的 robots.txt
# 3. 不要用于商业用途

def download_image(url, save_path):
    """下载图片"""
    try:
        response = requests.get(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        if response.status_code == 200:
            Path(save_path).parent.mkdir(parents=True, exist_ok=True)
            with open(save_path, 'wb') as f:
                f.write(response.content)
            print(f"下载成功: {save_path}")
        else:
            print(f"下载失败: {url}")
    except Exception as e:
        print(f"错误: {e}")

# 示例：下载图片（需要替换为实际URL）
# download_image('图片URL', 'public/images/hero/hero-bg.jpg')
```

## 方法三：使用浏览器扩展

推荐扩展：
- Image Downloader（Chrome）
- Download All Images（Firefox）

## 图片优化工具

### 在线工具
- TinyPNG: https://tinypng.com/
- Squoosh: https://squoosh.app/
- ImageOptim: https://imageoptim.com/

### 命令行工具
```bash
# 使用 ImageMagick 压缩
convert input.jpg -quality 85 output.jpg

# 转换为 WebP
cwebp -q 80 input.jpg -o output.webp
```

## 注意事项

1. **版权问题**：确保有使用权限
2. **图片质量**：选择高清图片
3. **文件大小**：优化后保持合理大小
4. **命名规范**：使用有意义的文件名
5. **格式选择**：优先使用 WebP，备选 JPG

## 推荐图片类型

- **Hero 背景**：比赛场景、颁奖瞬间
- **个人照片**：官方照片、训练照片
- **比赛图片**：精彩瞬间、关键比赛
- **奖牌图片**：奖牌特写、证书照片
