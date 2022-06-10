<template>
  <div class="app" style="padding: .1rem" >
    <img alt="Vue logo"  height="300" src="./assets/logo.jpg" />
     <h1>{{ msg }}</h1>
     <a-card title="登录系统" :bordered="true" v-if="!isLogin" style="width: 400px;margin-right: auto;margin-left: auto;">
        <a-form :model="formState" >
          <a-form-item label="手机号" >
            <a-input v-model:value="formState.iphone" placeholder="请输入你的手机号" />
          </a-form-item>
          <a-form-item label="验证码" >
            <a-input v-model:value="formState.code" placeholder="请输入你收到的验证码" />
          </a-form-item>
          <a-form-item  v-if="!formState.code">
            <a-button type="primary" @click="getVerifyCode" :disabled="disableCode">{{getCode}}</a-button>
          </a-form-item>
          <a-form-item v-else>
            <a-button type="primary" @click="handleFinish">登录</a-button>
          </a-form-item>
        </a-form>
     </a-card>
     <Ranking :authorization="authorization" @loginOut="isLogin = false" v-else/>
  </div>
  <!-- <div v-else> 
     <h1 >服务到期，请输入激活码</h1>
     <a-card title="激活" :bordered="true" v-if="!isLogin" style="width: 400px;margin-right: auto;margin-left: auto;">
        <a-form :model="formState" >
          <a-form-item label="激活码">
            <a-input v-model:value="CDK" placeholder="请输入激活码" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="active">确定</a-button>
          </a-form-item>
        </a-form>
     </a-card>
     <h4 style="margin:10px">如需激活码请联系qq:2623872023获取</h4>
  </div> -->
  
</template>

<script>
import { message } from 'ant-design-vue';
import  axios  from 'axios';
import Ranking from './components/Ranking.vue'

export default {
  name: 'App',
  components: {
    Ranking
  },
  data() {
    return {
       jump: false,
       ck:['WsuKAvgMZFKZeOWt','NxYWHfEdKQrKNXZt','YQXkpUFjYuDeIWFw','RdeNFVdvboHNjLec','oXrMeffXpBXWcpdI',
       'XRRYgaHuxlvmtkAZ','vBDZDwAoCZIgYImO','kYIAJBOkXQbbPbBX','biLdgUwvnrYmJXpD','aWHacbbMdqNrcjuj'],
       CDK:"",
       authorization: 
      'eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91aWQiOjM0NTYxNCwibG9naW5fdXNlcl9rZXkiOiI5YjE0MzQ5Zi00ZThkLTQ0MjItYTk1Ni04NjhlMjFmNDU3OTUifQ.RxheqgbyNJJbZqw8m1Fy2-H04QdiJjAVC2A66hoRe1DXXkhgBIP8eI9TIyOc_sVCkcVsbD1T3ZLNjK4alRlHzA',
       isLogin: false,
       formState:{
        iphone: '',
        code:''
       },
       disableCode: false,
       count: 60,
       getCode :'获取验证码',
       msg: '鲸藏价格监测系统'
    }
  },
  mounted() {
    let token = localStorage.getItem("token")
    // if(token){
    //   axios({
    //     method:'post',
    //     headers:{
    //        Authorization: token
    //     },
    //     url:'https://api.x-metash.com/api/prod/NFTMall/h5/user'
    //    }).then(res=>{
    //       if(res.data.code == 200){
              this.authorization = token;
              this.isLogin = true
              this.jump = true
      //     }else{
      //         localStorage.clear('token')
      //     }  
      // })
    // }
  },
  methods: {
    active(){
      if(this.ck.indexOf(this.CDK)){
        message.error('你输入的激活码：'+this.CDK+'无效')
      }else{
        this.jump = true
        message.success('激活成功')
      }
    },
    handleFinish(){
       axios({
        method:'post',
        url:'https://api.x-metash.com/api/prod/NFTMall/h5/login',
        data:{"phone":this.formState.iphone,"code":this.formState.code,"city":"","headImg":"","nickName":this.getOpenId(5),"openid":this.getOpenId(28),"province":"","sex":0}
      }).then(res=>{
          console.log(res);
          if(res.data.code == 200){
              this.authorization = 'Bearer '+res.data.data.token
              message.success('登录成功')
              localStorage.setItem("token",this.authorization)
              this.isLogin = true
          }else{
              message.error('登录失败')
          }  
      })
    },
    isShow(){
        return this.$moment().isBefore('2022-05-27') || this.jump;
    },
    getOpenId(size){
      let seed = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','m','n','p','Q','r','s','t','u','v','w','x','y','z','2','3','4','5','6','7','8','9'];// 密码源数组
      let n='';
      for(var i=0;i<size;i++){
      let t=Math.round(Math.random()*(seed.length-1));
        n+=seed[t];
      }
      return n;
    },
    getVerifyCode() {
      if(this.formState.iphone.length !== 11){
          message.info('请输入正确的手机号')
          return
      }
      axios({
        method:'post',
        url:'https://api.x-metash.com/api/prod/NFTMall/h5/sendCode',
        data:{"phone":this.formState.iphone}
      }).then(res=>{
          if(res.data.code == 200){
            var countDown = setInterval(() => {
            if (this.count < 1) {
              this.disableCode = false
              this.getCode = '获取验证码'
              this.count = 60
              clearInterval(countDown)
              } else {
                this.disableCode = true
                this.getCode = this.count-- + 's' 
              }
            }, 1000)
            message.success('发送成功')
          }else{
            message.error(res.data.msg)
          }
      })
      
    }
  },
}
</script>
