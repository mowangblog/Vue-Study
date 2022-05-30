<template>
  <div>
    <h1>{{ msg }}</h1>
      <a-input-search
        style="width: 250px;margin: 10px;margin-bottom: 30px;"
        v-model:value="value"
        placeholder="请输入要查询的藏品"
        enter-button
        @search="handleChange()"
      />
      <a-select
        ref="select"
        v-model:value="value"
        style="width: 250px;margin: 10px;margin-bottom: 30px;"
        @change="handleChange()"
      >
        <a-select-option value="白虎">白虎</a-select-option>
        <a-select-option value="朱雀">朱雀</a-select-option>
        <a-select-option value="青龙">青龙</a-select-option>
        <a-select-option value="玄武">玄武</a-select-option>
        <a-select-option value="姜子牙">姜子牙</a-select-option>
        <a-select-option value="哪吒">哪吒</a-select-option>
        <a-select-option value="杨戬">杨戬</a-select-option>
        <a-select-option value="申公豹">申公豹</a-select-option>
        <a-select-option value="某人">元某人</a-select-option>
        <a-select-option value="小初">猿小初</a-select-option>
        <a-select-option value="周口">周口猿</a-select-option>
        <a-select-option value="总有办法">总有办法</a-select-option>
      </a-select>
    <a-table :columns="columns" :data-source="data" style="text-align: center;">
    <template #headerCell="{ column }">
        <span>
          {{column.name}}
        </span>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'img'">
        <a-image
          :width="150"
          :height="300"
          :src="record.img"
        />
      </template>
      <template v-else-if="column.key === 'presellDate'">
        <span>
          {{record.presellDate?record.presellDate:'非预售'}}
        </span>
      </template>
      <template v-else-if="column.key === 'residueDay'">
        <span>
          {{record.residueDay?record.residueDay:'非预售'}}
        </span>
      </template>
       <template v-else-if="column.key === 'isSellOut'">
        <span>
          {{record.isSellOut?'已售出':'在售'}}
        </span>
      </template>
    </template>
  </a-table>
  </div>
</template>

<script lang="ts">
import type { SelectProps } from 'ant-design-vue';
import { defineComponent, ref } from 'vue';
import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue';
import  axios  from 'axios';
export default {
  name: 'HelloWorld',
  components: {
    SmileOutlined,
    DownOutlined,
  },
  data() {
    return {
      value:'',
      pre: '鲸藏',
      msg: '鲸藏价格监测系统',
      value1: ref('lucy'),
      value2: ref('lucy'),
      value3: ref('lucy'),
      data:[],
      columns:[
        {
          name: "商品名称",
          dataIndex: 'name',
          key: 'name',
        },
        {
          name: "商品图片",
          dataIndex: 'img',
          key: 'img',
        },
        {
          name: "出售人",
          dataIndex: 'publisherName',
          key: 'publisherName',
        },
        {
          name: '价格',
          dataIndex: 'amount',
          key: 'amount',
        },
        {
          name: '是否售出',
          dataIndex: 'isSellOut',
          key: 'isSellOut',
        },
         {
          name: "商品介绍",
          dataIndex: 'introduce',
          key: 'introduce',
        },
         {
          name: "备注",
          dataIndex: 'remark',
          key: 'remark',
        },
        {
          name: '预售日期',
          dataIndex: 'presellDate',
          key: 'presellDate',
        },
        {
          name: "发行日期",
          dataIndex: 'issueDate',
          key: 'issueDate',
        },
        {
          name: '剩余天数',
          dataIndex: 'residueDay',
          key: 'residueDay',
        }
      ]
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    handleChange(){
      this.init(this.pre+this.value);
    },
    init(search = '鲸藏朱雀'){
      axios({
      method:'post',
      headers:{
        Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91aWQiOjM0NTYxNCwibG9naW5fdXNlcl9rZXkiOiIxODQ0ZWFhOC03MGQ2LTRjOWYtYmFkYS03NDc0ZWYwZjg5MDQifQ.uXFg0MaQDIa37GotDl_-jmSsKO7aLA159mq9gBjhbbTt7yJ-O1rrTIilqeN5xDYapgRZHEPHBqzHqtojXVVHGg'
      },
      url:'https://api.x-metash.com/api/prod/NFTMall/h5/home/summary',
      data:{"search":`${search}`,"pageNum":1,"pageSize":8,"isPrizeAsc":true}})
      .then(res=>{
        console.log(res.data.data);
        this.data = res.data.data
        this.data.forEach(item => {
            axios({
              method:'post',
              headers:{
                Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91aWQiOjM0NTYxNCwibG9naW5fdXNlcl9rZXkiOiIxODQ0ZWFhOC03MGQ2LTRjOWYtYmFkYS03NDc0ZWYwZjg5MDQifQ.uXFg0MaQDIa37GotDl_-jmSsKO7aLA159mq9gBjhbbTt7yJ-O1rrTIilqeN5xDYapgRZHEPHBqzHqtojXVVHGg'
              },
              url:'https://api.x-metash.com/api/prod/NFTMall/h5/goods/details',
              data:{"goodsId":`${item.id}`}})
              .then(res=>{
                item.introduce = res.data.data.introduce
                item.remark = res.data.data.remark
                item.publisherName = res.data.data.publisherName
            })
        });

      })
    }
  },
}
</script>

