<template>
  <div>
    <h3>数据更新时间：{{updateTime}}</h3>
    <h3>本网站仅用于交流与学习</h3>
    <a-button type="primary" @click="loginOut()" style="margin:20px">登出账号</a-button>
    <a-affix :offset-top="top">
      <a-button type="primary" @click="updateData()" style="margin:20px">手动刷新数据</a-button>
    </a-affix>
    <a-row>
      <card-table 
        @getDetails="getDetails"
        :data="data[index]" 
        :title="title[index]" 
        v-for="(item,index) in title" 
        :key="index" >
      </card-table>
    </a-row>
    <a-modal v-model:visible="visible" title="详情" @ok="handleOk" centered >
      <template #footer>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk()" v-if="detail.sellStatus!==2">立即购买</a-button>
        <a-button disabled v-else>已售出</a-button>
      </template>
      <a-descriptions title="NTF信息">
        <a-descriptions-item label="商品名">{{detail.name}}</a-descriptions-item>
        <a-descriptions-item label="出售人">{{detail.publisherName}}</a-descriptions-item>
        <a-descriptions-item label="价格">{{detail.amount}}</a-descriptions-item>
        <a-descriptions-item label="状态"> {{detail.sellStatus==2?'已售出':'在售'}}</a-descriptions-item>
        <a-descriptions-item label="介绍">{{detail.introduce}}</a-descriptions-item>
        <a-descriptions-item label="备注">{{detail.remark}}</a-descriptions-item>
      </a-descriptions>
    </a-modal>
    <a-back-top />
  </div>
</template>

<script lang="ts">
import { message } from 'ant-design-vue';
import CardTable from './CardTable.vue'
import  axios  from 'axios';
import { ref } from 'vue';
export default {
  name: 'Ranking',
  components: {
    CardTable
  },
  props:['authorization'],
  data() {
    return {
      intervalId:'',
      detail:{},
      loading:ref<boolean>(false),
      visible:ref<boolean>(false),
      top: ref<number>(10),
      updateTime: '',
      pre: '鲸藏',
      title:['青龙','白虎','朱雀','玄武','姜子牙','哪吒','杨戬','申公豹','元某人','周口猿','猿小初','迎新娘','女神','向阳'],
      data:[],
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    loginOut(){
      axios({
        method:'post',
        headers:{
           Authorization: this.authorization
        },
        url:'https://api.x-metash.com/api/prod/NFTMall/h5/logout'
       }).then(res=>{
         message.success(res.data.msg)
      })
      clearInterval(this.intervalId)
      localStorage.clear('token')
      this.$emit('loginOut');
    },
    showModal(){
        this.visible = true;
    },
    handleCancel(){
        this.visible = false;
    },
    handleOk(){
        this.loading = true;
        this.orders()
    },
    orders(){
        // return;
       let addressId;
       axios({
        method:'post',
        headers:{
           Authorization: this.authorization
        },
        url:'https://api.x-metash.com/api/prod/NFTMall/h5/order/prepay',
        data:{"goodsId":this.detail.goodsId}
       }).then(res=>{
          axios({
            method:'post',
            headers:{
              Authorization: this.authorization
            },
            url:'https://api.x-metash.com/api/prod/NFTMall/h5/order/create',
            data:{"goodsId":this.detail.goodsId,"addressId":res.data.data.address[0].id}
          }).then(res=>{
                console.log(res);
                message.success('购买成功')
              },err=>{
                message.error('购买失败')
          })
         },err=>{
          message.error('生成预订单失败')
         })
       this.loading = false;
       this.visible = false;
    },
    getDetails(id){
      axios({
        method:'post',
        headers:{
           Authorization: this.authorization
        },
        url:'https://api.x-metash.com/api/prod/NFTMall/h5/goods/details',
        data:{"goodsId":id}
      }).then(res=>{
          this.detail = res.data.data;
          this.detail.goodsId = id;
          this.showModal()
        })
    },
    updateData(){
      for (let i in this.title){
        axios({
          method:'post',
          headers:{
            Authorization: this.authorization
          },
          url:'https://api.x-metash.com/api/prod/NFTMall/h5/home/summary',
          data:{"search":`${this.pre+this.title[i]}`,"pageNum":1,"pageSize":10,"isPrizeAsc":true}
        }).then(res=>{
          this.data[i] = res.data.data
        })
      }
      this.updateTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
      message.success(`数据已更新,更新时间：${this.updateTime}`)
    },
    init(){
      this.updateData();
      this.cycle();
    },
    cycle(){
      this.intervalId = setInterval(() => {
        this.updateData();
      }, 60 * 1000);
    }
  },
}
</script>

