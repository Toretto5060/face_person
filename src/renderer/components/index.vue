<template>
  <div class="index">
    <div class="load" v-if="loadShow">
      <v-load></v-load>
    </div>
    <div class="contenr">
      <div class="videocon">
        <video  ref="video" id="video" width="640" height="480" autoplay></video>
      </div>
      <div class="draw">
        <canvas ref="drawIcon" id="canvas"  width="640" height="480"></canvas>
      </div>

      <div class="bgDraw" ref="fBgDraw">
        <canvas ref="bgDraw"></canvas>
      </div>
      <!--<div class="cancon">-->
        <!--<canvas ref="canvas" width="200" height="150"></canvas>-->
      <!--</div>-->
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
        loadShow: true,
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
      // 开启摄像头
      getVideo() {
        let video = this.$refs.video;
        let videoObj = {
          video: true,
          // audio: true
        }
        let that = this;
        navigator.mediaDevices
          .getUserMedia(videoObj)
          .then(function (mediaStream) {
            that.mediaStreamTrack = mediaStream
            video.srcObject = mediaStream
            video.play()
            that.mediaRecorder = new MediaRecorder(mediaStream, {
              audioBitsPerSecond : 128000,  // 音频码率
              videoBitsPerSecond : 500000,  // 视频码率
              mimeType : 'video/webm;codecs=h264' // 编码格式
            })
            setTimeout(function () {
              // let fBgCanvas = that.$refs.fBgDraw;
              // let bgCanvas = that.$refs.bgDraw;
              // let bgVideo = that.$refs.video
              // let bgType = bgCanvas.getContext('2d');
              // bgType.drawImage(bgVideo, 0, 0, fBgCanvas.offsetWidth, fBgCanvas.offsetHeight)

              that.faceInit()
            },1000)
            // self.drawBg()
          })
          .catch(function (error) {
            self.loadShow = false;
            alert('未检测到摄像头或摄像头被占用')
          });
      },
      // 人脸识别
      faceInit() {
        let that = this;
        let photoShow = false;
        // let video = document.getElementById('video');
        let canvas = this.$refs.drawIcon;
        let context = canvas.getContext('2d');
        let tracker = new tracking.ObjectTracker('face');
        tracker.setInitialScale(4);
        tracker.setStepSize(2);
        tracker.setEdgesDensity(0.1);
        tracking.track('#video', tracker, { camera: true });
        tracker.on('track', function(event) {
          if (!that.loadShow) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            event.data.forEach(function(rect) {
              let img = new Image();
              img.src = "./static/faceIcon.png";
              context.drawImage(img,rect.x, rect.y, rect.width, rect.height);
            });
          }
        });
        let showFace = setTimeout(() => {
          that.loadShow = false;
          clearTimeout(showFace)
        },100)
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
        let a = this.$refs.save
        // this.mediaRecorder.ondataavailable = function (e) {
        //   let encodedUri = URL.createObjectURL(e.data)
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
      .videocon{
        z-index: 99;
      }
      .draw{
        position: absolute;
        top: 0;
        left: 0;
      }
      .bgDraw {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        canvas {
          width: 100%;
          height: 100%;
          z-index: 9;
        }
        z-index: -1;
      }
    }
  }
</style>
