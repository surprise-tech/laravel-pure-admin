本项目基于[pure-admin-thin](https://github.com/xiaoxian521/pure-admin-thin)进行进行开发, 需要配合[laravel-element-curd](https://github.com/wyzheng1997/laravel-pure-admin)一起食用

### 快速开始
```
git clone --depth 1 https://github.com/wyzheng1997/laravel-pure-admin
pnpm install
pnpm dev
```

### 更换git源
实际开发中请更换自己的git远程地址
```
git remte origin set-url demo@xxxxxxxxx.git
```

### 开发环境配置`.env.development`
```
# 项目本地运行端口号
VITE_PORT = 8848

# 开发环境读取配置文件路径
VITE_PUBLIC_PATH = /

# 开发环境代理
VITE_PROXY_DOMAIN = /admin

# 开发环境路由历史模式
VITE_ROUTER_HISTORY = "hash"

# 开发环境后端地址
VITE_PROXY_DOMAIN_REAL = "http://admin.test/admin"
```

### 表格自定义
#### 字段自定义显示
把`fieldName`替换成对应的字段名
```
<template v-slot:fieldName="{ row, custom }">
    <div>本行数据{{ row }}</div>
    <div>后端传入的数据{{ custom }}</div>
  </template>
```
#### 操作栏自定义`__actions_before__``__actions_after__`为固定值
```
<template v-slot:__actions_before__="{ row }">
  操作栏，之前{{ row.id }}
</template>
<template v-slot:__actions_after__="{ row }">
  操作栏，之后{{ row.id }}
</template>
```