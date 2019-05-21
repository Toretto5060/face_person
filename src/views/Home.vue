<template>
  <div class="home">
    <div class="contenr">
      <div class="videocon">
        <video  ref="video" width="640" height="480" autoplay></video>
      </div>
      <div class="btncon">
        <input type="button"  style="width: 100px;height: 35px" value="开启认证" @click="getVideo">
        <input type="button"  style="width: 100px;height: 35px;" value="截取" @click="takePhoto">
        <input type="button" ref="bg"  style="width: 100px;height: 35px;" value="开始采集" @click="off">
        <input type="button" ref="close" style="width: 100px;height: 35px;" value="停止采集" @click="on">
        <a  ref="save" style="display:block;width: 100px;height: 35px;text-align: center;line-height: 35px">保存到本地</a>
        <span>{{videolength + "s"}}</span>
      </div>
      <div class="cancon">
        <canvas ref="canvas" width="200" height="150"></canvas>
      </div>
      <div id=""content></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "home",
  components: {},
  data() {
    return {
      mediaRecorder: "",
      mediaStreamTrack:'',
      videolength: 0,
      timer: null
    };
  },
  mounted() {
    window.addEventListener('beforeunload', e => this.beforeunloadFn(e))
  },
  methods: {
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
          })
          .catch(function (error) {
            console.log(error)
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
      this.mediaRecorder.ondataavailable = function (e) {
        var encodedUri = URL.createObjectURL(e.data)
        a.href = encodedUri
        a.download = `test.webm`
        console.log(encodedUri)
      }
    }
  }
};
</script>
