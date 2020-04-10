# Vue 编辑动态渲染功能记录

## 应用背景
### 原型样式
开发一款利用 `vue`  模板语法进行动态解析和预览的编辑器，大概的样子如下：

![image.png](https://cdn.nlark.com/yuque/0/2020/png/204082/1583974657961-c15c4df1-6281-450a-8107-3c7d4e2a15c6.png?x-oss-process=image/resize,w_746/watermark,type_d3F5LW1pY3JvaGVp,size_14,text_S2luZ1QncyBGRQ==,color_FFFFFF,shadow_50,t_80,g_se,x_10,y_10)


参考页面：[https://run.iviewui.com/](https://run.iviewui.com/)  （iview 的一款产品）



### 基本功能

#### 模板编辑和预览

- vue 模板语法的编辑，并可对其进行解析和动态渲染，实时预览

#### 模板加载和保存

- 模板除了可编辑，还可以从后端接口中加载，当然编辑的模板还要可以保存

#### 输出模板的渲染文本

- 这些被解析出来的页面，最后要再次解析产出一个页面的纯文本（HTML 字符串），提供给其他项目做打印



### 注意点

由于打印功能用到的浏览器是 `IE` ，所以要求最后输出的 HTML 文本字符串解析后可以兼容 `IE8` ，要注意写 HTML 和 CSS 时采用的语法标准不能太高。

对于不确定的语法，可以去该网站查看是否兼容：[https://www.caniuse.com/](https://www.caniuse.com/)

![image.png](https://cdn.nlark.com/yuque/0/2020/png/204082/1583975088616-475cc1d5-178a-4baf-b7bf-231cf3b950a8.png?x-oss-process=image/resize,w_746/watermark,type_d3F5LW1pY3JvaGVp,size_14,text_S2luZ1QncyBGRQ==,color_FFFFFF,shadow_50,t_80,g_se,x_10,y_10)







## Demo 实现 

> 参考资料：[https://blog.csdn.net/WangYangsea/article/details/95237722?tdsourcetag=s_pctim_aiomsg](https://blog.csdn.net/WangYangsea/article/details/95237722?tdsourcetag=s_pctim_aiomsg)

以改资料中提供的开源种子项目作为基础，稍作修改完成如下功能：

- 模板编辑 | 模板动态渲染预览 （项目已实现）
- 增加模板解析成文本的功能



### 启动项目

> 项目地址：[https://github.com/wangyangsea/vue-run](https://github.com/wangyangsea/vue-run)


先将项目 `clone`  或下载到本地，然后安装该项目的依赖： `npm i`  

若出现安装依赖时的报错，切提示内容与 `node-sass` 有关，则用 `cnpm i node-sass` 解决该包下载地址被墙的问题（也可以切换下载源为淘宝镜像地址）

最后执行 `npm run dev` 就可以启动项目

该项目的目录列表
![image.png](https://cdn.nlark.com/yuque/0/2020/png/204082/1583975773509-5bbe4881-0b04-4cd8-b518-ccc9591fa25b.png)





### 核心实现

改项目已经对 `模板编辑和模板渲染` 进行了实现，主要涉及到3个文件

- `index.vue` 主组件
- `edit.vue` 模板编辑器
- `running.vue` 模板解析器

![image.png](https://cdn.nlark.com/yuque/0/2020/png/204082/1583975795068-f388a75e-28af-45c0-b319-45e9db6531e2.png)

#### index.vue 详解

- 引入了模板编辑器和模板解析器
- 作为中继器，模板编辑器（edit.vue）中触发运行，然后传递给模板解析器（running.vue）执行相关渲染方法



#### edit.vue 详解

利用了 `textarea` 实现了可编辑功能。
承担模板语法的编辑 、保存和 `运行`事件的派发工作



#### running.vue 详解

是最核心的文件，当用户在模板编辑器写完 vue 模板语法，且点击了运行，通知主组件。
主组件（index.vue）得到通知，去触发解析器（running.vue）的两个方法

- `reset` 清理之前的渲染内容 | 释放之前被动态渲染出来的组件内存
- `buildDom` 动态渲染组件方法
  - 调用 `splitCode` 方法，将模板语法对应解析成三个部分：`js | css | html`
  - 第二部分，简而言之就是利用上面得到的3个部分，利用 `Vue` 提供的 API 创建了一个组件，然后挂载到了页面上 `id=display` 的 DOM 上，然后把 css 相关代码利用创建的 `style` 标签插入到 `head` 标签里

到此就实现了，模板编辑和渲染的功能
> 补充资料，对该过程有一个更加清晰的认识：[https://www.jianshu.com/p/3dd2ad539f88?tdsourcetag=s_pctim_aiomsg](https://www.jianshu.com/p/3dd2ad539f88?tdsourcetag=s_pctim_aiomsg)





### 增加文本解析功能

#### 功能要求

- 模板从后端请求获得，这里用本地 json 代替
- 渲染成组件（预览）后，再次对渲染出来的组件进行 HTML 文本的输出，然后提供给后端

根据要求模拟实现一下该功能



#### 步骤1：请求本地 JSON 文件

将 `JSON` 文件放置于项目根目录下的 `static` 文件夹中，这样才能够正常请求
![](https://cdn.nlark.com/yuque/0/2020/png/204082/1583976942911-ebc083b8-c840-4404-8a49-494187156423.png)

这个 JSON 的内容是 `.vue` 文件的内容
> 最后这个 data 的数据没有用到，因为 data 可以写在模板里面

```json
{
  "template": "<template>\n<div><p class=\"pp\">{{a}}</p><p>{{b}}</p><p v-if=\"show\">{{name}}</p>\n</div>\n\n</template>\n\n\n<script>\nexport default {\n data(){return{a:1, b:'2', show:true, name:'kkt'}}\n}\n</script>\n\n<style>\n.pp {\n color:red;\n width:20px;\n outline: 1px solid lightblue;\n}\n</style>",
  "data": { "a": "hello", "b": 123, "show": true, "name": "米米" }
}

```

安装 `axios` 用于请求： `npm i axios` 
然后在 `index.vue` 引入后使用

```javascript
// 1 在 src/main.js 中引入
import axios from 'axios'

Vue.prototype.$http = axios


// 2 在 index.vue 中在页面加载时调用，获取模板内容
mounted () {
    this.$http.get('../../static/data.json').then(({data}) => {
      console.log('拿到接口的模板数据>>>', data)
      this.code = data.template
    })
  },
```



#### 步骤2：增加文本解析方法

在 `running.vue` 中增加新方法 `getText` 

```javascript
getText () {
  const dom = this.$refs['text-box']
  if (!dom.querySelector('#code-running')) {
    this.$toast({ msg: '请先运行代码' })
    return
  }

  // 容器
  let body = document.createElement('body')
  const htmlContext = `<div id="app"><style id="style"></style><div id="context"></div></div>`
  body.innerHTML = htmlContext

  // 渲染出来的模板节点
  const child = dom.querySelector('#code-running').childNodes[0]

  // 样式节点
  const styles = document.createElement('style')
  styles.type = 'text/css'
  styles.innerHTML = this.css

  // 插入操作
  const context = body.querySelector('#context')
  const style = body.querySelector('#style')
  style.appendChild(styles)
  context.appendChild(child)

  // TODO 传给后端
  const parseHTML = body.innerHTML
  console.log('【1 是否插入完备】>>>', body)
  // console.log('【2 获取的HTML】>>>', parseHTML)
  console.log('【3 准备传给后端】>>>', JSON.stringify(parseHTML))

  // 清理 DOM
  body = null
  let codeContainer = document.querySelector('#code-running')
  codeContainer.parentNode.removeChild(codeContainer)

  this.buildDom()
}
```

最后就可以拿到需要的字符串



### 最后

核心实现就是上面3个 `.vue` 文件，可以在此基础上做其他需求功能
