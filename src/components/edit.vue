<template>
  <div class="edit-box">
    <div class="btn-box">
      <div class="edit-title">
        <label>{{title || '新的模板'}}</label>
      </div>
      <!-- <el-button @click="handleClick" type="success">预览</el-button> -->
<!--      <button class="edit" @click="edit">重新编辑</button>-->
    </div>
    <div class="style-box">
      <textarea id="editText" :value="oldCode" :disabled="disabled" name="code" placeholder="请在此编写.vue文件"></textarea>
    </div>
  </div>
</template>
<script>
import * as CodeMirror from 'codemirror/lib/codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/mode/vue/vue'
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/hint/javascript-hint'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/css-hint'
import 'codemirror/addon/hint/html-hint'

export default {
  name: 'edit',
  components: { CodeMirror },
  props: {
    newCode: {
      type: String,
      default: ''
    },
    oldCode: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      currentValue: this.newCode,
      disabled: false
    }
  },
  mounted () {
    this.setMirror()
  },
  methods: {
    setMirror () {
      let myTextarea = document.getElementById('editText')
      this.CodeMirrorEditor = CodeMirror.fromTextArea(myTextarea, {
        mode: 'vue', // 编辑器语言
        theme: 'eclipse', // 编辑器主题
        extraKeys: { 'Ctrl': 'autocomplete' }, // ctrl可以弹出选择项
        lineNumbers: true, // 显示行号
        smartIndent: true, // 自动缩进
        styleActiveLine: true // 高亮当前行
      })
      this.CodeMirrorEditor.on('change', () => {
        // 编译器内容更改事件
        this.$emit('change-value', this.CodeMirrorEditor.getValue())
        this.$emit('input', this.CodeMirrorEditor.getValue())
      })
      this.CodeMirrorEditor.on('keypress', () => {
        // 硬件事件触发
        this.CodeMirrorEditor.showHint()
      })
    },
    // handleChange (e) {
    //   const val = e.target.value
    //   this.$emit('change-value', val)
    //   this.$emit('input', val)
    // },
    handleClick () {
      this.$emit('runningTemp')
      if (this.currentValue) {
        this.disabled = true
      }
      console.log(this.data);
      console.log(this.newCode);
      
    },
    changeData(data){
      this.CodeMirrorEditor.setValue(data)
    }
  }
}
</script>
<style lang="scss" scoped>
.edit-box {
  width: 46%;
  // min-height: 350px;
  border: 1px solid #999999;
  border-radius: 5px;
  box-shadow: 0 0 8px 1px rgba($color: #999999, $alpha: 0.5);
  border-top: none;
  background-color: #f5f5f5;
  .style-box {
    height: 100%;
    box-sizing: border-box;
    width: 100%;
    padding-top: 60px;
    margin-top: -60px;
  }
  .btn-box {
    height: 50px;
    position: relative;
    display: flex;
    padding: 0 20px;
    justify-content: space-between;
    align-items: center;
  }
  textarea {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    outline: none;
    border: none;
    font-size: 14px;
    padding: 10px 20px;
    &:disabled {
      background: #3f3f3f;
    }
  }
  button {
    width: 100px;
    height: 45px;
    // border-radius: 4px;
    // background: #25b5a3;
    // color: #fff;
    // font-size: 14px;
    // border: none;
    // outline: none;
    &.edit {
      width: 80px;
      height: 30px;
      background: rgb(199, 39, 39);
    }
  }
  .edit-title{
    label{
      font-size: 18px;
      color: #3f3f3f;
    }
  }
}
.edit-box /deep/ .CodeMirror{
  height: 100%;
}
</style>
