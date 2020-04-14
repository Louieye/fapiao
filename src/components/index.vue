<template>
  <div class="container">
    <div class="box-data">
      <textarea ref="textArea" id="dataCode" :value="format(newData)"></textarea>
    </div>
    <div class="box">
      <edit
        class="box-item"
        v-if="isShowEdit"
        ref="edit"
        :old-code="noDataCode"
        :new-code="newCode"
        :title="targetTemplate.templateName"
        @change-value="changeValue"
        @runningTemp="runningTemp"
      ></edit>
      <div class="button-box">
        <el-button type="success" @click="editHandleClick">预览</el-button>
        <el-button type="warning" @click="isFormat = !isFormat">切换格式</el-button>
        <el-button type="primary" @click="openTemplateProgram">模板管理</el-button>
        <el-button type="primary" @click="openDataProgram">数据管理</el-button>
        <el-button @click="handleSaveTemplate">保存模板</el-button>
        <el-button @click="handleSaveData">保存数据</el-button>
      </div>
      <running-temp class="box-item" :run-value="newCode" ref="runTemp"></running-temp>
    </div>
    <!-- 模板管理弹窗 -->
    <el-dialog title="模板管理" :visible.sync="dialogVisible" width="1100px" :before-close="handleClose">
      <div class="search-box">
        <el-input placeholder="请输入搜索内容" v-model="search" class="input-with-select">
          <el-select v-model="select" slot="prepend" placeholder="所属系统">
            <el-option
            :key="item.id"
            v-for="item in options"
            :value="item.id"
            :label="item.name">
            </el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" style="padding:12px 30px" @click="handleSearch"></el-button>
        </el-input>
      </div>
      <el-table :data="tableData" height="400px" class="table" v-loading="loading">
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="templateName" label="模板标题" width="200px"></el-table-column>
        <el-table-column prop="systemName" label="所属系统"></el-table-column>
        <el-table-column prop="moduleName" label="所属模块"></el-table-column>
        <el-table-column
          prop="state"
          label="状态"
          width="100">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.state == 1 ? 'success' : 'danger'"
              disable-transitions>{{scope.row.state == 1?'启用':'停用'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="280px">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="handleSelect(scope.$index,scope.row)">选择</el-button>
            <el-button size="small" type="success" @click="editTemplate(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" type="warning" :plain="scope.row.state == 1?true:false" @click="changeTemplateActive(scope.row)">{{scope.row.state == 0?'启用':'停用'}}</el-button>
            <el-button size="small" type="danger" @click="deleteTemplate(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-box">
        <el-pagination
        background
        layout="prev, pager, next"
        :pager-count="5"
        :page-size="5"
        :total="total"
        :current-page.sync="currentPage"
        @current-change="pageChange">
      </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" plain id="fileImport" @click="handleSaveNewTemplate">保存为新模板</el-button>
        <el-button type="success" id="fileImport" @click="clickLoad">导入本地模板</el-button>
        <input type="file" id="files" ref="refFile" style="display: none" accept=".txt" @change="fileLoad">
        <el-button type="primary" @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 选择数据弹窗 -->
    <el-dialog title="选择数据" :visible.sync="dialogVisible2" width="900px">
      <div class="search-box">
        <el-input placeholder="请输入ID搜索" v-model="dataSearch" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" style="padding:12px 30px"></el-button>
        </el-input>
      </div>
      <el-table 
      :data="dataList.filter(data => !dataSearch || data.id == dataSearch)"
      height="300px" 
      class="table">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item>
                <span>{{ props.row.mockData }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="modifyTime" label="更新时间" width="200px"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small" type="success" @click="handleSelectData(scope.$index,scope.row)">选择</el-button>
            <el-button size="small" type="danger" @click="handleDeleteData(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="handleAddData()">保存为新数据</el-button>
        <el-button type="primary" @click="dialogVisible2 = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 编辑弹窗 -->
    <el-dialog title="编辑" :visible.sync="dialogVisible3" width="600px" :before-close="handleCloseEdit">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="模板标题" prop="templateName">
          <el-input v-model="form.templateName" style="width: 70%" />
        </el-form-item>
        <el-form-item label="所属系统" prop="sysId">
          <el-select v-model="form.sysId" placeholder="请选择系统" style="width: 70%">
            <el-option
            :key="item.id"
            v-for="item in options"
            :value="item.id"
            :label="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属模块" prop="moduleName">
          <el-input v-model="form.moduleName" style="width: 70%" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="submitTemplateEdit">确 定</el-button>
        <el-button type="primary" @click="handleCloseEdit">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Edit from "./edit";
import RunningTemp from "./runningTemp";
import * as CodeMirror from "codemirror/lib/codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/panda-syntax.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/selection/active-line";
import formatData from "@/utils/constant";
import request from "@/utils/request";

export default {
  name: "index",
  components: {
    Edit,
    RunningTemp,
    CodeMirror
  },
  data() {
    return {
      loading: false,
      file: '', // 本地模板文件
      tableData: [], // 搜索结果
      dataList: [], // 当前模板对应的数据列表
      form: {}, // 编辑模板表单
      targetTemplate: {}, // 当前选择的模板
      targetDataId: '', // 当前选择的数据ID
      select: [], // 模板系统列表
      select: '', // 选择模板所属系统
      currentRow: null,
      search: "", // 模板搜索
      dataSearch: '', // 模板数据搜索
      dialogVisible: false, // 模板弹窗
      dialogVisible2: false, // 数据弹窗
      dialogVisible3: false, // 编辑弹窗
      isFormat: true, // 切换格式化
      result: "", // 运行后的数据
      isRun: false,
      code: "",
      data: "",
      newData: "", // 修改的数据(保存数据时使用)
      newCode: "", // 修改的模板(含数据)
      noDataCode: "", // 没有data的模板(保存模板时使用)
      CodeMirrorEditor: "",
      flag: 1, // 替换数据标识
      middleData: "", // edit子组件修改数据后的过度值
      isShowEdit: false, // 获取到数据后再调用子组件
      value: "",
      isEdit: false, // 判断是否是编辑模板
      total: 1,
      currentPage: 1,
      rules: {
        moduleName: [
          { required: true, message: '所属模块不能为空', tirgger: 'blur'}
        ]
      }
    }
  },
  async mounted() {
    // 问题： 在哪一步转呢 怎么转呢？？？
    await this.$http.get("../../static/data.json").then(({ data }) => {
      console.log("拿到接口的模板数据>>>", data);
      this.data = JSON.stringify(data.data);
      // this.noDataCode = data.template;
      // const temp = data.template.replace(/null/, this.data);
      this.newData = this.data;
      // this.code = temp;
    });
    try{
      await request({
          url: '/sys/system/getTemplateSystemByType?type=2',
          method: 'get'
        }).then(res => {
          console.log('【获取的系统列表】',res.data.body.data);
          this.options = res.data.body.data
        })
    }catch(err){
      this.$message.warning('连接超时，当前为离线模式')
    }
    this.isShowEdit = true;
    this.setMirror();
  },
  created() {
    this.isShowEdit = true;
  },
  watch: {
    newData(val1) {
      if (this.flag) {
        this.newCode = this.code.replace(this.data, val1);
      } else {
        this.newCode = this.code.replace(this.middleData, val1);
      }
    },
    isFormat() {
      if (this.isFormat === true) {
        this.$refs.textArea.value = this.format(this.newData);
      } else {
        this.$refs.textArea.value = this.newData.replace(/[\r\n]/g,"").replace(/\s+/g,"");
      }
      this.setMirror();
    }
  },
  methods: {
    setMirror() {
      let myTextarea = document.getElementById("dataCode");
      this.CodeMirrorEditor = CodeMirror.fromTextArea(myTextarea, {
        mode: "javascript", // 编辑器语言
        theme: "panda-syntax", // 编辑器主题
        extraKeys: { Ctrl: "autocomplete" }, // ctrl可以弹出选择项
        lineNumbers: true, // 显示行号
        smartIndent: true // 自动缩进
      });
      this.CodeMirrorEditor.on("change", () => {
        // 编译器内容更改事件
        this.newData = this.CodeMirrorEditor.getValue();
      });
    },
    runningTemp() {
      this.$refs.runTemp.reset();
      this.$refs.runTemp.buildDom();
    },
    changeValue(val) {
      this.flag = 0;
      this.noDataCode = val;
      this.middleData = this.newData;
      this.newCode = this.noDataCode.replace(/null/, this.newData);
      this.code = this.newCode;
    },
    format(str) {
      return formatData.formatData.format(str);
    },
    // 调用edit子组件预览方法
    editHandleClick() {
      this.$refs.edit.handleClick();
      this.isRun = true;
    },
    // 调用runTemp子组件获取文本方法
    // runGetText() {
    //   const data = this.$refs.runTemp.getText();
    //   this.result = data;
    //   console.log("【data】", data);
    // },
    // 保存数据
    async handleSaveData(){
      // 判断是否选择数据 没有选择就新增数据
      if(this.targetDataId == ''){
        this.handleAddData()
        return
      }
      await request({
        url: '/template/mock/updateTemplateMock',
        method: 'post',
        data: {
          id: this.targetDataId,
          mockData: this.newData
        }
      }).then(res => {
        if(res.status == 200){
          this.$message.success('保存数据成功')
        }
      })
    },
    // 保存模板
    handleSaveTemplate() {
      this.form = this.targetTemplate
      this.form.templateData = this.noDataCode
      console.log('【保存的模板】', this.noDataCode);
      this.dialogVisible3 = true
    },
    // 保存为新模板
    handleSaveNewTemplate(){
      this.form.templateData = this.noDataCode
      this.dialogVisible3 = true
    },
    // 关闭模板管理弹窗
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.dialogVisible3 = false
          this.dialogVisible = false
          done()
        })
        .catch(_ => {})
    },
    // 关闭表单弹窗
    handleCloseEdit(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.dialogVisible3 = false
          this.form = {}
          this.isEdit = false
          done()
        })
        .catch(_ => {})
    },
    // 打开模板管理窗口
    async openTemplateProgram(){
      this.loading = true
      this.dialogVisible = !this.dialogVisible
      // 如果存在搜索记录 按照搜索记录渲染列表
      if(this.search != '' || this.select != ''){
        this.handleSearch()
      }else{
      // 默认列表
        await request({
        url: '/template/getTemplateList',
        method: 'get',
        params: {
          pageNum: 1,
          pageSize: 5
        }
      }).then(res => {
        console.log('【默认模板列表】',res.data.body.data.list);
        this.tableData = res.data.body.data.list
        this.total = parseInt(res.data.body.data.total)
        this.loading = false
      }).catch(() =>{
        this.loading = false
      })
      }
    },
    // 搜索模板
    async handleSearch(){
      this.loading = true
      await request({
        url: '/template/getTemplateList',
        method: 'get',
        params: {
          sysId: this.select,
          key: this.search,
          pageNum: 1,
          pageSize: 5
        }
      }).then(res => {
        this.currentPage = 1
        this.tableData = res.data.body.data.list
        this.total = parseInt(res.data.body.data.total)
        this.loading = false
      }).catch(() =>{
        this.loading = false
      })
    },
    // 切换页码
    async pageChange(page){
      this.loading = true
      await request({
        url: '/template/getTemplateList',
        method: 'get',
        params: {
          sysId: this.select,
          key: this.search,
          pageNum: page,
          pageSize: 5
        }
      }).then(res => {
        this.tableData = res.data.body.data.list
        this.loading = false
      })
    },
    // 选择模板 获取模板内容
    handleSelect(index, row) {
      this.isEdit = true
      this.$refs.edit.changeData(this.tableData[index].templateData || '')
      this.targetTemplate = this.tableData[index]
      this.dialogVisible = false
      console.log('【选择的模板】', this.tableData[index]);
    },
    // 编辑模板
    async editTemplate(index, row){
      this.isEdit = true
      this.form = Object.assign({}, this.tableData[index])
      this.dialogVisible3 = true
      console.log('', this.form);
      
    },
    // 提交模板表单
    submitTemplateEdit(){
      this.$refs['form'].validate(async(valid) => {
        if (valid) {
          // 判断是否为编辑模板信息 不修改内容
          if(this.isEdit == true){
            console.log(this.form);
            await request({
            url: '/template/saveTemplate',
            method: 'post',
            data: this.form
          }).then(res => {
            this.dialogVisible3 = false
            this.$message.success('修改信息成功')
          })
          return
          }
          // this.form.templateData = this.newCode
          // console.log('【传给后端的模板数据】', this.form);
          if(this.form.id && this.form.id > 0){
            await request({
            url: '/template/saveTemplate',
            method: 'post',
            data: this.form
            }).then(res => {
              this.dialogVisible3 = false
              this.$message.success('修改模板成功')
            })
            return
          }
          await request({
            url: '/template/insertTemplate',
            method: 'post',
            data: this.form
          }).then(res => {
            this.dialogVisible3 = false
            this.$message.success('新增模板成功')
          })
        }else{
          this.$message.error('输入信息有误')
        }
        this.isEdit = false
      })
    },
    // 切换模板启用状态
    async changeTemplateActive(row){
      const index = this.tableData.findIndex(item => item.id == row.id)
      if(row.state == 1){
        this.tableData[index].newState = 0
      }else{
        this.tableData[index].newState = 1
      }
      await request({
        url: '/template/doTemplateModify',
        method: 'get',
        params: {
          id: this.tableData[index].id,
          newState: this.tableData[index].newState
        }
      }).then(res => {
        if(res.status == 200){
          this.$message.success('状态更改成功')
          this.tableData[index].state = row.state == 1 ? 0 : 1
        }else{
          this.$message.error('状态更改失败')
        }
      })
    },
    // 删除模板
    async deleteTemplate(row){
      await request({
        url: '',
        method: 'get',
        params: {
          id: row.id
        }
      }).then(res => {
        const index = this.tableData.findIndex(item => item.id == row.id)
        this.tableData.splice(index,1)
      })
    },
    // 打开数据管理窗口
    async openDataProgram(){
      if(!this.targetTemplate.id){
        this.$message.warning('请先选择模板')
        return
      }
      await request({
        url: '/template/mock/getTemplateMockByTemplateId',
        method: 'get',
        params: {
          templateId: this.targetTemplate.id
        }
        }).then(res => {
          this.dataList = res.data.body.data
          console.log('【模板数据列表】', this.dataList);
        })
      this.dialogVisible2 = true
    },
    // 选择数据
    handleSelectData(index, row){
      this.CodeMirrorEditor.setValue(row.mockData)
      this.targetDataId = row.id
      this.dialogVisible2 = false
    },
    async handleDeleteData(index, row){
      await request({
        url: '/template/mock/deleteTemplateMock?',
        method: 'get',
        data: {
          templateId: row.id
        }
      }).then(res => {
        if(res.status == 200){
          this.$message.success('删除数据成功')
          const index = this.dataList.findIndex(item => item.id == row.id)
          this.dataList.splice(index,1)
        }
      })
    },
    // 新增数据
    async handleAddData(){
      if(!this.targetTemplate.id){
        this.$message.warning('请先选择模板')
        return
      }
      await request({
        url: '/template/mock/insertTemplateMock',
        method: 'post',
        data: {
          templateId: this.targetTemplate.id,
          mockData: this.newData
        }
      }).then(res => {
        if(res.status == 200){
          this.$message.success('新增数据成功')
          this.dialogVisible2 = false
        }
      })
    },
    clickLoad() {
      this.$refs.refFile.dispatchEvent(new MouseEvent('click'))
    },
    // 读取本地文件
    fileLoad() {
      const selectedFile = this.$refs.refFile.files[0];
      if(selectedFile.type != 'text/plain'){
        this.$message.error('文件格式错误，只支持txt格式文件')
        return
      }
      return new Promise(function(resolve, reject) {
        var reader = new FileReader();
        reader.readAsText(selectedFile);
        reader.onload = function(){
          resolve(this.result)
        }
      }).then(res => {
        this.$refs.edit.changeData(res)
        this.dialogVisible = false
        this.$message.success('导入成功')
        console.log('【本地文件路径】',this.$refs.refFile.value);
        this.$refs.refFile.value = ''
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.table {
  width: 100%;
}
.search-box {
  .el-select {
    width: 130px;
  }
  .el-button {
    margin: 0 5px;
  }
}
.button-box {
  width: 100px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.el-button {
  margin: 10px 2px;
}
.box {
  min-width: 1000px;
  overflow: auto;
  height: calc(100% - 224px);
  display: flex;
  justify-content: space-between;
}
.container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.box-data {
  min-width: 1000px;
  height: 47%;
  overflow: hidden;
  border: 2px solid #999999;
}
textarea {
  width: 100%;
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: scroll;
}
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.page-box {
  text-align: right;
  margin-top: 20px;
}
</style>
