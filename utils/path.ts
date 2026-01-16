/**
 * 获取资源路径，自动处理 basePath
 * 用于 GitHub Pages 部署时的路径处理
 */
export function getAssetPath(path: string): string {
  // 如果路径已经是绝对 URL，直接返回
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  // 获取 basePath
  let basePath = ''
  
  if (typeof window !== 'undefined') {
    // 客户端：多种方式尝试获取 basePath
    // 方法1：从我们注入的全局变量获取（最可靠）
    basePath = (window as any).__NEXT_PUBLIC_BASE_PATH__ || ''
    
    // 方法2：从 Next.js 的 __NEXT_DATA__ 获取
    if (!basePath) {
      const nextData = (window as any).__NEXT_DATA__
      basePath = nextData?.assetPrefix || nextData?.basePath || ''
    }
    
    // 方法3：如果方法1和2都失败，从当前路径推断
    if (!basePath && window.location.pathname) {
      const pathname = window.location.pathname
      // 如果路径以 /SunYingSha 开头，提取 basePath
      // 匹配 /SunYingSha 或 /SunYingSha/ 开头的路径
      const match = pathname.match(/^(\/SunYingSha)/)
      if (match) {
        basePath = match[1]
      }
    }
  } else {
    // 服务器端：从环境变量获取
    basePath = process.env.NEXT_PUBLIC_BASE_PATH || 
      (process.env.NODE_ENV === 'production' ? '/SunYingSha' : '')
  }

  // 确保路径以 / 开头
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  
  // 如果有 basePath，添加到路径前
  if (basePath) {
    // 确保 basePath 不以 / 结尾（除了根路径）
    const normalizedBasePath = basePath.endsWith('/') && basePath !== '/' 
      ? basePath.slice(0, -1) 
      : basePath
    return `${normalizedBasePath}${normalizedPath}`
  }

  return normalizedPath
}
