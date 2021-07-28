---
title: Mimikyu开发笔记
description: 练手项目开发过程中进行的开发笔记
date: '2020-02-28T15:58:03.000Z'
---

# Mimikyu开发记录

## Mimikyu 开发笔记

### 步骤

#### github

* 新建仓库：README,.gitignore:Node,LICENSE:MIT
* git clone git@github.com:xx/xx

#### nest-admin 后台管理接口部分实现

* 参考网址：[https://docs.nestjs.com/first-steps](https://docs.nestjs.com/first-steps)
* 全局安装 nest：`yarn global add @nestjs/cli`
* 创建新 nest 项目：`nest new 项目名` For example：`nest new server`
* 推荐选择 yarn 安装项目依赖
* 进入 server 项目：`cd server`,创建子应用,用于管理后台接口：`nest g app 应用名` For example：`nest g app admin`
* 启动子应用 admin 服务：`nest start -w admin`
* 创建 lib 库，用于数据库相关公用库：`nest g lib db`,\(default:@app\)推荐输入使用`@libs`
* 在 `server\apps\admin\src\app.module.ts` 在引入 `DbModule`
* 需要连接数据库，安装所需依赖：`yarn add nestjs-typegoose @typegoose/typegoose mongoose @types/mongoose`
* 在`server\libs\db\src\db.module.ts`中使用`TypegooseModule.forRoot`链接数据库

> server\libs\db\src\db.module.ts

```typescript
  // 连接数据库
  imports: [
    TypegooseModule.forRoot('mongodb://localhost/mimikyu', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }),
  ],
```

> 附：下载安装配置Mongodb：[https://www.cnblogs.com/wuweixiong/p/12592172.html](https://www.cnblogs.com/wuweixiong/p/12592172.html)

[http://downloads.mongodb.org/win32/mongodb-win32-x86\_64-2008plus-ssl-3.6.17-signed.msi](http://downloads.mongodb.org/win32/mongodb-win32-x86_64-2008plus-ssl-3.6.17-signed.msi)

* 新建 models 文件夹存放所有数据库模型：`server\libs\db\src\models`
* 新建`server\libs\db\src\models\user.mdel.ts`存放用户数据库模型

> server\libs\db\src\models\user.mdel.ts

```typescript
import { prop } from "@typegoose/typegoose"; // 使用prop装饰数据库模型属性

export class User {
  @prop()
  username: string; // 属性
  @prop()
  password: string; // 属性
}
```

* 可以通过在`server\libs\db\src\db.module.ts`在使用`@Global()`将其标志为全局，并将 `server\libs\db\src\db.module.ts`导入，以通过全局使用
* 在 admin 层级下创建 users 子模块，去管理 user 模型：`nest g mo -p admin users`
* 在 admin 层级下创建 users 控制器：`nest g co -p admin users`
* 为方便使用数据库的增删改查，安装依赖：`yarn add nestjs-mongoose-crud`
* 在`server\apps\admin\src\users\users.controller.ts`中使用`@InjectModel(User) private readonly model`输入模型，引入 User 模型
* 使用 Crud 为对应模型快捷建立增删改查

> server\apps\admin\src\users\users.controller.ts

```typescript
@Crud({
    model: User
})
```

* 安装接口文档依赖：`yarn add @nestjs/swagger swagger-ui-express`
* 可以尝试 GET 请求`http://localhost:3000/users`测试是否正常
* 参考：`https://docs.nestjs.com/recipes/swagger`在`server\apps\admin\src\main.ts`中使用 swagger

> server\apps\admin\src\main.ts

```typescript
import { Module, Global } from "@nestjs/common";
import { DbService } from "./db.service";
import { TypegooseModule } from "nestjs-typegoose";
import { User } from "./models/user.mdel";

const models = TypegooseModule.forFeature([User]);

@Global() // 使用Global将当前文件标志为全局使用
@Module({
  // 连接数据库
  imports: [
    TypegooseModule.forRoot("mongodb://localhost/mimikyu", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    }),
    models // 导入模型
  ],
  providers: [DbService],
  exports: [DbService, models] // 导出模型
})
export class DbModule {}
```

* 可以使用 `@ApiUseTags` 为`server\apps\admin\src\users\users.controller.ts`的控制器添加标签

> server\apps\admin\src\users\users.controller.ts

```typescript
@ApiUseTags('用户') // 标签，用于Swagger
```

* 可以使用`@ApiModelProperty`为`server\libs\db\src\models\user.mdel.ts`添加描述

> server\libs\db\src\models\user.mdel.ts

```typescript
  @ApiModelProperty({ description: '用户名', example: 'testName' }) // 添加描述，作用于swagger文档
```

* 可以在模型中使用`@modelOptions`为模型中的各个属性都添加指定的额外属性

> server\libs\db\src\models\user.mdel.ts

```typescript
@modelOptions({
  schemaOptions:{
    timestamps:true
  }
})
```

* 由于课程中可以包含多个课时，所有可以新建课程模型\(`server\libs\db\src\models\course.model.ts`\)及课时模型\(`server\libs\db\src\models\episodes.model.ts`\),将课时模型引入并内嵌到课程模型中，作为其下的一个属性。

> server\libs\db\src\models\course.model.ts

```typescript
  @ApiModelProperty({ description: '课程' }) // 添加描述，作用于swagger文档
  @arrayProp({ itemsRef: 'Episode' }) // 使用arrayProp表示该属性为数组字段,通过itemsRef可以指定属性的参考模型
  episodes: Ref<Episode>[]; // Ref表示参考类型，定义为泛型,此处引入Episode模型，将其（课时）内嵌在课程中
```

* 类似创建 users 子模块的方法，使用`nest g mo -p admin courses`创建 courses 子模块，用于管理 course 模型
* 同样地，使用`nest g co -p admin courses`创建 courses 子模块的控制器
* 同样地，在`server\apps\admin\src\courses\courses.controller.ts`中添加`@Crud`，快捷添加增删改查

> server\apps\admin\src\courses\courses.controller.ts

```typescript
@Crud({
    model: Course
})
```

* 在`server\apps\admin\src\courses\courses.controller.ts`控制器中注入 Course 模型

> server\apps\admin\src\courses\courses.controller.ts

```typescript
    @InjectModel(Course) private readonly model: ReturnModelType<typeof Course>,
  ) {} // 使用@InjectModel注入模型，最后也可以使用ReturnModelType<typeof Course>定义改模型类型
```

* 可以为该控制器添加`@ApiUseTags('课程')`作为其 swagger 的分类
* 同样地，需要在`server\libs\db\src\db.module.ts`引入上面创建的 Course 及 Episode 模型才能正常使用

> server\libs\db\src\db.module.ts

```typescript
const models = TypegooseModule.forFeature([User, Course, Episode]); // 引入模型
```

* 和创建课程子模块一样，使用`nest g mo -p admin episodes`创建课时模块
* 和创建课程控制器一样，使用`nest g co -p admin episodes`创建课时控制器
* 同样地，添加`@Crud({model: Episode})`为 Episode 模型快捷添加增删改查操作
* 同样地，通过注入的方式，引入 Episode 模型

> server\apps\admin\src\episodes\episodes.controller.ts

```typescript
constructor(
    @InjectModel(Episode) private readonly model:ReturnModelType<typeof Episode>
){}
```

* 最后，可以使用`@ApiUseTags('课时')`为该控制器添加 swagger 标签

#### vue-admin 后台管理界面部分实现

> 温馨提示：遇事不决，重启为上。新建了 xx.d.ts，还是提示找不到模块？重启项目吧。console.log\(\)报错？试试 global.console.log\(\)

* `vue create admin` 使用默认方式创建即可
* `cd admin`
* 使用 ts 的方式编写项目：`vue add typescript`
* 添加 element：`vue add element` 若`Still proced? y` `Fully import` `SCSS variables? No` `zh-CN`
* `vue add router`,`Use history ... ? n`
* `vue add typescript`,`Use class-style ...syntax? Yes` `Use Babel ...JSX)? Yes` `Convert all .js ...ts? Yes` `Allow ...compiled? No`
* 注意修改`admin\src\main.ts`中的引入 element 为引入 ts 而不是 ts,`import './plugins/element'`即可
* 适当修改`admin\src\App.vue`

> admin\src\App.vue

```markup
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";

  @Component({})
  export default class App extends Vue {}
</script>

<style>
  body {
    padding: 0;
    margin: 0;
  }
</style>
```

* 创建主要布局容器`admin\src\views\Main.vue`,可以通过在 vscode 中安装`Element UI Snippets`插件，输入`elcon`即可扩展为 element 的默认布局，输入`elmen`则可扩展出 element 的菜单。

```text
vue add element
```

> admin\src\views\Main.vue

```markup
<template>
  <el-container>
    <el-aside width="200px">
      <!-- 此处可以使用elmen扩展出element菜单 -->
      菜单
      <!-- Aside content -->
    </el-aside>
    <el-container>
      <el-header height>
        Mimkyue - 后台管理界面
        <!-- Header content -->
      </el-header>
      <el-main height>
        <!-- Main content -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
  // 上面使用lang="ts"标记为ts语法
  import { Vue, Component } from "vue-property-decorator";

  @Component({}) // 使用@Component标注其为组件
  export default class Main extends Vue {}
</script>

<style></style>
```

* 在`admin\src\views\Main.vue`中使用`router-view`后，需要到`admin\src\router\index.ts`中加上且作为其他路由的父级

```text
vue add router
```

> admin\src\router\index.ts

```typescript
import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: "/",
    component: () => import("../views/Main.vue"), // 懒加载，加快页面加载速度
    children: [
      {
        path: "/",
        name: "home",
        component: () => import("../views/Home.vue")
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
```

* 适当改造`admin\src\views\Main.vue`

> admin\src\views\Main.vue

```markup
<template>
  <el-container>
    <el-aside width="200px">
      <el-menu
        mode="vertical"
        style="height:100vh"
        :default-active="$router.path"
        router
      >
        <el-submenu
          v-for="(item, index) in menu.items"
          :index="`menu-item-${index}`"
          :key="`menu-item-${index}`"
        >
          <template slot="title">{{ item.title }}</template>
          <el-menu-item
            v-for="(subItem, subIndex) in item.items"
            :key="`menu-item-${index}-${subIndex}`"
            :index="subItem.path"
            >{{ subItem.title }}</el-menu-item
          >
        </el-submenu>
      </el-menu>

      <!-- Aside content -->
    </el-aside>
    <el-container>
      <el-header height>
        <h3>Mimkyue - 后台管理界面</h3>
        <!-- Header content -->
      </el-header>
      <el-main height>
        <!-- Main content -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
  // 使用ts
  import { Vue, Component } from "vue-property-decorator";

  @Component({}) // 使用@Component标注其为组件
  export default class Main extends Vue {
    menu = {
      items: [
        {
          title: "内容管理",
          items: [
            {
              title: "首页",
              path: "/"
            },
            {
              title: "课程管理",
              path: "/courses/list"
            },
            {
              title: "课时管理",
              path: "/courses/create"
            }
          ]
        },
        {
          title: "运营管理",
          items: [
            {
              title: "用户管理",
              path: "/users/list"
            }
          ]
        }
      ]
    };
  }
</script>

<style></style>
```

* 在 admin 中`yarn add axios @types/axios`，因为 axios 在 js 的包，所以需要加上`@types/axios`以起到代码提示作用，并在`admin\src\main.ts`中引入 axios 及创建其对应的全局变量$http

> admin\src\main.ts

```typescript
import Vue from "vue";
import App from "./App.vue";
import "./plugins/element";
import router from "./router";
import axios from "axios"; // 引入axios

Vue.config.productionTip = false;

// 使axios以$http的形式在全局使用，通过创建实例，将axios的请求与服务端地址对接
Vue.prototype.$http = axios.create({
  baseURL: "http://localhost:3000"
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
```

* 新建课程列表组件`admin\src\views\courses\CourseList.vue`。请求列表的时候，若提示跨域，需要在`server\apps\admin\src\main.ts`中加上`app.enableCors();`以允许跨域

> admin\src\views\courses\CourseList.vue

```markup
<template>
  <div>
    <h3>课程列表</h3>
    <el-table :data="data.data" border stripe>
      <el-table-column
        v-for="(field, name) in fields"
        :prop="name"
        :key="name"
        :label="field.label"
        :width="field.width"
      >
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";

  @Component({})
  export default class CourseList extends Vue {
    data = {};
    fields = {
      _id: { label: "ID" },
      name: { label: "课程名称" },
      cover: { label: "课程封面图" }
    };

    async fetch() {
      const res = await this.$http.get("courses");
      this.data = res.data;
    }

    created() {
      this.fetch();
    }
  }
</script>

<style></style>
```

> server\apps\admin\src\main.ts

```typescript
import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const options = new DocumentBuilder()
    .setTitle("Mimikyu后台管理API")
    .setDescription("供后台界面调用的服务端API")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api-docs", app, document);

  await app.listen(3000);
  console.log("api-docs is working  http://localhost:3000/api-docs");
}
bootstrap();
```

* 在路由中加入课程列表组件作为与 home 同级的子路由

> admin\src\router\index.ts

```typescript
...
{
  name: "course-list",
  path: "/course/list",
  component: () => import("../views/courses/CourseList.vue")
}
...
```

* 解决当前`admin\src\main.ts`及`admin\src\router\index.ts`等文件报错，在`admin\src\shims-vue.d.ts`同级目录下，新建`admin\src\custom-vue.d.ts`,代码如下

> admin\src\shims-vue.d.ts

```typescript
declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

// 该部分copy到admin\src\custom-vue.d.ts中去
// import Vue from "vue";
// import { AxiosInstance } from "axios";
// declare module "vue/types/vue" {
//   interface Vue {
//     $http: AxiosInstance;
//   }
// }
```

> admin\src\custom-vue.d.ts

```typescript
import Vue from "vue";
import { AxiosInstance } from "axios";
declare module "vue/types/vue" {
  interface Vue {
    $http: AxiosInstance;
  }
}
```

* 完成上述两个文件的编程后，若`admin\src\views\courses\CourseList.vue`中的`$http`报错，可以按`F1`键，输入`重新加载窗口`并回车确认，即可。
* 新建编辑（创建）课程组件`admin\src\views\courses\CourseEdit.vue`,其中使用了[`vue-ele-form`](https://www.npmjs.com/package/vue-ele-form)组件，需要`yarn add vue-ele-form`，并在`admin\src\main.ts`中注册使用，注册 vue-ele-form 后，由于 vue-ele-form 不是基于 ts 语言开发的，因此若遇到提示`无法找到模块“vue-ele-form”的声明文件。`，则需要去声明一下。在`admin\src\main.ts`同级目录下新建`admin\src\packages.d.ts`,输入下方代码去声明该模块，每当调整 x.d.ts 文件时，推荐重启项目。

`yarn add vue-ele-form`

> admin\src\main.ts

```typescript
...
import EleForm from 'vue-ele-form' // 引入
...
Vue.use(EleForm) // 注册
...
```

> admin\src\packages.d.ts

```typescript
declare module "vue-ele-form" {
  export const install: () => any;
}
```

> admin\src\views\courses\CourseEdit.vue

```markup
<template>
  <div>
    <h3>{{ isNew ? "创建" : "编辑" }}课程</h3>
    <ele-form :form-data="data" :form-desc="fields" :request-fn="submit">
    </ele-form>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from "vue-property-decorator";

  @Component({})
  export default class CourseEdit extends Vue {
    // 可通过在路由中定义props:true，且带上:id作为参数，则可在当前页面通过@Prop获取到路由携带的id参数（注意：由于id初始化时没有赋值，需要在冒号前加上!，形成id!:string）
    @Prop(String) id!: string;
    data = {};
    fields = {
      name: { label: "课程名称", type: "input" },
      cover: { label: "课程封面图", type: "input" }
    };

    // --- 计算属性 ---
    // 没有id，则为创建，为new，相反有id，则为编辑。
    get isNew() {
      return !this.id;
    }

    async submit(data) {
      // 在此无法使用console.log()，故加上global，全局使用
      // global.console.log("data:", data);

      const url = this.isNew ? `courses` : `courses/${this.id}`; // 区分创建还是编辑的url
      const method = this.isNew ? "post" : "put"; // 区分创建还是编辑的请求方式
      await this.$http[method](url, data);
      this.$message.success("保存成功!");
      this.data = {};
      this.$router.go(-1);
    }

    async fetch() {
      const res = await this.$http.get(`courses/${this.id}`); // 获取路由中携带的id作为查询条件，获取该id对应的数据，作为编辑操作时的默认值
      this.data = res.data;
    }

    created() {
      !this.isNew && this.fetch(); // 若不能创建，则请求数据作为默认值
    }
  }
</script>

<style></style>
```

* 在`admin\src\router\index.ts`路由文件中加入上述组件作为与`course-list`同级的路由。

> admin\src\router\index.ts

```typescript
...
{
  name: "course-list",
  path: "/courses/list",
  component: () => import("../views/courses/CourseList.vue")
},
{
  name: "course-edit",
  path: "/courses/edit/:id", // 在路由带上id作为参数，以确定编辑哪个列表
  component: () => import("../views/courses/CourseEdit.vue"),
  props:true, // 允许当前路由接受参数
},
{
  name: "course-create",
  path: "/courses/create",
  component: () => import("../views/courses/CourseEdit.vue")
}
...
```

* 此时，由于上述`course-edit`与`course-create`引用了同一个组件，可能回导致两个路由切换时不会更新数据，因此需要修改一下`admin\src\views\Main.vue`

> 在 router-view 中，以$route.path 为 key，防止切换不同路由，相同组件间出现数据不更新问题

```markup
...
<el-main height>
  <!-- Main content -->
  <router-view :key="$route.path"></router-view>
</el-main>
...
```

* 为`admin\src\views\courses\CourseList.vue`加上编辑删除模块,输入`eltc`可扩展成，其他如下代码所示，主要新增的有 3 点。

> admin\src\views\courses\CourseList.vue

```markup
<template>
  <div>
    <h3>课程列表</h3>
    <!-- 1.添加跳转至新增 -->
    <div>
      <el-button
        type="success"
        size="small"
        @click="$router.push('/courses/create')"
        >创建课程</el-button
      >
    </div>
    <el-table :data="data.data" border stripe>
      <el-table-column
        v-for="(field, name) in fields"
        :prop="name"
        :key="name"
        :label="field.label"
        :width="field.width"
      >
      </el-table-column>
      <!-- 2. 添加“编辑”，“删除” -->
      <el-table-column label="操作" :width="200">
        <template v-slot="{ row }">
          <el-button
            size="small"
            type="success"
            @click="$router.push(`/courses/edit/${row._id}`)"
            >编辑</el-button
          >
          <el-button size="small" type="danger" @click="remove(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";

  @Component({})
  export default class CourseList extends Vue {
    data = {};
    fields = {
      _id: { label: "ID" },
      name: { label: "课程名称" },
      cover: { label: "课程封面图" }
    };

    async fetch() {
      const res = await this.$http.get("courses");
      this.data = res.data;
    }
    // 3. 加上对应的“删除”功能
    async remove(row) {
      try {
        await this.$confirm("是否确认删除?");
      } catch (e) {
        return;
      }
      await this.$http.delete(`courses/${row._id}`);
      this.$message.success("删除成功");
      this.fetch();
    }

    created() {
      this.fetch();
    }
  }
</script>

<style></style>
```

* 使用[Avue](https://avuejs.com/doc/installation)改造 CRUD，先安装 avue，`yarn add @smallwei/avue`,可以先创建`admin\src\plugins\avue.ts`,输入下方代码，若报“找不到模块”错误，则到`admin\src\packages.d.ts`加入下方代码，最后到`admin\src\main.ts`引入。在`admin\src\main.ts`,由于使用了 Avue 进行改造，因此，可以去掉 vue-ele-form，代码如下。完成了 avue 的引入，则可以参考[Avue 文档](https://avuejs.com/doc/crud/crud-doc)来创建`admin\src\views\courses\CourseCrud.vue`,最后，`admin\src\router\index.ts`路由也需要改造，代码如下。

> admin\src\plugins\avue.ts

```typescript
import Vue from "vue";
import Avue from "@smallwei/avue";
import "@smallwei/avue/lib/index.css";
Vue.use(Avue);
```

> admin\src\packages.d.ts

```typescript
declare module "vue-ele-form" {
  export const install: () => any;
}

// 由于引入了基于js的@smallwei/avue，所以加上这行代码
declare module "@smallwei/avue" {
  export const install: () => any;
}
```

> admin\src\main.ts

```typescript
import Vue from "vue";
import App from "./App.vue";
import "./plugins/element";
import router from "./router";
import axios from "axios"; // 引入axios
// import EleForm from "vue-ele-form"; // 引入了Avue，因此不需要
import "./plugins/avue"; // 引入Avue

Vue.config.productionTip = false;

// 使axios以$http的形式在全局使用，通过创建实例，将axios的请求与服务端地址对接
Vue.prototype.$http = axios.create({
  baseURL: "http://localhost:3000"
});

// 注册 vue-ele-form
// Vue.use(EleForm); // 引入了Avue，因此不需要

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
```

> admin\src\views\courses\CourseCrud.vue

```markup
<template>
  <div>
    <avue-crud
      :data="data.data"
      :option="option"
      @row-save="create"
      @row-update="update"
      @row-del="remove"
    ></avue-crud>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";

  @Component({})
  export default class CourseList extends Vue {
    data = {};
    option = {
      title: "课程管理",
      column: [
        {
          prop: "name",
          label: "课程名称"
        },
        {
          prop: "cover",
          label: "课程封面图"
        }
      ]
    };
    async fetch() {
      const res = await this.$http.get("courses");
      this.data = res.data;
    }

    async create(row, done, loading) {
      await this.$http.post("courses", row);
      this.$message.success("创建成功");
      this.fetch();
      done(); // 停止加载，关闭弹窗
    }

    async update(row, index, done, loading) {
      const data = JSON.parse(JSON.stringify(row)); //先把对象转字符串，再把字符串转对象，达到复制row而不影响row的效果。
      delete data.$index; // update请求会把index作为数据，类似{ $index:1,... }发送到接口，因此请求前需要清除该字段
      await this.$http.put(`courses/${row._id}`, data);
      this.$message.success("更新成功");
      this.fetch();
      done(); // 停止加载，关闭弹窗
    }

    async remove(row) {
      try {
        await this.$confirm("是否确认删除?");
      } catch (e) {
        return;
      }
      await this.$http.delete(`courses/${row._id}`);
      this.$message.success("删除成功");
      this.fetch();
    }

    created() {
      this.fetch();
    }
  }
</script>

<style></style>
```

> admin\src\router\index.ts

```typescript
import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: "/",
    component: () => import("../views/Main.vue"), // 懒加载，加快页面加载速度
    children: [
      {
        name: "home",
        path: "/",
        component: () => import("../views/Home.vue")
      },
      {
        name: "course-crud",
        path: "/course/list",
        component: () => import("../views/courses/CourseCrud.vue")
      }
      // {
      //   name: "course-list",
      //   path: "/courses/list",
      //   component: () => import("../views/courses/CourseList.vue")
      // },
      // {
      //   name: "course-edit",
      //   path: "/courses/edit/:id", // 在路由带上id作为参数，以确定编辑哪个列表
      //   component: () => import("../views/courses/CourseEdit.vue"),
      //   props: true // 允许当前路由接受参数
      // },
      // {
      //   name: "course-create",
      //   path: "/courses/create",
      //   component: () => import("../views/courses/CourseEdit.vue")
      // }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
```

* 进一步使用 Avue 改造组件，从上述的`admin\src\plugins\avue.ts`中可知，可以通过改变`option`的默认值及接口请求地址来提高复用性，该步骤先改变 option，先在服务端的`server\apps\admin\src\courses\courses.controller.ts`加上 option 的 GET 请求，代码如下。在修改接口请求地址前，需要先改造`admin\src\router\index.ts`,代码如下。然后为`admin\src\views\courses\CourseCrud.vue`加上对应请求并将请求地址根据当前页面路由地址动态改变，最终代码如下。

> server\apps\admin\src\courses\courses.controller.ts

```typescript
import { Controller, Get } from "@nestjs/common";
import { Crud } from "nestjs-mongoose-crud";
import { Course } from "@libs/db/models/course.model";
import { InjectModel } from "nestjs-typegoose";
import { ReturnModelType } from "@typegoose/typegoose";
import { ApiUseTags } from "@nestjs/swagger";

@Crud({
  model: Course
})
@Controller("courses")
@ApiUseTags("课程") // 为其添加分类，作用于swagger
export class CoursesController {
  constructor(
    @InjectModel(Course) private readonly model: ReturnModelType<typeof Course>
  ) {} // 使用@InjectModel注入模型，最后也可以使用ReturnModelType<typeof Course>定义改模型类型
  @Get("option") // courses的子路由，请求方式为get，即是localhost:3000/courses/option
  option() {
    // 函数名称不影响，类型@Watch()写法
    return {
      title: "课程管理",
      column: [
        {
          prop: "name",
          label: "课程名称"
        },
        {
          prop: "cover",
          label: "课程封面图"
        }
      ]
    };
  }
}
```

> admin\src\router\index.ts

```typescript
import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: "/",
    component: () => import("../views/Main.vue"), // 懒加载，加快页面加载速度
    children: [
      {
        name: "home",
        path: "/",
        component: () => import("../views/Home.vue")
      },
      {
        name: "resource-crud",
        path: "/:resource/list", // :resource 可以被Prop获取到
        component: () => import("../views/courses/CourseCrud.vue"),
        props: true
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
```

> admin\src\views\courses\CourseCrud.vue

```markup
<template>
  <div>
    <!-- 有option.column再显示，即请求接口获取option所需数据再显示 -->
    <avue-crud
      v-if="option.column"
      :data="data.data"
      :option="option"
      @row-save="create"
      @row-update="update"
      @row-del="remove"
    ></avue-crud>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from "vue-property-decorator";

  @Component({})
  export default class ResourceList extends Vue {
    @Prop(String) resource: string;

    data = {};
    option = {};
    async fetch() {
      const res = await this.$http.get(`${this.resource}`);
      this.data = res.data;
    }

    async fetchOption() {
      const res = await this.$http.get(`${this.resource}/option`);
      this.option = res.data;
    }

    async create(row, done, loading) {
      await this.$http.post(`${this.resource}`, row);
      this.$message.success("创建成功");
      this.fetch();
      done(); // 停止加载，关闭弹窗
    }

    async update(row, index, done, loading) {
      const data = JSON.parse(JSON.stringify(row)); //先把对象转字符串，再把字符串转对象，达到复制row而不影响row的效果。
      delete data.$index; // update请求会把index作为数据，类似{ $index:1,... }发送到接口，因此请求前需要清除该字段
      await this.$http.put(`${this.resource}/${row._id}`, data);
      this.$message.success("更新成功");
      this.fetch();
      done(); // 停止加载，关闭弹窗
    }

    async remove(row) {
      try {
        await this.$confirm("是否确认删除?");
      } catch (e) {
        return;
      }
      await this.$http.delete(`${this.resource}/${row._id}`);
      this.$message.success("删除成功");
      this.fetch();
    }

    created() {
      this.fetchOption();
      this.fetch();
    }
  }
</script>

<style></style>
```

* 同样地，按照上述步骤，可以增加课时管理的组件，首先改造`admin\src\views\Main.vue`,将其中的请求地址修正。然后在服务端`server\apps\admin\src\episodes\episodes.controller.ts`增加类似上述的接口,同样地，也可以修改`server\apps\admin\src\users\users.controller.ts`。此时，可以修改一下`admin\src\views\courses\CourseCrud.vue`为`admin\src\views\ResourceCrud.vue`,并修改其对应的路由`admin\src\router\index.ts`。

> admin\src\views\Main.vue

```typescript
... { title: "课时管理", path: "/episodes/list" } ...
```

> server\apps\admin\src\episodes\episodes.controller.ts

```typescript
import { Controller, Get } from "@nestjs/common";
import { Crud } from "nestjs-mongoose-crud";
import { Episode } from "@libs/db/models/episodes.model";
import { InjectModel } from "nestjs-typegoose";
import { ReturnModelType } from "@typegoose/typegoose";
import { ApiUseTags } from "@nestjs/swagger";

@Crud({
  model: Episode
})
@Controller("episodes")
@ApiUseTags("课时") // 添加swagger标签
export class EpisodesController {
  constructor(
    @InjectModel(Episode)
    private readonly model: ReturnModelType<typeof Episode>
  ) {}

  @Get("option")
  option() {
    return {
      title: "课时管理",
      column: [
        {
          prop: "name",
          label: "课时名称"
        },
        {
          prop: "file",
          label: "课时文件"
        }
      ]
    };
  }
}
```

> server\apps\admin\src\users\users.controller.ts

```typescript
...
  @Get('option')
  option() {
    return {
      title: '用户管理',
      column: [
        {
          prop: 'username',
          label: '用户名称',
        },
      ],
    };
  }
...
```

* 为组件增加分页效果，需要增加`@on-load="changePage"`，`query`及修改`fetch`请求，修改`admin\src\views\ResourceCrud.vue`

> admin\src\views\ResourceCrud.vue

```markup
<template>
  <div>
    <!-- 有option.column再显示，即请求接口获取option所需数据再显示 -->
    <avue-crud
      v-if="option.column"
      :page="page"
      :data="data.data"
      :option="option"
      @row-save="create"
      @row-update="update"
      @row-del="remove"
      @on-load="changePage"
    ></avue-crud>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from "vue-property-decorator";

  @Component({})
  export default class ResourceList extends Vue {
    @Prop(String) resource: string;

    data: any = {};
    option: any = {};
    page: any = {
      pageSize: 2, // 默认每页显示
      pageSizes: [2, 5, 10], // 下拉选项。2条每页，5条每页，10条每页
      total: 0
    };
    query: any = {
      limit: 2 // 限制每页显示条数
    };

    async fetch() {
      const res = await this.$http.get(`${this.resource}`, {
        params: {
          query: this.query
        }
      });
      this.page.total = res.data.total; // 获取总数
      this.data = res.data;
    }

    async fetchOption() {
      const res = await this.$http.get(`${this.resource}/option`);
      this.option = res.data;
    }

    async changePage({ pageSize, currentPage }) {
      this.query.page = currentPage;
      this.query.limit = pageSize;
      this.fetch();
    }

    async create(row, done, loading) {
      await this.$http.post(`${this.resource}`, row);
      this.$message.success("创建成功");
      this.fetch();
      done(); // 停止加载，关闭弹窗
    }

    async update(row, index, done, loading) {
      const data = JSON.parse(JSON.stringify(row)); //先把对象转字符串，再把字符串转对象，达到复制row而不影响row的效果。
      delete data.$index; // update请求会把index作为数据，类似{ $index:1,... }发送到接口，因此请求前需要清除该字段
      await this.$http.put(`${this.resource}/${row._id}`, data);
      this.$message.success("更新成功");
      this.fetch();
      done(); // 停止加载，关闭弹窗
    }

    async remove(row) {
      try {
        await this.$confirm("是否确认删除?");
      } catch (e) {
        return;
      }
      await this.$http.delete(`${this.resource}/${row._id}`);
      this.$message.success("删除成功");
      this.fetch();
    }

    created() {
      this.fetchOption();
      this.fetch();
    }
  }
</script>

<style></style>
```

* 为组件增加排序功能，首先由于定义表格在后端，因此需要修改服务端，如`server\apps\admin\src\courses\courses.controller.ts`中加上`sortable:true`，然后修改`admin\src\views\ResourceCrud.vue`，为其增加`@sort-change="changeSort"`及对应变量及函数。

> server\apps\admin\src\courses\courses.controller.ts

```typescript
...
option() {
  // 函数名称不影响，类型@Watch()写法
  return {
    title: '课程管理',
    column: [
      {
        prop: 'name',
        label: '课程名称',
        sortable:true // 允许排序
      },
      {
        prop: 'cover',
        label: '课程封面图',
      },
    ],
  };
}
...
```

> admin\src\views\ResourceCrud.vue

```markup
<template>
  <div>
    <!-- 有option.column再显示，即请求接口获取option所需数据再显示 -->
    <avue-crud
      v-if="option.column"
      :page="page"
      :data="data.data"
      :option="option"
      @row-save="create"
      @row-update="update"
      @row-del="remove"
      @on-load="changePage"
      @sort-change="changeSort"
    ></avue-crud>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from "vue-property-decorator";

  @Component({})
  export default class ResourceList extends Vue {
    @Prop(String) resource: string;

    data: any = {};
    option: any = {};
    page: any = {
      pageSize: 2, // 默认每页显示
      pageSizes: [2, 5, 10], // 下拉选项。2条每页，5条每页，10条每页
      total: 0
    };
    query: any = {
      sort: {},
      // sort: {
      //   _id: -1
      // }, // 按_id排序，-1为倒序，1为正序
      limit: 2 // 限制每页显示条数
    };

    async fetch() {
      const res = await this.$http.get(`${this.resource}`, {
        params: {
          query: this.query
        }
      });
      this.page.total = res.data.total; // 获取总数
      this.data = res.data;
    }

    async fetchOption() {
      const res = await this.$http.get(`${this.resource}/option`);
      this.option = res.data;
    }

    async changePage({ pageSize, currentPage }) {
      this.query.page = currentPage;
      this.query.limit = pageSize;
      this.fetch();
    }

    async changeSort({ prop, order }) {
      if (!order) {
        this.query.sort = null;
      } else {
        this.query.sort = {
          [prop]: order === "ascending" ? 1 : -1
        };
      }
      this.fetch();
    }

    async create(row, done, loading) {
      await this.$http.post(`${this.resource}`, row);
      this.$message.success("创建成功");
      this.fetch();
      done(); // 停止加载，关闭弹窗
    }

    async update(row, index, done, loading) {
      const data = JSON.parse(JSON.stringify(row)); //先把对象转字符串，再把字符串转对象，达到复制row而不影响row的效果。
      delete data.$index; // update请求会把index作为数据，类似{ $index:1,... }发送到接口，因此请求前需要清除该字段
      await this.$http.put(`${this.resource}/${row._id}`, data);
      this.$message.success("更新成功");
      this.fetch();
      done(); // 停止加载，关闭弹窗
    }

    async remove(row) {
      try {
        await this.$confirm("是否确认删除?");
      } catch (e) {
        return;
      }
      await this.$http.delete(`${this.resource}/${row._id}`);
      this.$message.success("删除成功");
      this.fetch();
    }

    created() {
      this.fetchOption();
      this.fetch();
    }
  }
</script>

<style></style>
```

* 为组件增加搜索及模糊查询功能。依然需要先在后端加上`search：true`，也可以按需加上`regex: true,`，例如：`server\apps\admin\src\courses\courses.controller.ts`。然后在组件中增加监听搜索功能`@search-change="search"`。

> server\apps\admin\src\courses\courses.controller.ts

```typescript
import { Controller, Get } from "@nestjs/common";
import { Crud } from "nestjs-mongoose-crud";
import { Course } from "@libs/db/models/course.model";
import { InjectModel } from "nestjs-typegoose";
import { ReturnModelType } from "@typegoose/typegoose";
import { ApiUseTags } from "@nestjs/swagger";

@Crud({
  model: Course
})
@Controller("courses")
@ApiUseTags("课程") // 为其添加分类，作用于swagger
export class CoursesController {
  constructor(
    @InjectModel(Course) private readonly model: ReturnModelType<typeof Course>
  ) {} // 使用@InjectModel注入模型，最后也可以使用ReturnModelType<typeof Course>定义改模型类型
  @Get("option") // courses的子路由，请求方式为get，即是localhost:3000/courses/option
  option() {
    // 函数名称不影响，类型@Watch()写法
    return {
      title: "课程管理",
      column: [
        {
          prop: "name",
          label: "课程名称",
          sortable: true, // 允许排序
          search: true, // 增加搜索框
          regex: true, // 允许通过正则表达式搜索，即支持模糊查询
        },
        {
          prop: "cover",
          label: "课程封面图"
        }
      ]
    };
  }
```

> admin\src\views\ResourceCrud.vue

```markup

```

--- _待更新_ ---

## Q&A

> 参考资料：全栈之巅

