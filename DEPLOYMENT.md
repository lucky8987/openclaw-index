# OpenClaw 前端部署配置指南

## 配置文件说明

为了方便前后端分离部署，所有API地址配置都集中在 `js/config.js` 文件中。

### 配置文件位置

```
openclaw-index/
└── js/
    └── config.js  ← 所有配置集中在这里
```

---

## 开发环境配置

默认情况下，`config.js` 已配置为开发环境：

```javascript
const AppConfig = {
    API_BASE_URL: 'http://localhost:8080',  // 本地后端地址
    DEBUG: true,
    // ...其他配置
};
```

**使用方式：**
1. 后端运行在 `http://localhost:8080`
2. 前端运行在 `http://localhost`（或其他本地服务器）
3. 无需修改任何配置即可使用

---

## 生产环境配置

### 方法一：自动检测（推荐）

`config.js` 已内置自动检测逻辑，当检测到非本地访问时，会自动切换为生产配置：

```javascript
// 自动检测生产环境
if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    AppConfig.API_BASE_URL = 'https://api.yourdomain.com';  // 修改为你的API地址
    AppConfig.DEBUG = false;
}
```

**部署步骤：**
1. 修改 `config.js` 第67行的API地址：
   ```javascript
   AppConfig.API_BASE_URL = 'https://api.openclaw.com';  // 改为你的实际API地址
   ```

2. 上传整个 `openclaw-index` 目录到Web服务器

3. 完成！

### 方法二：构建时替换（适合CI/CD）

在构建/部署流程中，使用脚本替换配置：

**示例脚本（deploy.sh）：**
```bash
#!/bin/bash

# 设置生产API地址
PROD_API_URL="https://api.openclaw.com"

# 替换配置文件中的API地址
sed -i "s|http://localhost:8080|$PROD_API_URL|g" js/config.js

# 上传到服务器
# rsync -avz --exclude='.git' ./ user@server:/var/www/openclaw/
```

### 方法三：环境变量（适合Docker）

创建不同环境的配置文件：

```
js/
├── config.js              # 默认配置
├── config.development.js  # 开发环境
└── config.production.js   # 生产环境
```

**Dockerfile示例：**
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html/

# 根据构建参数选择配置
ARG ENV=production
RUN if [ "$ENV" = "production" ]; then \
        cp /usr/share/nginx/html/js/config.production.js /usr/share/nginx/html/js/config.js; \
    else \
        cp /usr/share/nginx/html/js/config.development.js /usr/share/nginx/html/js/config.js; \
    fi
```

---

## 完整配置项说明

```javascript
const AppConfig = {
    /**
     * API服务器地址
     * 这是唯一必须修改的配置项
     */
    API_BASE_URL: 'http://localhost:8080',

    /**
     * 网站地址（用于CORS等）
     * 自动检测，通常不需要修改
     */
    SITE_URL: 'http://localhost',

    /**
     * 需要登录才能访问的页面
     * 可根据实际需求添加或删除
     */
    PROTECTED_PAGES: ['/zh-CN/', '/download.html'],

    /**
     * 调试模式
     * 开发：true（显示详细日志）
     * 生产：false（关闭调试日志）
     */
    DEBUG: true,

    /**
     * 日志级别
     * debug < info < warn < error
     */
    LOG: {
        ENABLED: true,
        LEVEL: 'debug'
    }
};
```

---

## 不同部署场景配置示例

### 场景1：前后端同域名

```
前端：https://www.openclaw.com
后端：https://www.openclaw.com/api
```

**config.js配置：**
```javascript
API_BASE_URL: 'https://www.openclaw.com'  // API在同一个域名下
```

### 场景2：前后端不同域名

```
前端：https://www.openclaw.com
后端：https://api.openclaw.com
```

**config.js配置：**
```javascript
API_BASE_URL: 'https://api.openclaw.com'  // 独立API域名
```

### 场景3：使用CDN + 独立API

```
前端：CDN（https://cdn.openclaw.com）
后端：https://api.openclaw.com
```

**config.js配置：**
```javascript
API_BASE_URL: 'https://api.openclaw.com'
SITE_URL: 'https://cdn.openclaw.com'  // 用于CORS配置
```

### 场景4：多环境部署（开发/测试/生产）

创建多个配置文件：

**config.development.js：**
```javascript
AppConfig.API_BASE_URL = 'http://dev-api.openclaw.com';
AppConfig.DEBUG = true;
```

**config.staging.js：**
```javascript
AppConfig.API_BASE_URL = 'https://staging-api.openclaw.com';
AppConfig.DEBUG = true;
```

**config.production.js：**
```javascript
AppConfig.API_BASE_URL = 'https://api.openclaw.com';
AppConfig.DEBUG = false;
```

---

## 后端CORS配置

部署后，需要修改后端 `application.yml` 中的CORS配置：

```yaml
cors:
  allowed-origins: https://www.openclaw.com,https://openclaw.com
```

或修改 `WebConfig.java`：

```java
@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/api/**")
        .allowedOrigins("https://www.openclaw.com", "https://openclaw.com")
        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
        .allowedHeaders("*")
        .allowCredentials(true)
        .maxAge(3600);
}
```

---

## 验证配置

部署后，在浏览器控制台检查配置是否正确：

```javascript
// 查看当前配置
console.log('API地址:', window.AppConfig.API_BASE_URL);
console.log('调试模式:', window.AppConfig.DEBUG);
console.log('网站地址:', window.AppConfig.SITE_URL);
```

---

## 常见问题

### 1. API请求404

**原因：** API地址配置错误

**解决：**
```javascript
// 检查config.js中的API_BASE_URL
console.log(window.AppConfig.API_BASE_URL);

// 确保格式正确（不要以/结尾）
// ✅ 正确：'https://api.openclaw.com'
// ❌ 错误：'https://api.openclaw.com/'
```

### 2. CORS跨域错误

**原因：** 后端CORS未配置前端域名

**解决：**
1. 修改后端 `application.yml` 的 `cors.allowed-origins`
2. 或在后端 `WebConfig.java` 中添加前端域名

### 3. 静态资源404

**原因：** 相对路径问题

**解决：**
确保HTML文件中的资源引用使用相对路径：
```html
<!-- ✅ 正确 -->
<script src="js/config.js"></script>

<!-- ❌ 错误 -->
<script src="/js/config.js"></script>
```

### 4. 配置未生效

**原因：** config.js未正确加载或加载顺序错误

**解决：**
确保在所有脚本之前先加载config.js：
```html
<!-- ✅ 正确顺序 -->
<script src="js/config.js"></script>
<script src="js/api.js"></script>
<script src="js/login.js"></script>

<!-- ❌ 错误顺序 -->
<script src="js/api.js"></script>  <!-- api.js依赖config.js，不能先加载 -->
<script src="js/config.js"></script>
```

---

## 自动化部署脚本示例

### 使用rsync部署

```bash
#!/bin/bash

# 配置
PROD_API_URL="https://api.openclaw.com"
SERVER="user@server:/var/www/openclaw"

# 修改API地址
sed -i "s|http://localhost:8080|$PROD_API_URL|g" js/config.js

# 部署到服务器
rsync -avz --exclude='.git' --exclude='*.md' --exclude='*.sh' ./ $SERVER

echo "部署完成！"
```

### 使用GitHub Actions

```yaml
name: Deploy Frontend

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Configure Production API
        run: |
          sed -i "s|http://localhost:8080|${{ secrets.PROD_API_URL }}|g" js/config.js

      - name: Deploy to Server
        run: |
          # 部署脚本
```

---

## 总结

✅ **唯一需要修改的文件：** `js/config.js`

✅ **唯一需要修改的配置项：** `API_BASE_URL`

✅ **修改示例：**
```javascript
// 开发环境
API_BASE_URL: 'http://localhost:8080'

// 生产环境
API_BASE_URL: 'https://api.openclaw.com'
```

✅ **部署流程：**
1. 修改 `js/config.js` 中的 `API_BASE_URL`
2. 上传 `openclaw-index` 目录到Web服务器
3. 配置后端CORS允许前端域名
4. 完成！

---

如有其他部署需求，可根据实际情况调整配置。
