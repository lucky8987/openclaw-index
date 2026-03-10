# OpenClaw 快速配置指南

## 🚀 快速开始（3步配置）

### 步骤1：配置前端API地址

**只需修改一个文件：** `openclaw-index/js/config.js`

```javascript
// 找到这一行，修改为你的后端API地址
API_BASE_URL: 'http://localhost:8080'  // 改为实际地址
```

**示例：**
```javascript
// 本地开发
API_BASE_URL: 'http://localhost:8080'

// 生产环境
API_BASE_URL: 'https://api.openclaw.com'
```

### 步骤2：配置���端

**修改文件：** `openclaw-server/src/main/resources/application.yml`

**必须配置的项目：**

```yaml
# 1. JWT密钥（必须修改！）
jwt:
  secret: YOUR_BASE64_ENCODED_SECRET_KEY  # 至少256位

# 2. 邮箱配置（必须修改！）
spring:
  mail:
    username: YOUR_EMAIL@163.com
    password: YOUR_SMTP_AUTH_CODE  # 不是邮箱密码

# 3. 支付宝配置（必须修改！）
alipay:
  appId: YOUR_APP_ID
  privateKey: YOUR_PRIVATE_KEY
  alipayPublicKey: YOUR_ALIPAY_PUBLIC_KEY
  notifyUrl: https://your-domain.com/api/downloads/alipay-notify

# 4. CORS配置（必须修改！）
cors:
  allowed-origins: https://your-frontend-domain.com
```

### 步骤3：运行

**启动后端：**
```bash
cd openclaw-server
mvn spring-boot:run
```

**启动前端：**
```bash
cd openclaw-index
python -m http.server 80
```

**访问：** http://localhost

---

## 📋 详细配置清单

### 前端配置 (1个文件)

| 文件 | 配置项 | 说明 |
|------|--------|------|
| `js/config.js` | `API_BASE_URL` | ⭐ 后端API地址（唯一必须修改） |

**完整示例：**
```javascript
const AppConfig = {
    API_BASE_URL: 'https://api.openclaw.com',  // ← 修改这里
    DEBUG: false,
    // ...其他配置可使用默认值
};
```

### 后端配置 (1个文件)

| 文件 | 必须配置 | 可选配置 |
|------|----------|----------|
| `application.yml` | JWT密钥<br>邮箱配置<br>支付宝配置<br>CORS域名 | 服务器端口<br>数据库配置<br>验证码配置 |

---

## 🎯 不同环境配置

### 开发环境

**前端：**
```javascript
API_BASE_URL: 'http://localhost:8080'
DEBUG: true
```

**后端：**
```yaml
cors:
  allowed-origins: http://localhost,http://127.0.0.1
```

### 生产环境

**前端：**
```javascript
API_BASE_URL: 'https://api.openclaw.com'
DEBUG: false
```

**后端：**
```yaml
cors:
  allowed-origins: https://www.openclaw.com,https://openclaw.com

spring:
  datasource:
    url: jdbc:h2:file:./data/payment_db  # 数据持久化
```

---

## ⚡ 部署检查清单

部署前确认：

- [ ] 前端：`js/config.js` 中的 `API_BASE_URL` 已修改
- [ ] 后端：`application.yml` 中的 JWT 密钥已修改
- [ ] 后端：邮箱 SMTP 配置已修改
- [ ] 后端：支付宝配置已修改
- [ ] 后端：CORS 域名已修改为前端实际域名
- [ ] 后端：支付宝回调地址已修改为公网 HTTPS 地址
- [ ] 后端：数据库名改为文件模式（可选，避免重启丢失数据）
- [ ] 准备好软件安装包放在 `install-package/` 目录

部署后验证：

- [ ] 前端页面可以正常访问
- [ ] 点击注册，能收到邮箱验证码
- [ ] 注册成功后可以登录
- [ ] 登录后导航栏显示用户名
- [ ] 访问下载页面，点击支付能显示二维码
- [ ] 扫码支付成功后，显示下载文件列表
- [ ] 点击文件可以正常下载

---

## 🔧 常见问题

**Q: 前端请求API报错404？**

A: 检查 `js/config.js` 中的 `API_BASE_URL` 配置
```javascript
// ✅ 正确
API_BASE_URL: 'https://api.openclaw.com'

// ❌ 错误（不要带路径）
API_BASE_URL: 'https://api.openclaw.com/api'
```

**Q: 前端请求API报CORS错误？**

A: 修改后端 `application.yml` 的 CORS 配置
```yaml
cors:
  allowed-origins: https://your-frontend-domain.com
```

**Q: 收不到邮箱验证码？**

A: 检查后端邮箱配置
1. 确认SMTP服务已开启
2. 使用的是授权码而不是邮箱密码
3. 查看后端日志是否有发送错误

**Q: 支付二维码不显示？**

A: 检查支付宝配置
1. 确认AppID和密钥正确
2. 检查是否使用沙箱环境
3. 查看后端日志

---

## 📚 更多文档

- 详细实现说明：`IMPLEMENTATION_GUIDE.md`
- 部署配置详解：`openclaw-index/DEPLOYMENT.md`

---

## 🎉 配置完成

恭喜！按照以上步骤配置完成后，你的系统就可以运行了！

访问 http://localhost 开始使用 OpenClaw 用户认证与支付下载系统。
