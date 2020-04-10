<template>
  <div class="container">
    <table class="tb-style" align="center">
      <tr>
        <th class="tb-title" height="60" colspan="3">浙江省医疗门诊收费票据</th>
      </tr>
      <tr>
        <td class="tb-font" colspan="2">{{ data.billNo1 }}</td>
        <td class="tb-font">{{ data.billNo2 }}</td>
      </tr>
      <tr>
        <td colspan="2">票据代号：31101</td>
        <td>NO:4567754333</td>
      </tr>
      <tr class="tb-bor tb-font">
        <td colspan="2">
          <span>病历号：</span>{{ data.medicalRecordNo }}
        </td>
        <td>
          <span>医疗机构类型：</span>{{ data.branchType }}
        </td>
      </tr>
      <tr class="tb-bor tb-font">
        <td>
          <span>姓名：</span>{{ data.personInfo.name }}
        </td>
        <td>
          <span>性别：</span>{{ data.personInfo.sex + ' ' + data.personInfo.age + '岁' }}
        </td>
        <td>
          <span>医保类型：</span>{{ data.medicalInsType }}
        </td>
      </tr>
      <tr class="tb-bor tb-font">
        <td colspan="3">
          <span>社会保障号码：</span>{{ data.socialSecNo }}
        </td>
      </tr>
      <tr>
        <td class="tb-pro" colspan="3">
          <table>
            <tr class="tb-bor">
              <th>项目/规格</th>
              <th>类</th>
              <th>数量</th>
              <th>金额</th>
              <th>自理自费(%)</th>
            </tr>
            <tr class="pro-title pro-font" v-for="item in data.proDetails" :key="item.proId">
              <td class="pro-classical">{{ item.projectName }}</td>
              <td class="pro-classical">{{ item.class }}</td>
              <td class="pro-classical">{{ item.number }}</td>
              <td class="pro-classical">{{ item.moneyAmount }}</td>
              <td class="pro-classical">{{ item.selfCare }}</td>
            </tr>
            <tr class="tb-bor pro-font">
              <td class="pro-tips" colspan="5">{{ data.tips }}</td>
            </tr>
            <tr class="tb-font">
              <td colspan="3" class="pro-total">
                <span>合计(大写)：</span>{{ data.capTotal }}
              </td>
              <td colspan="2">
                <span>￥：</span>{{ data.total }}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'tempDoc',
  data () {
    return {
      data: null
    }
  },
  created () {
    this.computedTotal()
  },
  methods: {
    computedTotal () {
      let total = this.data.proDetails.reduce((temp, item) => {
        temp = temp + item.moneyAmount
        return temp
      }, 0)
      this.data.total = total.toFixed(2)
    }
  }
}
</script>

<style scoped>
.container{
  position: absolute;
}
table
{
  border-collapse:collapse;
  max-width: 500px;
}
.tb-title{
  text-align: center;
  font-size: 16px;
}
.tb-style{
  border: 1px solid black;
  font-size: 14px;
}
.tb-bor{
  border-bottom: 1px solid black;
}
td{
  padding: 0 10px 0 30px;
  font-weight: 500;
}
.tb-font{
  color: #268bd4;
}
span{
  color: #222222;
}
.tb-pro{
  padding: 0;
}
.pro-title{
  text-align: center;
}
.pro-font{
  color: #999999;
}
.pro-classical{
  padding: 5px 0;
}
.pro-tips{
  padding-bottom: 10px;
}
.pro-total{
  padding: 5px 30px;
}
</style>
