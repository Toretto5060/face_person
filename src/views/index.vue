<template>
  <div class="test">

  </div>
</template>

<script>
  export default {
    name : 'test',
    data() {
      return {
        websock: null,
        reconnectionNum: 0
      }
    },
    created() {
      this.initWebSocket();
    },
    destroyed() {
      this.websock.close() //离开路由之后断开websocket连接
    },
    methods: {
      initWebSocket(){ //初始化weosocket
        const wsuri = "ws://192.168.6.129:1234";
        this.websock = new WebSocket(wsuri);
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        this.websock.onclose = this.websocketclose;
      },
      websocketonopen(){ //连接建立之后执行send方法
        let actions = {"test":"12345"};
        // 服务连接成功
        console.log('websocket已连接');
        this.reconnectionNum = 0;
        this.websocketsend(JSON.stringify(actions));
      },
      websocketsend(Data){ //数据发送
        this.websock.send(Data);
      },
      websocketonmessage(e){ //数据接收
        console.log(e)
      },
      websocketonerror(){//连接建立失败重连3次
        if (this.reconnectionNum < 3) {
          console.log('WebSocket异常!重新连接中...')
          let that = this;
          setTimeout(() => {
            that.initWebSocket();
          },1000);
          this.reconnectionNum += 1
        }
      },
      websocketclose(e){  //关闭
        console.log('websocket断开连接',e);
      },
    },
  }
</script>
<style lang='less'>

</style>
