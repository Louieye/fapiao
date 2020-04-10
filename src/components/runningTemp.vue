<template>
  <div class="hello">
    <!-- <el-button class="get-text" type="primary" @click="getText">获取文本</el-button> -->
    <div class="code-box" id="display" ref="text-box"></div>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  name: 'runningTemp',
  props: {
    runValue: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      code: this.runValue,
      html: '',
      js: '',
      css: '',
      program: null
    }
  },
  watch: {
    runValue (val) {
      this.code = val
    }
  },
  methods: {
    getText () {
      const dom = this.$refs['text-box']
      if (!dom.querySelector('#code-running')) {
        this.$message.warning('请先预览代码')
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
      // const result = document.getElementsByTagName('html')[0].outerHTML
      // console.log('【1 是否插入完备】>>>', body)
      // console.log('【2 获取的HTML】>>>', parseHTML)
      // console.log('true', parseHTML)
      console.log('【parseHTML】',parseHTML);
      console.log('【3 准备传给后端】>>>', JSON.stringify(parseHTML))
      // 清理 DOM
      body = null
      let codeContainer = document.querySelector('#code-running')
      codeContainer.parentNode.removeChild(codeContainer)

      this.buildDom()
      return parseHTML
    },

    getSource (source, type) {
      const regex = new RegExp(`<${type}[^>]*>`)
      let openingTag = source.match(regex)
      if (!openingTag) return ''
      else openingTag = openingTag[0]

      return source.slice(
        source.indexOf(openingTag) + openingTag.length,
        source.lastIndexOf(`</${type}>`)
      )
    },
    splitCode () {
      const script = this.getSource(this.code, 'script').replace(
        /export default/,
        'return '
      )
      const style = this.getSource(this.code, 'style')
      const template =
        '<div id="code-running">' +
        this.getSource(this.code, 'template') +
        '</div>'
      this.js = script
      this.css = style
      this.html = template
    },
    buildDom () {
      try{
        this.splitCode()
        if (this.html === '' || this.js === '') {
          this.$message.warning('请输入有效的vue代码')
          // eslint-disable-next-line semi
          return
        }
        // eslint-disable-next-line no-new-func
        const common = new Function(this.js)()
        common.template = this.html
        const TempText = Vue.extend(common)
        this.program = new TempText()
        document.querySelector('#display').appendChild(this.program.$mount().$el)
        if (this.css !== '') {
          const styles = document.createElement('style')
          styles.type = 'text/css'
          styles.innerHTML = this.css
          document.getElementsByTagName('head')[0].appendChild(styles)
        }
      }
      catch(err){
        console.log('【预览报错】',err);
        this.$message.error('渲染失败，请检查代码是否有误')
      }
    },
    reset () {
      document.getElementById('display').innerHTML = ''
      if (this.program) {
        this.program.$destroy()
      }
      this.program = null
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.hello {
  width: 46%;
  // min-height: 350px;
  border: 1px solid #999999;
  border-radius: 5px;
  box-shadow: 0 0 8px 1px rgba($color: #999999, $alpha: 0.5);
  border-top: none;
  box-sizing: border-box;
  position: relative;
  .title {
    margin: 0;
    height: 50px;
    line-height: 60px;
    padding-left: 20px;
    /*border-bottom: 2px solid #222;*/
  }
  .code-box {
    padding: 0px;
    overflow: auto;
  }
  button{
    width: 100px;
    height: 45px;
    // border-radius: 4px;
    margin: 7px 0 0 20px;
    // background: #e4933c;
    // color: #ffffff;
    // font-size: 14px;
    // border: none;
  }
}
</style>
