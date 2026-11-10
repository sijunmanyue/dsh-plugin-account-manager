/**
 * dsh-account-manager — Client half.
 *
 * A full main-panel page plus a sidebar entry:
 *   sidebar.panellist -> menu icon, id "account-manager"
 *   main              -> page, key "account-manager"
 *
 * Data is read from and written to the package's Host route:
 *   /api/dsh-account-manager
 */

window.__ModuleLoader__.load({
  id: 'dsh-account-manager',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const { useState, useEffect, useMemo, useCallback, useRef } = React

    const NS = 'dsh-account-manager'
    const API = '/api/dsh-account-manager'
    const PANEL_ID = 'account-manager'
    const TOAST_MS = 2600

    const DICTS = {
      zh: {
        'panel.title': '账号管理',
        'search.placeholder': '搜索系统、用户名或用途…',
        'search.clear': '清除搜索',
        'search.results': '个匹配',
        'action.add': '添加账号',
        'action.cancel': '取消',
        'action.delete': '删除',
        'action.confirmDelete': '确认删除',
        'action.retry': '重试',
        'action.close': '关闭',
        'action.copyUsername': '复制用户名',
        'action.copyPassword': '复制密码',
        'action.showPassword': '显示密码',
        'action.hidePassword': '隐藏密码',
        'action.copyPath': '复制路径',
        'action.addFirst': '添加第一个账号',
        'action.clearSearch': '清除搜索',
        'side.systems': '系统',
        'side.all': '全部账号',
        'side.accounts': '个账号',
        'side.systemsUnit': '个系统',
        'side.empty': '暂无系统',
        'type.company': '公司系统',
        'type.personal': '个人系统',
        'group.count': '个账号',
        'empty.noAccountsTitle': '还没有账号',
        'empty.noAccountsBody': '添加你的第一个系统账号。公司系统可以区分测试、生产等环境；个人系统无需环境。',
        'empty.noMatchTitle': '没有匹配的账号',
        'empty.noMatchBody': '换个关键词，或清除搜索后查看全部账号。',
        'empty.noSystemTitle': '这个系统还没有账号',
        'empty.noSystemBody': '可以在右上角添加账号，并选择这个系统。',
        'form.title': '添加账号',
        'form.subtitle': '只保存系统、类型、环境、用户名、密码和用途。',
        'form.system': '系统名称',
        'form.systemPlaceholder': '例如 GitHub、公司后台',
        'form.type': '系统类型',
        'form.typeHintCompany': '公司系统可以区分测试、生产等环境。',
        'form.typeHintPersonal': '个人系统不区分环境。',
        'form.environment': '环境',
        'form.environmentPlaceholder': '例如 测试环境 / 生产环境',
        'form.envTest': '测试环境',
        'form.envProd': '生产环境',
        'form.username': '用户名',
        'form.usernamePlaceholder': '登录用户名',
        'form.password': '密码',
        'form.passwordPlaceholder': '登录密码（明文保存）',
        'form.purpose': '用途',
        'form.purposePlaceholder': '这个账号用来做什么',
        'form.submit': '保存账号',
        'form.saving': '保存中…',
        'form.deleting': '删除中…',
        'form.errorRequired': '请填写系统名称、用户名、密码和用途；公司系统还需要填写环境。',
        'form.plaintext': '密码会以明文写入本地 JSON 文件，请确保该文件和所在目录只有你自己可读。',
        'field.username': '用户名',
        'field.password': '密码',
        'field.purpose': '用途',
        'confirm.deleteTitle': '删除这个账号？',
        'confirm.deleteBody': '删除后无法恢复，但不会影响其他账号。',
        'toast.added': '账号已添加',
        'toast.deleted': '账号已删除',
        'toast.usernameCopied': '用户名已复制',
        'toast.passwordCopied': '密码已复制',
        'toast.pathCopied': '路径已复制',
        'toast.copyFailed': '复制失败，请手动选择内容',
        'error.load': '加载账号失败',
        'error.network': '无法连接本地账号服务，请确认插件宿主半边已加载。',
        'error.VALIDATION': '填写内容不完整或格式不正确。',
        'error.INVALID_BODY': '请求内容格式不正确。',
        'error.BODY_TOO_LARGE': '请求内容过大。',
        'error.UNSUPPORTED_MEDIA_TYPE': '请求类型不正确。',
        'error.NOT_FOUND': '没有找到这条记录。',
        'error.STORE_CORRUPT': 'JSON 文件格式异常，请检查或备份后修复该文件。',
        'error.IO_ERROR': '读写 JSON 文件失败，请检查路径和文件权限。',
        'error.FORBIDDEN': '该接口只允许本机访问。',
        'error.INTERNAL_ERROR': '服务内部错误。',
        'error.unknown': '发生未知错误。',
        'error.render': '页面渲染失败，请刷新窗口后重试。',
        'file.label': '数据文件',
        'file.plaintext': '密码明文存储',
        'loading': '正在加载…',
        'sidebar.title': '账号管理',
        'a11y.search': '全局搜索账号',
        'a11y.deleteAccount': '删除账号',
        'a11y.copyPasswordFor': '复制密码：',
        'a11y.showPasswordFor': '显示密码：',
        'a11y.hidePasswordFor': '隐藏密码：',
        'a11y.copyUsernameFor': '复制用户名：',
        'a11y.systemFilter': '按系统筛选',
        'a11y.closeDialog': '关闭添加账号对话框',
        'a11y.envQuick': '快速填写环境',
        'a11y.accountCount': '账号数量',
      },
      en: {
        'panel.title': 'Account Manager',
        'search.placeholder': 'Search systems, usernames, or purposes…',
        'search.clear': 'Clear search',
        'search.results': 'matches',
        'action.add': 'Add account',
        'action.cancel': 'Cancel',
        'action.delete': 'Delete',
        'action.confirmDelete': 'Delete account',
        'action.retry': 'Retry',
        'action.close': 'Close',
        'action.copyUsername': 'Copy username',
        'action.copyPassword': 'Copy password',
        'action.showPassword': 'Show password',
        'action.hidePassword': 'Hide password',
        'action.copyPath': 'Copy path',
        'action.addFirst': 'Add your first account',
        'action.clearSearch': 'Clear search',
        'side.systems': 'Systems',
        'side.all': 'All accounts',
        'side.accounts': 'accounts',
        'side.systemsUnit': 'systems',
        'side.empty': 'No systems yet',
        'type.company': 'Company',
        'type.personal': 'Personal',
        'group.count': 'accounts',
        'empty.noAccountsTitle': 'No accounts yet',
        'empty.noAccountsBody': 'Add your first system account. Company systems can distinguish environments such as test and production; personal systems need no environment.',
        'empty.noMatchTitle': 'No matching accounts',
        'empty.noMatchBody': 'Try another keyword, or clear the search to see every account.',
        'empty.noSystemTitle': 'This system has no accounts',
        'empty.noSystemBody': 'Use Add account in the top right and choose this system.',
        'form.title': 'Add account',
        'form.subtitle': 'Only the system, type, environment, username, password, and purpose are stored.',
        'form.system': 'System name',
        'form.systemPlaceholder': 'For example GitHub or the company admin console',
        'form.type': 'System type',
        'form.typeHintCompany': 'Company systems can distinguish environments such as test and production.',
        'form.typeHintPersonal': 'Personal systems do not distinguish environments.',
        'form.environment': 'Environment',
        'form.environmentPlaceholder': 'For example Test or Production',
        'form.envTest': 'Test',
        'form.envProd': 'Production',
        'form.username': 'Username',
        'form.usernamePlaceholder': 'Login username',
        'form.password': 'Password',
        'form.passwordPlaceholder': 'Login password (stored in plain text)',
        'form.purpose': 'Purpose',
        'form.purposePlaceholder': 'What this account is used for',
        'form.submit': 'Save account',
        'form.saving': 'Saving…',
        'form.deleting': 'Deleting…',
        'form.errorRequired': 'Fill in the system name, username, password, and purpose. Company systems also need an environment.',
        'form.plaintext': 'The password is written to a local JSON file in plain text. Make sure only you can read that file and its directory.',
        'field.username': 'Username',
        'field.password': 'Password',
        'field.purpose': 'Purpose',
        'confirm.deleteTitle': 'Delete this account?',
        'confirm.deleteBody': 'This cannot be undone. Other accounts are not affected.',
        'toast.added': 'Account added',
        'toast.deleted': 'Account deleted',
        'toast.usernameCopied': 'Username copied',
        'toast.passwordCopied': 'Password copied',
        'toast.pathCopied': 'Path copied',
        'toast.copyFailed': 'Copy failed; select the text manually',
        'error.load': 'Could not load accounts',
        'error.network': 'Cannot reach the local account service. Check that the Host half is loaded.',
        'error.VALIDATION': 'Some fields are missing or invalid.',
        'error.INVALID_BODY': 'The request body is invalid.',
        'error.BODY_TOO_LARGE': 'The request body is too large.',
        'error.UNSUPPORTED_MEDIA_TYPE': 'The request content type is invalid.',
        'error.NOT_FOUND': 'That record was not found.',
        'error.STORE_CORRUPT': 'The JSON file is malformed. Inspect or restore it from a backup.',
        'error.IO_ERROR': 'Could not read or write the JSON file. Check its path and permissions.',
        'error.FORBIDDEN': 'This endpoint accepts local requests only.',
        'error.INTERNAL_ERROR': 'Internal service error.',
        'error.unknown': 'Something went wrong.',
        'error.render': 'The page failed to render. Reload the window and try again.',
        'file.label': 'Data file',
        'file.plaintext': 'Plain-text passwords',
        'loading': 'Loading…',
        'sidebar.title': 'Account Manager',
        'a11y.search': 'Search all accounts',
        'a11y.deleteAccount': 'Delete account',
        'a11y.copyPasswordFor': 'Copy password for ',
        'a11y.showPasswordFor': 'Show password for ',
        'a11y.hidePasswordFor': 'Hide password for ',
        'a11y.copyUsernameFor': 'Copy username for ',
        'a11y.systemFilter': 'Filter by system',
        'a11y.closeDialog': 'Close add-account dialog',
        'a11y.envQuick': 'Fill an environment',
        'a11y.accountCount': 'Account count',
      },
    }

    const CSS = `
.am-root{
  --am-line:var(--dsw-alias-border-l1);
  --am-line-strong:var(--dsw-alias-border-l2);
  --am-fg:var(--dsw-alias-label-primary);
  --am-dim:var(--dsw-alias-label-secondary);
  --am-card:var(--dsw-alias-bg-layer-1);
  --am-nested:var(--dsw-alias-bg-layer-2);
  --am-overlay:var(--dsw-alias-bg-overlay);
  --am-danger:var(--dsw-alias-state-error-primary);
  height:100%;min-height:0;display:flex;flex-direction:column;overflow:hidden;
  background:var(--dsw-alias-bg-base);color:var(--am-fg);font-size:13px;line-height:1.55;
}
.am-root *{box-sizing:border-box}
.am-root button,.am-root input,.am-root textarea{font:inherit}
.am-header{display:flex;align-items:flex-end;gap:20px;padding:22px 28px 18px;border-bottom:1px solid var(--am-line);flex-wrap:wrap;flex:none}
.am-heading{flex:1 1 240px;min-width:180px}
.am-title{margin:0;font-size:20px;line-height:1.25;font-weight:700;letter-spacing:-.01em}
.am-sub{margin:4px 0 0;color:var(--am-dim);font-size:12px}
.am-tools{display:flex;align-items:center;justify-content:flex-end;gap:10px;flex:1 1 420px;min-width:260px}
.am-search{position:relative;flex:1 1 300px;max-width:440px;min-width:170px}
.am-search>svg{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--am-dim);pointer-events:none}
.am-search input{width:100%;height:36px;padding:0 36px 0 34px;border:1px solid var(--am-line-strong);border-radius:9px;background:var(--am-nested);color:var(--am-fg);outline:none;font-size:12.5px}
.am-search input::placeholder{color:var(--am-dim)}
.am-search input::-webkit-search-cancel-button{display:none}
.am-search input:focus{border-color:var(--am-fg);box-shadow:0 0 0 3px color-mix(in srgb,var(--am-fg) 14%,transparent)}
.am-search-clear{position:absolute;right:5px;top:50%;transform:translateY(-50%);width:26px;height:26px;border:0;border-radius:6px;background:transparent;color:var(--am-dim);display:grid;place-items:center;cursor:pointer}
.am-search-clear:hover{background:var(--am-card);color:var(--am-fg)}
.am-btn{height:36px;display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:0 13px;border:1px solid var(--am-line-strong);border-radius:9px;background:var(--am-card);color:var(--am-fg);font-size:12.5px;font-weight:600;cursor:pointer;white-space:nowrap}
.am-btn:hover:not(:disabled){background:var(--am-nested)}
.am-btn.primary{background:var(--am-fg);border-color:var(--am-fg);color:var(--dsw-alias-bg-base)}
.am-btn.primary:hover:not(:disabled){opacity:.9;background:var(--am-fg)}
.am-btn.danger{color:var(--am-danger);border-color:color-mix(in srgb,var(--am-danger) 45%,var(--am-line-strong))}
.am-btn:disabled{opacity:.5;cursor:not-allowed}
.am-iconbtn{width:28px;height:28px;flex:none;display:grid;place-items:center;border:1px solid transparent;border-radius:7px;background:transparent;color:var(--am-dim);cursor:pointer}
.am-iconbtn:hover:not(:disabled){background:var(--am-nested);border-color:var(--am-line);color:var(--am-fg)}
.am-iconbtn.danger:hover:not(:disabled){color:var(--am-danger);border-color:color-mix(in srgb,var(--am-danger) 35%,var(--am-line))}
.am-iconbtn:disabled{opacity:.45;cursor:not-allowed}
.am-body{flex:1;min-height:0;display:grid;grid-template-columns:250px minmax(0,1fr)}
.am-side{display:flex;flex-direction:column;gap:12px;padding:18px 12px 14px;border-right:1px solid var(--am-line);background:var(--am-card);overflow:auto;min-height:0}
.am-side-head{padding:0 8px;font-size:10.5px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:var(--am-dim)}
.am-side-list{display:flex;flex-direction:column;gap:2px}
.am-side-item{width:100%;display:grid;grid-template-columns:20px minmax(0,1fr) auto;align-items:center;gap:8px;padding:7px 8px;border:0;border-radius:8px;background:transparent;color:var(--am-fg);text-align:left;cursor:pointer}
.am-side-item:hover{background:var(--am-nested)}
.am-side-item.active{background:var(--am-nested);font-weight:650;box-shadow:inset 2px 0 0 var(--am-fg)}
.am-side-dot{width:16px;height:16px;border:1.5px solid var(--am-dim);border-radius:5px;position:relative}
.am-side-dot::after{content:"";position:absolute;inset:4px;border-radius:50%;background:var(--am-fg)}
.am-side-mark{width:18px;height:18px;display:grid;place-items:center;border-radius:5px;background:var(--am-nested);border:1px solid var(--am-line);font-size:9.5px;font-weight:700;color:var(--am-fg)}
.am-side-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12.5px}
.am-side-count{font-size:10.5px;color:var(--am-dim);min-width:18px;text-align:right}
.am-side-foot{margin-top:auto;padding:12px 8px 0;border-top:1px solid var(--am-line);color:var(--am-dim);font-size:11px}
.am-main{min-width:0;min-height:0;overflow:auto;padding:22px 28px 36px}
.am-main-inner{max-width:1040px;margin:0 auto}
.am-resultbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 16px;color:var(--am-dim);font-size:11.5px}
.am-linkbtn{padding:0;border:0;background:transparent;color:var(--am-fg);font-size:11.5px;cursor:pointer;text-decoration:underline;text-underline-offset:2px}
.am-linkbtn:hover{text-decoration:underline}
.am-group{margin:0 0 26px}
.am-group:last-of-type{margin-bottom:18px}
.am-group-head{display:flex;align-items:center;gap:10px;margin:0 0 10px;padding:0 2px;min-width:0}
.am-sysmark{width:34px;height:34px;flex:none;display:grid;place-items:center;border:1px solid var(--am-line);border-radius:9px;background:var(--am-nested);color:var(--am-fg);font-size:14px;font-weight:700}
.am-group-title{min-width:0;flex:1}
.am-group-title h2{margin:0;font-size:14px;line-height:1.35;font-weight:700;overflow-wrap:anywhere}
.am-group-meta{margin-top:2px;color:var(--am-dim);font-size:11.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.am-group-count{flex:none;border:1px solid var(--am-line);border-radius:999px;padding:2px 8px;color:var(--am-dim);font-size:10.5px;white-space:nowrap}
.am-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:10px}
.am-card{position:relative;display:flex;flex-direction:column;gap:9px;min-width:0;padding:14px;border:1px solid var(--am-line);border-radius:12px;background:var(--am-card)}
.am-card:hover{border-color:var(--am-line-strong)}
.am-card-head{display:flex;align-items:flex-start;gap:10px;min-width:0}
.am-avatar{width:32px;height:32px;flex:none;display:grid;place-items:center;border:1px solid var(--am-line);border-radius:9px;background:var(--am-nested);color:var(--am-fg);font-size:12px;font-weight:700}
.am-id{flex:1;min-width:0}
.am-kicker{color:var(--am-dim);font-size:10px;line-height:1.2;letter-spacing:.04em}
.am-uname{margin-top:1px;font-size:13.5px;font-weight:700;line-height:1.35;overflow-wrap:anywhere}
.am-subline{display:flex;align-items:center;gap:5px;flex-wrap:wrap;margin-top:4px}
.am-tag{display:inline-flex;align-items:center;border:1px solid var(--am-line);border-radius:999px;padding:1px 7px;color:var(--am-dim);font-size:10px;line-height:1.55;white-space:nowrap}
.am-tag.env{border-color:color-mix(in srgb,var(--am-fg) 32%,var(--am-line));color:var(--am-fg)}
.am-card-actions{display:flex;align-items:center;gap:1px;flex:none}
.am-fieldrow{display:flex;align-items:flex-start;gap:8px;min-width:0;padding-top:8px;border-top:1px solid var(--am-line)}
.am-fieldlabel{width:44px;flex:none;color:var(--am-dim);font-size:10.5px;line-height:1.65}
.am-secret{flex:1;min-width:0;display:flex;align-items:center;gap:2px}
.am-secret code{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:ui-monospace,SFMono-Regular,Consolas,"Liberation Mono",monospace;font-size:12px;line-height:1.65;letter-spacing:.01em}
.am-purpose-text{flex:1;min-width:0;margin:0;font-size:12px;line-height:1.65;overflow-wrap:anywhere}
.am-confirm{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:16px;border-radius:12px;background:color-mix(in srgb,var(--am-card) 94%,transparent);backdrop-filter:blur(2px);text-align:center}
.am-confirm-title{font-size:12.5px;font-weight:700}
.am-confirm-meta{color:var(--am-dim);font-size:11px;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.am-confirm-body{color:var(--am-dim);font-size:10.5px;line-height:1.45;max-width:300px}
.am-confirm-actions{display:flex;align-items:center;gap:8px;margin-top:7px}
.am-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:54px 24px;border:1px dashed var(--am-line-strong);border-radius:14px;text-align:center;color:var(--am-dim)}
.am-empty-icon{width:48px;height:48px;display:grid;place-items:center;border:1px solid var(--am-line);border-radius:14px;background:var(--am-nested);color:var(--am-fg);margin-bottom:2px}
.am-empty h3{margin:0;font-size:14px;color:var(--am-fg)}
.am-empty p{max-width:480px;margin:0;font-size:12px;line-height:1.7}
.am-empty-action{margin-top:8px}
.am-empty-action .am-btn{margin-top:0}
.am-footer{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:24px;padding-top:13px;border-top:1px solid var(--am-line);color:var(--am-dim);font-size:10.5px}
.am-file{display:flex;align-items:center;gap:6px;flex:1 1 420px;min-width:0}
.am-file>svg{flex:none}
.am-file code{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:ui-monospace,SFMono-Regular,Consolas,"Liberation Mono",monospace;font-size:10.5px}
.am-file .am-iconbtn{width:24px;height:24px}
.am-plain{margin-left:auto;color:var(--am-dim);white-space:nowrap}
.am-crash{padding:40px}
.am-toast{position:fixed;left:50%;bottom:28px;z-index:1200;transform:translateX(-50%);display:flex;align-items:center;gap:8px;max-width:min(460px,calc(100vw - 32px));padding:9px 14px;border:1px solid var(--am-line-strong);border-radius:10px;background:var(--am-overlay);box-shadow:0 12px 36px color-mix(in srgb,var(--am-fg) 18%,transparent);color:var(--am-fg);font-size:12px}
.am-toast.error{color:var(--am-danger)}
.am-toast-dot{width:7px;height:7px;flex:none;border-radius:50%;background:var(--dsw-alias-state-success-primary)}
.am-toast.error .am-toast-dot{background:var(--am-danger)}
.am-overlay{position:fixed;inset:0;z-index:1100;display:flex;align-items:center;justify-content:center;padding:20px;background:color-mix(in srgb,var(--dsw-alias-bg-base) 62%,transparent);backdrop-filter:blur(3px)}
.am-dialog{width:min(560px,100%);max-height:calc(100vh - 40px);overflow:auto;padding:20px;border:1px solid var(--am-line-strong);border-radius:14px;background:var(--am-overlay);box-shadow:0 24px 64px color-mix(in srgb,var(--am-fg) 22%,transparent)}
.am-dialog-head{display:flex;align-items:flex-start;gap:12px}
.am-dialog-head h2{margin:0;font-size:16px;line-height:1.35;font-weight:700;flex:1}
.am-dialog-head p{margin:4px 0 0;color:var(--am-dim);font-size:11.5px;line-height:1.55}
.am-dialog-close{width:30px;height:30px;flex:none;display:grid;place-items:center;border:0;border-radius:8px;background:transparent;color:var(--am-dim);cursor:pointer}
.am-dialog-close:hover{background:var(--am-nested);color:var(--am-fg)}
.am-form{display:flex;flex-direction:column;gap:13px;margin-top:18px}
.am-label{display:flex;flex-direction:column;gap:5px;min-width:0}
.am-label>span:first-child{font-size:11.5px;font-weight:650}
.am-input,.am-textarea{width:100%;border:1px solid var(--am-line-strong);border-radius:8px;background:var(--am-nested);color:var(--am-fg);outline:none;font-size:12.5px;padding:8px 10px}
.am-input{height:35px}
.am-textarea{min-height:64px;max-height:140px;resize:vertical;line-height:1.55}
.am-input:focus,.am-textarea:focus{border-color:var(--am-fg);box-shadow:0 0 0 3px color-mix(in srgb,var(--am-fg) 14%,transparent)}
.am-input::placeholder,.am-textarea::placeholder{color:var(--am-dim)}
.am-input-wrap{position:relative}
.am-input-wrap .am-input{padding-right:38px}
.am-reveal{position:absolute;right:4px;top:50%;transform:translateY(-50%);width:28px;height:28px;display:grid;place-items:center;border:0;border-radius:6px;background:transparent;color:var(--am-dim);cursor:pointer}
.am-reveal:hover{background:var(--am-card);color:var(--am-fg)}
.am-segment{display:flex;gap:3px;padding:3px;border:1px solid var(--am-line);border-radius:9px;background:var(--am-nested)}
.am-segment button{flex:1;height:29px;border:0;border-radius:6px;background:transparent;color:var(--am-dim);font-size:12px;font-weight:600;cursor:pointer}
.am-segment button:hover{color:var(--am-fg)}
.am-segment button.on{background:var(--am-card);color:var(--am-fg);box-shadow:0 1px 3px color-mix(in srgb,var(--am-fg) 14%,transparent)}
.am-hint{color:var(--am-dim);font-size:10.5px;line-height:1.5;font-weight:400}
.am-quick{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.am-chip{height:24px;padding:0 9px;border:1px solid var(--am-line);border-radius:999px;background:transparent;color:var(--am-dim);font-size:10.5px;cursor:pointer}
.am-chip:hover{border-color:var(--am-fg);color:var(--am-fg)}
.am-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.am-warning{display:flex;align-items:flex-start;gap:8px;padding:9px 10px;border:1px solid color-mix(in srgb,var(--dsw-alias-state-warn-primary) 38%,var(--am-line));border-radius:8px;background:color-mix(in srgb,var(--dsw-alias-state-warn-primary) 10%,transparent);color:var(--am-dim);font-size:10.5px;line-height:1.55}
.am-warning>svg{flex:none;margin-top:1px;color:var(--dsw-alias-state-warn-primary)}
.am-form-error{padding:8px 10px;border:1px solid color-mix(in srgb,var(--am-danger) 42%,var(--am-line));border-radius:8px;background:color-mix(in srgb,var(--am-danger) 9%,transparent);color:var(--am-danger);font-size:11.5px;line-height:1.5}
.am-dialog-actions{display:flex;justify-content:flex-end;gap:8px;padding-top:3px}
.am-skeleton{display:flex;flex-direction:column;gap:14px;max-width:1040px;margin:0 auto}
.am-skel-line{height:13px;border-radius:6px;background:var(--am-nested);animation:am-pulse 1.4s ease-in-out infinite}
.am-skel-card{height:108px;border:1px solid var(--am-line);border-radius:12px;background:var(--am-nested);opacity:.55;animation:am-pulse 1.4s ease-in-out infinite}
.am-skel-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:10px}
.am-skel-side{height:32px;border-radius:8px;background:var(--am-nested);animation:am-pulse 1.4s ease-in-out infinite;margin:0 8px}
@keyframes am-pulse{0%,100%{opacity:.42}50%{opacity:.9}}
@media (max-width:900px){
  .am-cards{grid-template-columns:1fr}
  .am-form-grid{grid-template-columns:1fr}
}
@media (max-width:760px){
  .am-header{padding:18px 18px 15px;align-items:stretch}
  .am-tools{flex-basis:100%}
  .am-body{grid-template-columns:1fr;grid-template-rows:auto minmax(0,1fr)}
  .am-side{border-right:0;border-bottom:1px solid var(--am-line);flex-direction:row;align-items:center;gap:8px;padding:8px 10px;overflow-x:auto;overflow-y:hidden}
  .am-side-head,.am-side-foot{display:none}
  .am-side-list{flex-direction:row;gap:4px}
  .am-side-item{width:auto;min-width:120px;grid-template-columns:18px minmax(0,1fr) auto}
  .am-main{padding:18px 18px 30px}
}
@media (prefers-reduced-motion:reduce){
  .am-root *{animation:none!important;transition:none!important}
}
`

    function useTranslator(locale) {
      const subscribe = useCallback((callback) => locale.subscribe(callback), [locale])
      const getSnapshot = useCallback(() => locale.getSnapshot(), [locale])
      React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
      return locale.bind(NS)
    }

    async function request(path, options) {
      const init = Object.assign({ cache: 'no-store' }, options || {})
      if (init.body !== undefined && init.body !== null) {
        init.headers = Object.assign({ 'content-type': 'application/json' }, init.headers || {})
      }
      let response
      try {
        response = await fetch(API + path, init)
      } catch (error) {
        if (error && error.name === 'AbortError') throw error
        const network = new Error('network request failed')
        network.code = 'NETWORK'
        throw network
      }

      let payload = null
      const contentType = response.headers.get('content-type') || ''
      if (contentType.indexOf('application/json') !== -1) {
        try {
          payload = await response.json()
        } catch {
          payload = null
        }
      }
      if (!response.ok || !payload || payload.ok === false) {
        const failure = new Error((payload && payload.message) || ('HTTP ' + response.status))
        failure.code = (payload && payload.code) || ('HTTP_' + response.status)
        failure.status = response.status
        throw failure
      }
      return payload
    }

    function normalizeAccount(raw) {
      const account = raw && typeof raw === 'object' ? raw : {}
      const systemType = account.systemType === 'company' ? 'company' : 'personal'
      return {
        id: typeof account.id === 'string' ? account.id : '',
        system: typeof account.system === 'string' ? account.system : '',
        systemType,
        environment: systemType === 'company' && typeof account.environment === 'string'
          ? account.environment
          : '',
        username: typeof account.username === 'string' ? account.username : '',
        password: typeof account.password === 'string' ? account.password : '',
        purpose: typeof account.purpose === 'string' ? account.purpose : '',
      }
    }

    function systemKey(account) {
      return account.systemType + '\u0000' + account.system
    }

    function groupAccounts(accounts) {
      const map = new Map()
      for (const account of accounts) {
        const key = systemKey(account)
        let group = map.get(key)
        if (!group) {
          group = { key, system: account.system, systemType: account.systemType, accounts: [] }
          map.set(key, group)
        }
        group.accounts.push(account)
      }
      const groups = Array.from(map.values())
      for (const group of groups) {
        group.accounts.sort((left, right) => {
          return (left.environment || '').localeCompare(right.environment || '', undefined, { sensitivity: 'base' })
            || left.username.localeCompare(right.username, undefined, { sensitivity: 'base' })
        })
      }
      groups.sort((left, right) => {
        return left.system.localeCompare(right.system, undefined, { sensitivity: 'base' })
          || left.systemType.localeCompare(right.systemType)
      })
      return groups
    }

    function matchesQuery(account, query, t) {
      if (!query) return true
      const haystack = [
        account.system,
        account.username,
        account.purpose,
        account.environment,
        account.systemType,
        account.systemType === 'company' ? t('type.company') : t('type.personal'),
      ].join('\n').toLowerCase()
      return query.split(/\s+/).filter(Boolean).every((part) => haystack.indexOf(part) !== -1)
    }

    function describeError(t, error) {
      const code = error && error.code
      if (code) {
        const key = 'error.' + code
        const translated = t(key)
        if (translated !== key) return translated
      }
      if (error && error.message) return error.message
      return t('error.unknown')
    }

    function maskPassword(value) {
      const count = Math.max(6, Math.min(14, Array.from(value || '').length || 6))
      return '\u2022'.repeat(count)
    }

    function initialOf(value) {
      const chars = Array.from(String(value || '').trim())
      return chars.length ? chars[0].toUpperCase() : '?'
    }

    function Svg(props) {
      return h('svg', {
        width: props.size || 16,
        height: props.size || 16,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: props.strokeWidth || 1.8,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
        focusable: false,
      }, props.children)
    }

    function IconSearch(props) {
      return h(Svg, props, [
        h('circle', { key: 'c', cx: 11, cy: 11, r: 6.5 }),
        h('path', { key: 'p', d: 'm16 16 4.5 4.5' }),
      ])
    }

    function IconPlus(props) {
      return h(Svg, props, [h('path', { key: 'p', d: 'M12 5v14M5 12h14' })])
    }

    function IconX(props) {
      return h(Svg, props, [h('path', { key: 'p', d: 'M6 6l12 12M18 6 6 18' })])
    }

    function IconCopy(props) {
      return h(Svg, props, [
        h('rect', { key: 'r', x: 9, y: 9, width: 11, height: 11, rx: 2 }),
        h('path', { key: 'p', d: 'M5 15V5a2 2 0 0 1 2-2h10' }),
      ])
    }

    function IconTrash(props) {
      return h(Svg, props, [
        h('path', { key: 'a', d: 'M4 7h16' }),
        h('path', { key: 'b', d: 'M9 7V4h6v3' }),
        h('path', { key: 'c', d: 'm6 7 1 13h10l1-13' }),
        h('path', { key: 'd', d: 'M10 11v6M14 11v6' }),
      ])
    }

    function IconEye(props) {
      return h(Svg, props, [
        h('path', { key: 'a', d: 'M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z' }),
        h('circle', { key: 'b', cx: 12, cy: 12, r: 2.5 }),
      ])
    }

    function IconEyeOff(props) {
      return h(Svg, props, [
        h('path', { key: 'a', d: 'M3 3l18 18' }),
        h('path', { key: 'b', d: 'M10.6 6.2A10 10 0 0 1 12 6c6 0 9.5 6 9.5 6a18 18 0 0 1-3 3.6' }),
        h('path', { key: 'c', d: 'M6.6 7.2A17.5 17.5 0 0 0 2.5 12S6 18 12 18a10 10 0 0 0 4.1-.9' }),
      ])
    }

    function IconFolder(props) {
      return h(Svg, props, [
        h('path', { key: 'p', d: 'M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z' }),
      ])
    }

    function IconShield(props) {
      return h(Svg, props, [
        h('path', { key: 'a', d: 'M12 3 4.5 6v5.5c0 4.3 3.1 7.7 7.5 9.5 4.4-1.8 7.5-5.2 7.5-9.5V6Z' }),
        h('path', { key: 'b', d: 'M9.5 12.2 11.2 14l3.5-3.7' }),
      ])
    }

    function IconVault(props) {
      return h(Svg, props, [
        h('rect', { key: 'a', x: 3, y: 4, width: 18, height: 16, rx: 3 }),
        h('circle', { key: 'b', cx: 9.5, cy: 12, r: 2 }),
        h('path', { key: 'c', d: 'M11.5 12H18M15 12v2.5M17.5 12v2.5' }),
      ])
    }

    function IconKey(props) {
      return h(Svg, props, [
        h('circle', { key: 'a', cx: 8, cy: 12, r: 3 }),
        h('path', { key: 'b', d: 'M11 12h9M16 12v2.5M19 12v2.5' }),
      ])
    }

    function useToastState() {
      const [toast, setToast] = useState(null)
      useEffect(() => {
        if (!toast) return undefined
        const timer = setTimeout(() => setToast(null), TOAST_MS)
        return () => clearTimeout(timer)
      }, [toast])
      return [toast, setToast]
    }

    function AddDialog({ t, onClose, onSubmit }) {
      const [form, setForm] = useState({
        system: '',
        systemType: 'company',
        environment: '',
        username: '',
        password: '',
        purpose: '',
      })
      const [error, setError] = useState('')
      const [saving, setSaving] = useState(false)
      const [showPassword, setShowPassword] = useState(false)
      const dialogRef = useRef(null)
      const savingRef = useRef(false)

      useEffect(() => {
        savingRef.current = saving
      }, [saving])

      useEffect(() => {
        const dialog = dialogRef.current
        const previous = document.activeElement
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        const focusTimer = setTimeout(() => {
          const first = dialog && dialog.querySelector('input')
          if (first) first.focus()
        }, 0)

        const onKeyDown = (event) => {
          if (event.key === 'Escape') {
            event.preventDefault()
            if (!savingRef.current) onClose()
            return
          }
          if (event.key !== 'Tab' || !dialog) return
          const nodes = Array.from(dialog.querySelectorAll('button,input,textarea,select,[href],[tabindex]:not([tabindex="-1"])'))
            .filter((node) => !node.disabled && node.offsetParent !== null)
          if (!nodes.length) return
          const first = nodes[0]
          const last = nodes[nodes.length - 1]
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last.focus()
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first.focus()
          }
        }

        document.addEventListener('keydown', onKeyDown, true)
        return () => {
          clearTimeout(focusTimer)
          document.removeEventListener('keydown', onKeyDown, true)
          document.body.style.overflow = previousOverflow
          if (previous && typeof previous.focus === 'function') previous.focus()
        }
      }, [onClose])

      const setField = (field) => (event) => {
        const value = event.target.value
        setForm((current) => Object.assign({}, current, { [field]: value }))
        if (error) setError('')
      }

      const chooseType = (systemType) => {
        setForm((current) => Object.assign({}, current, {
          systemType,
          environment: systemType === 'company' ? current.environment : '',
        }))
        if (error) setError('')
      }

      const chooseEnvironment = (environment) => {
        setForm((current) => Object.assign({}, current, { environment }))
        if (error) setError('')
      }

      const handleSubmit = async (event) => {
        event.preventDefault()
        if (saving) return
        const system = form.system.trim()
        const environment = form.systemType === 'company' ? form.environment.trim() : ''
        const username = form.username.trim()
        const purpose = form.purpose.trim()
        if (!system || !username || !form.password || !purpose || (form.systemType === 'company' && !environment)) {
          setError(t('form.errorRequired'))
          return
        }
        setSaving(true)
        setError('')
        try {
          await onSubmit({
            system,
            systemType: form.systemType,
            environment,
            username,
            password: form.password,
            purpose,
          })
        } catch (submitError) {
          setSaving(false)
          setError(describeError(t, submitError))
        }
      }

      return h('div', {
        className: 'am-overlay',
        onMouseDown: (event) => {
          if (event.target === event.currentTarget && !saving) onClose()
        },
      }, h('div', {
        ref: dialogRef,
        className: 'am-dialog',
        role: 'dialog',
        'aria-modal': 'true',
        'aria-labelledby': 'am-add-title',
        onMouseDown: (event) => event.stopPropagation(),
      }, [
        h('div', { key: 'head', className: 'am-dialog-head' }, [
          h('div', { key: 'copy', style: { flex: 1, minWidth: 0 } }, [
            h('h2', { key: 'title', id: 'am-add-title' }, t('form.title')),
            h('p', { key: 'sub' }, t('form.subtitle')),
          ]),
          h('button', {
            key: 'close',
            type: 'button',
            className: 'am-dialog-close',
            onClick: onClose,
            disabled: saving,
            title: t('action.close'),
            'aria-label': t('a11y.closeDialog'),
          }, h(IconX, { size: 16 })),
        ]),
        h('form', { key: 'form', className: 'am-form', onSubmit: handleSubmit }, [
          h('label', { key: 'system', className: 'am-label' }, [
            h('span', { key: 'label' }, t('form.system')),
            h('input', {
              key: 'input',
              className: 'am-input',
              value: form.system,
              onChange: setField('system'),
              placeholder: t('form.systemPlaceholder'),
              maxLength: 80,
              autoComplete: 'off',
            }),
          ]),
          h('div', { key: 'type', className: 'am-label' }, [
            h('span', { key: 'label' }, t('form.type')),
            h('div', { key: 'segment', className: 'am-segment', role: 'group', 'aria-label': t('form.type') }, [
              h('button', {
                key: 'company',
                type: 'button',
                className: form.systemType === 'company' ? 'on' : '',
                onClick: () => chooseType('company'),
                'aria-pressed': form.systemType === 'company',
              }, t('type.company')),
              h('button', {
                key: 'personal',
                type: 'button',
                className: form.systemType === 'personal' ? 'on' : '',
                onClick: () => chooseType('personal'),
                'aria-pressed': form.systemType === 'personal',
              }, t('type.personal')),
            ]),
            h('span', { key: 'hint', className: 'am-hint' }, form.systemType === 'company'
              ? t('form.typeHintCompany')
              : t('form.typeHintPersonal')),
          ]),
          form.systemType === 'company' ? h('div', { key: 'environment', className: 'am-label' }, [
            h('span', { key: 'label' }, t('form.environment')),
            h('input', {
              key: 'input',
              className: 'am-input',
              value: form.environment,
              onChange: setField('environment'),
              placeholder: t('form.environmentPlaceholder'),
              maxLength: 60,
              autoComplete: 'off',
            }),
            h('div', { key: 'quick', className: 'am-quick', role: 'group', 'aria-label': t('a11y.envQuick') }, [
              h('button', {
                key: 'test',
                type: 'button',
                className: 'am-chip',
                onClick: () => chooseEnvironment(t('form.envTest')),
              }, t('form.envTest')),
              h('button', {
                key: 'prod',
                type: 'button',
                className: 'am-chip',
                onClick: () => chooseEnvironment(t('form.envProd')),
              }, t('form.envProd')),
            ]),
          ]) : null,
          h('div', { key: 'credentials', className: 'am-form-grid' }, [
            h('label', { key: 'username', className: 'am-label' }, [
              h('span', { key: 'label' }, t('form.username')),
              h('input', {
                key: 'input',
                className: 'am-input',
                value: form.username,
                onChange: setField('username'),
                placeholder: t('form.usernamePlaceholder'),
                maxLength: 200,
                autoComplete: 'off',
              }),
            ]),
            h('label', { key: 'password', className: 'am-label' }, [
              h('span', { key: 'label' }, t('form.password')),
              h('div', { key: 'wrap', className: 'am-input-wrap' }, [
                h('input', {
                  key: 'input',
                  className: 'am-input',
                  type: showPassword ? 'text' : 'password',
                  value: form.password,
                  onChange: setField('password'),
                  placeholder: t('form.passwordPlaceholder'),
                  maxLength: 512,
                  autoComplete: 'new-password',
                }),
                h('button', {
                  key: 'eye',
                  type: 'button',
                  className: 'am-reveal',
                  onClick: () => setShowPassword((value) => !value),
                  title: showPassword ? t('action.hidePassword') : t('action.showPassword'),
                  'aria-label': showPassword ? t('action.hidePassword') : t('action.showPassword'),
                }, h(showPassword ? IconEyeOff : IconEye, { size: 15 })),
              ]),
            ]),
          ]),
          h('label', { key: 'purpose', className: 'am-label' }, [
            h('span', { key: 'label' }, t('form.purpose')),
            h('textarea', {
              key: 'input',
              className: 'am-textarea',
              value: form.purpose,
              onChange: setField('purpose'),
              placeholder: t('form.purposePlaceholder'),
              maxLength: 1000,
            }),
          ]),
          h('div', { key: 'warning', className: 'am-warning' }, [
            h(IconShield, { key: 'icon', size: 15 }),
            h('span', { key: 'text' }, t('form.plaintext')),
          ]),
          error ? h('div', { key: 'error', className: 'am-form-error', role: 'alert' }, error) : null,
          h('div', { key: 'actions', className: 'am-dialog-actions' }, [
            h('button', {
              key: 'cancel',
              type: 'button',
              className: 'am-btn',
              onClick: onClose,
              disabled: saving,
            }, t('action.cancel')),
            h('button', {
              key: 'save',
              type: 'submit',
              className: 'am-btn primary',
              disabled: saving,
            }, saving ? t('form.saving') : t('form.submit')),
          ]),
        ]),
      ]))
    }

    function AccountCard({
      account,
      t,
      revealed,
      onToggleReveal,
      onCopy,
      onAskDelete,
      onCancelDelete,
      onDelete,
      confirming,
      deleting,
    }) {
      return h('article', { className: 'am-card' }, [
        h('div', { key: 'head', className: 'am-card-head' }, [
          h('span', {
            key: 'avatar',
            className: 'am-avatar',
            'aria-hidden': true,
          }, initialOf(account.username)),
          h('div', { key: 'id', className: 'am-id' }, [
            h('div', { key: 'kicker', className: 'am-kicker' }, t('field.username')),
            h('div', { key: 'name', className: 'am-uname' }, account.username),
            h('div', { key: 'tags', className: 'am-subline' }, [
              account.environment
                ? h('span', { key: 'env', className: 'am-tag env' }, account.environment)
                : null,
              h('span', { key: 'type', className: 'am-tag' }, account.systemType === 'company'
                ? t('type.company')
                : t('type.personal')),
            ]),
          ]),
          h('div', { key: 'actions', className: 'am-card-actions' }, [
            h('button', {
              key: 'copy-user',
              type: 'button',
              className: 'am-iconbtn',
              onClick: () => onCopy(account.username, 'toast.usernameCopied'),
              title: t('action.copyUsername'),
              'aria-label': t('a11y.copyUsernameFor') + account.username,
            }, h(IconCopy, { size: 15 })),
            h('button', {
              key: 'delete',
              type: 'button',
              className: 'am-iconbtn danger',
              onClick: onAskDelete,
              title: t('action.delete'),
              'aria-label': t('a11y.deleteAccount') + ': ' + account.username,
            }, h(IconTrash, { size: 15 })),
          ]),
        ]),
        h('div', { key: 'password', className: 'am-fieldrow' }, [
          h('span', { key: 'label', className: 'am-fieldlabel' }, t('field.password')),
          h('div', { key: 'secret', className: 'am-secret' }, [
            h('code', { key: 'value' }, revealed ? account.password : maskPassword(account.password)),
            h('button', {
              key: 'eye',
              type: 'button',
              className: 'am-iconbtn',
              onClick: () => onToggleReveal(account.id),
              title: revealed ? t('action.hidePassword') : t('action.showPassword'),
              'aria-label': revealed
                ? t('a11y.hidePasswordFor') + account.username
                : t('a11y.showPasswordFor') + account.username,
            }, h(revealed ? IconEyeOff : IconEye, { size: 15 })),
            h('button', {
              key: 'copy',
              type: 'button',
              className: 'am-iconbtn',
              onClick: () => onCopy(account.password, 'toast.passwordCopied'),
              title: t('action.copyPassword'),
              'aria-label': t('a11y.copyPasswordFor') + account.username,
            }, h(IconCopy, { size: 15 })),
          ]),
        ]),
        h('div', { key: 'purpose', className: 'am-fieldrow' }, [
          h('span', { key: 'label', className: 'am-fieldlabel' }, t('field.purpose')),
          h('p', { key: 'text', className: 'am-purpose-text' }, account.purpose),
        ]),
        confirming ? h('div', { key: 'confirm', className: 'am-confirm' }, [
          h('div', { key: 'title', className: 'am-confirm-title' }, t('confirm.deleteTitle')),
          h('div', { key: 'body', className: 'am-confirm-body' }, t('confirm.deleteBody')),
          h('div', { key: 'meta', className: 'am-confirm-meta' }, account.username),
          h('div', { key: 'actions', className: 'am-confirm-actions' }, [
            h('button', {
              key: 'cancel',
              type: 'button',
              className: 'am-btn',
              onClick: onCancelDelete,
              disabled: deleting,
            }, t('action.cancel')),
            h('button', {
              key: 'delete',
              type: 'button',
              className: 'am-btn danger',
              onClick: () => onDelete(account),
              disabled: deleting,
            }, deleting ? t('form.deleting') : t('action.confirmDelete')),
          ]),
        ]) : null,
      ])
    }

    function GroupSection({ group, t, revealed, onToggleReveal, onCopy, onAskDelete, onCancelDelete, onDelete, confirmingId, deletingId }) {
      const environments = []
      for (const account of group.accounts) {
        if (account.environment && environments.indexOf(account.environment) === -1) {
          environments.push(account.environment)
        }
      }
      const meta = group.systemType === 'company'
        ? t('type.company') + (environments.length ? ' · ' + environments.join(' / ') : '')
        : t('type.personal')

      return h('section', { className: 'am-group' }, [
        h('header', { key: 'head', className: 'am-group-head' }, [
          h('span', { key: 'mark', className: 'am-sysmark', 'aria-hidden': true }, initialOf(group.system)),
          h('div', { key: 'title', className: 'am-group-title' }, [
            h('h2', { key: 'name' }, group.system),
            h('div', { key: 'meta', className: 'am-group-meta', title: meta }, meta),
          ]),
          h('span', { key: 'count', className: 'am-group-count' }, group.accounts.length + ' ' + t('group.count')),
        ]),
        h('div', { key: 'cards', className: 'am-cards' }, group.accounts.map((account) => h(AccountCard, {
          key: account.id || systemKey(account) + ':' + account.username,
          account,
          t,
          revealed: revealed.has(account.id),
          onToggleReveal,
          onCopy,
          onAskDelete: () => onAskDelete(account.id),
          onCancelDelete,
          onDelete,
          confirming: confirmingId === account.id,
          deleting: deletingId === account.id,
        }))),
      ])
    }

    function EmptyState({ icon, title, body, action }) {
      return h('div', { className: 'am-empty' }, [
        h('div', { key: 'icon', className: 'am-empty-icon' }, icon),
        h('h3', { key: 'title' }, title),
        h('p', { key: 'body' }, body),
        action ? h('div', { key: 'action', className: 'am-empty-action' }, action) : null,
      ])
    }

    function Footer({ t, filePath, onCopy }) {
      if (!filePath) return null
      return h('footer', { className: 'am-footer' }, [
        h('div', { key: 'file', className: 'am-file' }, [
          h(IconFolder, { key: 'icon', size: 14 }),
          h('span', { key: 'label' }, t('file.label')),
          h('code', { key: 'path', title: filePath }, filePath),
          h('button', {
            key: 'copy',
            type: 'button',
            className: 'am-iconbtn',
            onClick: () => onCopy(filePath, 'toast.pathCopied'),
            title: t('action.copyPath'),
            'aria-label': t('action.copyPath'),
          }, h(IconCopy, { size: 13 })),
        ]),
        h('span', { key: 'plain', className: 'am-plain' }, t('file.plaintext')),
      ])
    }

    function Panel({ locale }) {
      const t = useTranslator(locale)
      const [accounts, setAccounts] = useState([])
      const [filePath, setFilePath] = useState('')
      const [loading, setLoading] = useState(true)
      const [loadError, setLoadError] = useState('')
      const [query, setQuery] = useState('')
      const [selected, setSelected] = useState(null)
      const [showAdd, setShowAdd] = useState(false)
      const [revealed, setRevealed] = useState(() => new Set())
      const [confirmingId, setConfirmingId] = useState(null)
      const [deletingId, setDeletingId] = useState(null)
      const [toast, setToast] = useToastState()

      const load = useCallback(async (signal) => {
        setLoading(true)
        setLoadError('')
        try {
          const payload = await request('/accounts', { signal })
          if (signal && signal.aborted) return
          if (!Array.isArray(payload.accounts)) {
            const invalid = new Error('accounts must be an array')
            invalid.code = 'STORE_CORRUPT'
            throw invalid
          }
          setAccounts(payload.accounts.map(normalizeAccount))
          setFilePath(typeof payload.filePath === 'string' ? payload.filePath : '')
          setLoading(false)
        } catch (error) {
          if ((signal && signal.aborted) || (error && error.name === 'AbortError')) return
          setLoading(false)
          setLoadError(describeError(t, error))
        }
      }, [t])

      useEffect(() => {
        const controller = new AbortController()
        load(controller.signal)
        return () => controller.abort()
      }, [load])

      const systemsAll = useMemo(() => groupAccounts(accounts), [accounts])

      useEffect(() => {
        if (selected && !systemsAll.some((group) => group.key === selected)) setSelected(null)
      }, [selected, systemsAll])

      const visibleAccounts = useMemo(() => {
        const normalized = query.trim().toLowerCase()
        return accounts.filter((account) => matchesQuery(account, normalized, t))
      }, [accounts, query, t])

      const groups = useMemo(() => {
        const scoped = selected
          ? visibleAccounts.filter((account) => systemKey(account) === selected)
          : visibleAccounts
        return groupAccounts(scoped)
      }, [visibleAccounts, selected])

      const toggleReveal = useCallback((id) => {
        setRevealed((current) => {
          const next = new Set(current)
          if (next.has(id)) next.delete(id)
          else next.add(id)
          return next
        })
      }, [])

      const copy = useCallback(async (value, toastKey) => {
        try {
          if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
            throw new Error('clipboard unavailable')
          }
          await navigator.clipboard.writeText(value)
          setToast({ text: t(toastKey), kind: 'ok' })
        } catch {
          setToast({ text: t('toast.copyFailed'), kind: 'error' })
        }
      }, [t, setToast])

      const addAccount = useCallback(async (input) => {
        const payload = await request('/accounts', {
          method: 'POST',
          body: JSON.stringify(input),
        })
        const account = normalizeAccount(payload.account)
        setAccounts((current) => [account].concat(current))
        setSelected(systemKey(account))
        setQuery('')
        setShowAdd(false)
        setToast({ text: t('toast.added'), kind: 'ok' })
      }, [t, setToast])

      const deleteAccount = useCallback(async (account) => {
        setDeletingId(account.id)
        try {
          await request('/accounts/delete', {
            method: 'POST',
            body: JSON.stringify({ id: account.id }),
          })
          setAccounts((current) => current.filter((item) => item.id !== account.id))
          setConfirmingId(null)
          setToast({ text: t('toast.deleted'), kind: 'ok' })
        } catch (error) {
          setToast({ text: describeError(t, error), kind: 'error' })
        } finally {
          setDeletingId(null)
        }
      }, [t, setToast])

      const closeAdd = useCallback(() => setShowAdd(false), [])
      const askDelete = useCallback((id) => setConfirmingId(id), [])
      const cancelDelete = useCallback(() => setConfirmingId(null), [])

      let content
      if (loading) {
        content = h('div', { className: 'am-skeleton' }, [
          h('div', { key: 'line', className: 'am-skel-line', style: { width: '180px' } }),
          h('div', { key: 'grid', className: 'am-skel-grid' }, [
            h('div', { key: 'a', className: 'am-skel-card' }),
            h('div', { key: 'b', className: 'am-skel-card' }),
            h('div', { key: 'c', className: 'am-skel-card' }),
          ]),
        ])
      } else if (loadError) {
        content = h(EmptyState, {
          icon: h(IconVault, { size: 24 }),
          title: t('error.load'),
          body: loadError,
          action: h('button', {
            type: 'button',
            className: 'am-btn',
            onClick: () => load(),
          }, t('action.retry')),
        })
      } else if (!accounts.length) {
        content = h(EmptyState, {
          icon: h(IconVault, { size: 24 }),
          title: t('empty.noAccountsTitle'),
          body: t('empty.noAccountsBody'),
          action: h('button', {
            type: 'button',
            className: 'am-btn primary',
            onClick: () => setShowAdd(true),
          }, [h(IconPlus, { key: 'icon', size: 15 }), h('span', { key: 'text' }, t('action.addFirst'))]),
        })
      } else if (!visibleAccounts.length) {
        content = h(EmptyState, {
          icon: h(IconSearch, { size: 24 }),
          title: t('empty.noMatchTitle'),
          body: t('empty.noMatchBody'),
          action: h('button', {
            type: 'button',
            className: 'am-btn',
            onClick: () => setQuery(''),
          }, t('action.clearSearch')),
        })
      } else if (!groups.length) {
        content = h(EmptyState, {
          icon: h(IconKey, { size: 24 }),
          title: t('empty.noSystemTitle'),
          body: t('empty.noSystemBody'),
          action: h('button', {
            type: 'button',
            className: 'am-btn primary',
            onClick: () => setShowAdd(true),
          }, [h(IconPlus, { key: 'icon', size: 15 }), h('span', { key: 'text' }, t('action.add'))]),
        })
      } else {
        content = h('div', {}, [
          query.trim() ? h('div', { key: 'results', className: 'am-resultbar' }, [
            h('span', { key: 'count' }, visibleAccounts.length + ' ' + t('search.results')),
            h('button', {
              key: 'clear',
              type: 'button',
              className: 'am-linkbtn',
              onClick: () => setQuery(''),
            }, t('search.clear')),
          ]) : null,
          ...groups.map((group) => h(GroupSection, {
            key: group.key,
            group,
            t,
            revealed,
            onToggleReveal: toggleReveal,
            onCopy: copy,
            onAskDelete: askDelete,
            onCancelDelete: cancelDelete,
            onDelete: deleteAccount,
            confirmingId,
            deletingId,
          })),
        ])
      }

      const subtitle = loading
        ? t('loading')
        : accounts.length + ' ' + t('side.accounts') + ' · ' + systemsAll.length + ' ' + t('side.systemsUnit')

      return h('div', { className: 'am-root' }, [
        h('header', { key: 'header', className: 'am-header' }, [
          h('div', { key: 'heading', className: 'am-heading' }, [
            h('h1', { key: 'title', className: 'am-title' }, t('panel.title')),
            h('p', { key: 'sub', className: 'am-sub' }, subtitle),
          ]),
          h('div', { key: 'tools', className: 'am-tools' }, [
            h('div', { key: 'search', className: 'am-search' }, [
              h(IconSearch, { key: 'icon', size: 15 }),
              h('input', {
                key: 'input',
                type: 'search',
                value: query,
                onChange: (event) => setQuery(event.target.value),
                onKeyDown: (event) => {
                  if (event.key === 'Escape' && query) setQuery('')
                },
                placeholder: t('search.placeholder'),
                'aria-label': t('a11y.search'),
              }),
              query ? h('button', {
                key: 'clear',
                type: 'button',
                className: 'am-search-clear',
                onClick: () => setQuery(''),
                title: t('search.clear'),
                'aria-label': t('search.clear'),
              }, h(IconX, { size: 14 })) : null,
            ]),
            h('button', {
              key: 'add',
              type: 'button',
              className: 'am-btn primary',
              onClick: () => setShowAdd(true),
            }, [h(IconPlus, { key: 'icon', size: 15 }), h('span', { key: 'text' }, t('action.add'))]),
          ]),
        ]),
        h('div', { key: 'body', className: 'am-body' }, [
          h('aside', { key: 'side', className: 'am-side', 'aria-label': t('side.systems') }, [
            h('div', { key: 'head', className: 'am-side-head' }, t('side.systems')),
            loading
              ? h('div', { key: 'loading', className: 'am-side-list' }, [
                h('div', { key: 'a', className: 'am-skel-side' }),
                h('div', { key: 'b', className: 'am-skel-side' }),
                h('div', { key: 'c', className: 'am-skel-side' }),
              ])
              : h('div', { key: 'list', className: 'am-side-list', role: 'group', 'aria-label': t('a11y.systemFilter') }, [
                h('button', {
                  key: 'all',
                  type: 'button',
                  className: 'am-side-item' + (selected === null ? ' active' : ''),
                  onClick: () => setSelected(null),
                  'aria-pressed': selected === null,
                }, [
                  h('span', { key: 'dot', className: 'am-side-dot', 'aria-hidden': true }),
                  h('span', { key: 'name', className: 'am-side-name' }, t('side.all')),
                  h('span', { key: 'count', className: 'am-side-count' }, String(accounts.length)),
                ]),
                ...systemsAll.map((group) => h('button', {
                  key: group.key,
                  type: 'button',
                  className: 'am-side-item' + (selected === group.key ? ' active' : ''),
                  onClick: () => setSelected(group.key),
                  'aria-pressed': selected === group.key,
                  title: group.system,
                }, [
                  h('span', { key: 'mark', className: 'am-side-mark', 'aria-hidden': true }, initialOf(group.system)),
                  h('span', { key: 'name', className: 'am-side-name' }, group.system),
                  h('span', { key: 'count', className: 'am-side-count' }, String(group.accounts.length)),
                ])),
              ]),
            h('div', { key: 'foot', className: 'am-side-foot' }, accounts.length
              ? accounts.length + ' ' + t('side.accounts')
              : t('side.empty')),
          ]),
          h('main', { key: 'main', className: 'am-main' }, h('div', { className: 'am-main-inner' }, [
            h('div', { key: 'content', className: 'am-content' }, content),
            h(Footer, {
              key: 'footer',
              t,
              filePath,
              onCopy: copy,
            }),
          ])),
        ]),
        showAdd ? h(AddDialog, {
          key: 'add-dialog',
          t,
          onClose: closeAdd,
          onSubmit: addAccount,
        }) : null,
        toast ? h('div', {
          key: 'toast',
          className: 'am-toast' + (toast.kind === 'error' ? ' error' : ''),
          role: 'status',
          'aria-live': 'polite',
        }, [
          h('span', { key: 'dot', className: 'am-toast-dot', 'aria-hidden': true }),
          h('span', { key: 'text' }, toast.text),
        ]) : null,
      ])
    }

    function SidebarIcon(props) {
      const size = (props && props.size) || 18
      return h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.8,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
        focusable: false,
      }, [
        h('rect', { key: 'a', x: 3, y: 4, width: 18, height: 16, rx: 3 }),
        h('circle', { key: 'b', cx: 9.5, cy: 12, r: 2 }),
        h('path', { key: 'c', d: 'M11.5 12H18M15 12v2.5M17.5 12v2.5' }),
      ])
    }

    class Boundary extends React.Component {
      constructor(props) {
        super(props)
        this.state = { failed: false }
      }

      static getDerivedStateFromError() {
        return { failed: true }
      }

      render() {
        if (this.state.failed) {
          const t = this.props.t || ((key) => key)
          return h('div', { className: 'am-root' }, h('div', { className: 'am-crash' }, h(EmptyState, {
            icon: h(IconVault, { size: 24 }),
            title: t('error.render'),
            body: '',
          })))
        }
        return this.props.children
      }
    }

    function apply(ctx) {
      const locale = ctx.get ? ctx.get('locale') : ctx.locale
      const slots = ctx.get ? ctx.get('slots') : ctx.slots
      if (!locale || !slots) {
        console.error('[dsh-account-manager] locale or slots service is unavailable')
        return
      }

      const style = document.createElement('style')
      style.setAttribute('data-dsh-plugin', NS)
      style.textContent = CSS
      document.head.appendChild(style)
      ctx.effect(() => () => style.remove(), NS + ': styles')

      ctx.effect(() => {
        const removeZh = locale.register(NS, 'zh', DICTS.zh)
        const removeEn = locale.register(NS, 'en', DICTS.en)
        return () => {
          removeZh()
          removeEn()
        }
      }, NS + ': dictionaries')
      const translate = locale.bind(NS)

      ctx.effect(() => slots.inject('sidebar.panellist', () => slots.register({
        name: 'sidebar.panellist',
        id: PANEL_ID,
        order: 32,
        label: () => translate('sidebar.title'),
      }, (props) => h(SidebarIcon, { size: (props && props.size) || 18 }))), NS + ': sidebar entry')

      ctx.effect(() => slots.inject('main', () => slots.register({
        name: 'main',
        key: PANEL_ID,
      }, () => h(Boundary, { t: translate }, h(Panel, { locale })))), NS + ': main page')

      console.log('[dsh-account-manager] client registered')
    }

    return {
      inject: ['slots', 'locale'],
      apply,
      __test: { DICTS, groupAccounts, maskPassword },
    }
  },
})
