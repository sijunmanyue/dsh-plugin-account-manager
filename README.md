# 账号管理（dsh-account-manager）

一个 DeepSeek Harness 插件：左侧栏有独立的「账号管理」入口，点开是整页账号工作台。

Repository: <https://github.com/sijunmanyue/dsh-plugin-account-manager>

- 系统分「公司系统」和「个人系统」。
- 公司系统必须填写环境（测试环境、生产环境，或任意自定义环境）。
- 个人系统不显示环境。
- 每个账号只保存：系统名称、系统类型、环境（仅公司）、用户名、密码、用途。
- 支持添加、删除、全局搜索、按系统筛选与分组查看。
- 密码默认遮挡，可手动显示或复制。
- 所有账号保存在**单个 JSON 文件**中，密码按需求**明文存储**。
- JSON 路径可配置。

## 安装

```powershell
git clone https://github.com/sijunmanyue/dsh-plugin-account-manager.git
# 在 DSH 里让 Agent 使用 plugin_manager 安装本目录，或执行：
# plugin_manager -> install_bundle -> 绝对路径 target
```

安装后刷新 Harness 页面，左侧栏会出现钥匙形状的「账号管理」图标。

## 配置 JSON 路径

默认路径：

```
<DSH_HOME>/account-manager/accounts.json
```

在 profile 的 `cordis.patch.yml` 中覆盖 `dsh-account-manager` 行：

```yaml
- id: dsh-account-manager
  name: dsh-account-manager
  config:
    filePath: 'D:\my-data\accounts.json'
```

`filePath` 支持：

- 绝对路径：`D:\my-data\accounts.json`；
- `~` 开头：`~/account-data/accounts.json`；
- 相对于 `DSH_HOME` 的路径：`account-manager/my-accounts.json`。

修改配置后重启 Harness（或重新加载该插件）生效。

## JSON 格式

文件首次添加账号时自动创建。顶层结构固定为一个对象：

```json
{
  "version": 1,
  "accounts": [
    {
      "id": "a4f0c8d3-...",
      "system": "GitHub",
      "systemType": "personal",
      "environment": "",
      "username": "octocat",
      "password": "<your-password>",
      "purpose": "开源项目"
    },
    {
      "id": "6ae4d1f0-...",
      "system": "公司后台",
      "systemType": "company",
      "environment": "生产环境",
      "username": "admin",
      "password": "<your-password>",
      "purpose": "日常运维"
    }
  ]
}
```

`id` 仅用于界面删除定位；其余字段就是页面里维护的内容。修改文件前请先备份，文件格式错误时页面会明确提示，不会自动覆盖。

## 安全说明

- 密码是**明文**的，这是本插件的明确需求，不是遗漏。
- 本仓库不包含 `accounts.json` 或任何真实账号；`.gitignore` 已排除账号数据文件。
- Host API 只接受本机回环地址访问，不发送 CORS 头，但本机其他进程仍可能读取该文件。
- 建议把 JSON 文件放在只有当前用户可读的目录，并定期备份。
- 不要把该 JSON 文件提交到 Git 仓库或同步到公开云盘。

## 接口

Host 半边注册在 `/api/dsh-account-manager`：

| 方法 | 路径 | 作用 |
| --- | --- | --- |
| GET | `/accounts` | 读取全部账号和当前文件路径 |
| POST | `/accounts` | 添加账号 |
| POST | `/accounts/delete` | 按 `id` 删除账号 |

## 文件结构

```
dsh-account-manager/
├─ package.json
├─ cordis.patch.yml
├─ index.js        # Host：JSON 读写 + 本地 HTTP 接口
├─ client.js       # Client：左侧栏入口 + 整页界面
├─ locale/
│  ├─ en.json      # 插件管理器显示信息
│  └─ zh.json
├─ icon.svg
└─ README.md
```
