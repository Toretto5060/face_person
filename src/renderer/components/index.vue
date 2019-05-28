<template>
  <div class="index">
    <div class="load" v-if="loadShow">
      <v-load></v-load>
    </div>
    <div class="contenr">
      <div class="videocon">
        <video  ref="video" id="video" width="640" height="480" autoplay></video>
      </div>
      <div class="draw" :style="{width: drawWidth+'px', height:drawHeight+'px',left:drawLeft+'px',top:drawTop+'px'}" v-if="drawShow">
        <!--<canvas id="canvas"  width="640" height="480"></canvas>-->
      </div>
      <div class="cancon">
        <canvas ref="canvas" width="200" height="150"></canvas>
      </div>
      <div id="content"></div>
    </div>
  </div>
</template>

<script>
  import VLoad from "../page/loading";
  export default {
    name: "home",
    components: {
      VLoad
    },
    data() {
      return {
        loadShow: false,
        drawShow:false,
        drawWidth:0,
        drawHeight:0,
        drawLeft:0,
        drawTop:0,
        mediaRecorder: "",
        mediaStreamTrack:'',
        videolength: 0,
        timer: null
      };
    },
    mounted() {
      this.getVideo();
    },
    methods: {
      drawBg() {
        let canvasCon =  this.$refs.canvas
        let context = canvasCon.getContext("2d");
        context.drawImage(this.$refs.video, 0, 0, 640, 480);
        let imgSrc = canvasCon.toDataURL("image/png");
      },
      // 开启摄像头
      getVideo() {
        var video = this.$refs.video;
        var videoObj = {
          video: true,
          // audio: true
        }
        let self = this;
        navigator.mediaDevices
          .getUserMedia(videoObj)
          .then(function (mediaStream) {
            self.mediaStreamTrack = mediaStream
            video.srcObject = mediaStream
            video.play()
            self.mediaRecorder = new MediaRecorder(mediaStream, {
              audioBitsPerSecond : 128000,  // 音频码率
              videoBitsPerSecond : 500000,  // 视频码率
              mimeType : 'video/webm;codecs=h264' // 编码格式
            })
            setTimeout(function () {
              self.faceInit()
            },1000)
            // self.drawBg()
          })
          .catch(function (error) {
            console.log(error)
          });
      },
      // 人脸识别
      faceInit() {
        let that = this;
        let photoShow = false;
        // var video = document.getElementById('video');

        // var canvas = document.getElementById('canvas');
        // var context = canvas.getContext('2d');

        var tracker = new tracking.ObjectTracker('face');
        tracker.setInitialScale(4);
        tracker.setStepSize(2);
        tracker.setEdgesDensity(0.1);
        tracking.track('#video', tracker, { camera: true });
        tracker.on('track', function(event) {
          event.data.forEach(function(rect) {
            // if (!event.data.length) {
            //   that.drawShow = false;
            // } else {
            //   that.drawWidth = rect.width;
            //   that. drawHeight = rect.height;
            //   that.drawLeft = rect.x;
            //   that.drawTop = rect.y;
            //   that.drawShow = true;
            // }
          });

        });
      },
      // 抓拍人脸
      takePhoto() {
        let canvasCon =  this.$refs.canvas
        let context = canvasCon.getContext("2d");
        context.drawImage(this.$refs.video, 0, 0, 200, 150);
        let imgSrc = canvasCon.toDataURL("image/png");
        console.log(imgSrc)
      },
      closeCamera() {
        this.mediaStreamTrack.getTracks().forEach(function (track) {
          track.stop();
        });
      },
      //开始采集
      off () {
        this.mediaRecorder.start()
        this.faceInit()
        console.log('采集成功')
        this.timer = setInterval(() => {
          this.videolength += 1
        },1000)
      },
      // 停止采集
      on () {
        this.mediaRecorder.stop()
        console.log('停止采集');
        clearInterval(this.timer);
        this.timer = null
        var a = this.$refs.save
        // this.mediaRecorder.ondataavailable = function (e) {
        //   var encodedUri = URL.createObjectURL(e.data)
        //   a.href = encodedUri
        //   a.download = `test.webm`
        //   console.log(encodedUri)
        // }
      }
    }
  };
</script>

<style lang="less">
  .index {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    .load{
      z-index: 999;
      width: 100%;
      height: 100%;
    }
    .contenr{
      z-index: 9;
      canvas{
        display: block;
      }
      .draw {
        position: absolute;
        border: 3px solid red;
      }
    }
  }
  /*.frostedGlass{*/
    /*position: absolute;*/
    /*top: 0;*/
    /*left: 0;*/
    /*width: 100%;*/
    /*height: 100%;*/
    /*canvas{*/
      /*width: 100%;*/
      /*height: 100%;*/
    /*}*/
  /*}*/
  /*.demo-container{*/
    /*position: relative;*/
  /*}*/
  /*.draw{*/
    /*position: absolute;*/
    /*top: 0;*/
    /*left: 0;*/
  /*}*/
  /*.btncon{*/
    /*position: absolute;*/
    /*left: 0;*/
    /*bottom: 0;*/
  /*}*/
</style>
