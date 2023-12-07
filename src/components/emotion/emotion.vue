<template>
  <div :style="{width: width + 'px' }">
    <el-input
        style="width: 100%;"
        :rows="10"
        type="textarea"
        placeholder="请输入内容"
        v-model="contentShow"
        :maxlength="maxText"
        @blur="handleInputBlur"
        show-word-limit
        :disabled="disabled"
    ></el-input>
    <div>
      <div class="emoji-box">
        <div @click="handleEmoji" class="cursor emoji-box"><img :src="emoji" alt="">添加表情</div>
        <div v-if="customerStatus" class="btm cursor" @click="addCustomer">客户昵称</div>
      </div>


      <div style="position: relative;" v-show="showEmoji">
        <div v-if="url" :style="{height: height}" class="qqface-container">
          <span class="qqface-wrapper" v-for="[key, value] of Object.entries(emoijs)" :key="value">
            <img :src="url" class="qqface" :class="[`qqface${value}`]" @click="input(key)">
          </span>
        </div>
      </div>

    </div>
    <div v-if="!!contentShowEmoji">
      <h5>效果展示</h5>
      <div class="text-show-box" v-html="contentShowEmoji"></div>
    </div>
  </div>
</template>

<script>
import emoji from "../../utils/emoji";
import qqface from '../../assets/qqface.png'
import { deleteEmoji, qqfaceArr } from '../../utils/util'
export default {
  name: "emotion",
  props: {
    width: {
      type: Number,
      default: 200,
    },
    content: {
      type: String,
      default: '',
    },
    button: {
      type: Boolean
    },
    height: {
      type: String,
      default: '200px'
    },
    maxText:{
      type: Number,
      default: 2000,
    },
    customerStatus:{
      type: Boolean,
      default: false,
    },
    disabled:{
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      emoji: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFIGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMDQtMjRUMTc6MzA6MzArMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTA0LTI3VDE3OjQ0OjM3KzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTA0LTI3VDE3OjQ0OjM3KzA4OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmEzMmQ1YjE2LWNkZjUtNDk5My1iMDc2LTg5NDIwMzBjMjIyMiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDphMzJkNWIxNi1jZGY1LTQ5OTMtYjA3Ni04OTQyMDMwYzIyMjIiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDphMzJkNWIxNi1jZGY1LTQ5OTMtYjA3Ni04OTQyMDMwYzIyMjIiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmEzMmQ1YjE2LWNkZjUtNDk5My1iMDc2LTg5NDIwMzBjMjIyMiIgc3RFdnQ6d2hlbj0iMjAxOS0wNC0yNFQxNzozMDozMCswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+GUGtVwAAAkZJREFUSIm11j1onVUcx/HPNZKAEBxcfEEQRBShU9SYQCAUOhqTxqTEwamo2RzNXxC6/Okg6ObSJR1Cmwgam4BL2iyaUloEJVIhg/gSV1/Q4YLE4Tk3PPfm3twg5g8PPM95+f7OOf+X8zQODg6cpj1wqnQ8eFxnZg5iujxjeBxN/Iyv8SnWI6LZi9FzB5k5g128hW2cwzAewSul7W3sZub5XpxGpw8ycwCJKSxGxHbvPZKZk/gYnyMi4p9+O0i8jNF+cBVxGy9htMxtszaBzHwNr2IqIv7oB6+J/NmaVxiHdnhExaF7WIiIL08K71jgOK7j6Zbj6zuYw/f/FQ4R8RXuY77VVheYxmrHinYyc7nPqpczc6fWtFpYRwRexK0ujH7J2Oj4vokXWh/1RHsUP9ZHRsRYH7iIeKOj6Sc81k2giSE0M7OJv3DSQtXAUEQ81NlRF/gVT6ictIcLEfHtSeiZeUYVPfBkYaH9fL/BRHnfUIuEE9gsvijvZ3G3m8BnNehHeDMzn+lHLmMW8UFpmi+sIwJreDYzxyNiH+9h8ziR0repqkH7mTmG5woLHcUuM+dwCWMR8Xtmvo4PcQXX8F0Z+jwWcBHvRMRKZj6M23g/Ig4F2mK8dGxgPTOHI2JFFdMDWMHf+A1XVRE2UuDDWMeNOpzuF86Sygd3MrNVrt8tT7djmlSV660yt82O3Ae1ibO4jB9U6b+lSqJBVShOqBz6FJYi4pNunJ4CRWRQVQRnMKLKE/gF91RX5tpxV+axAv+Hnfpfxb9DlNE9K+wyIgAAAABJRU5ErkJggg==',
      list: ['[微笑]', '[撇嘴]', '[色]', '[发呆]', '[得意]', '[流泪]', '[害羞]', '[闭嘴]', '[睡]', '[大哭]', '[尴尬]', '[发怒]', '[调皮]', '[呲牙]', '[惊讶]', '[难过]', '[酷]', '[冷汗]', '[抓狂]', '[吐]', '[偷笑]', '[愉快]', '[白眼]', '[傲慢]', '[饥饿]', '[困]', '[惊恐]', '[流汗]', '[憨笑]', '[悠闲]', '[奋斗]', '[咒骂]', '[疑问]', '[嘘]', '[晕]', '[折磨]', '[衰]', '[骷髅]', '[敲打]', '[再见]', '[擦汗]', '[抠鼻]', '[鼓掌]', '[糗大了]', '[坏笑]', '[左哼哼]', '[右哼哼]', '[哈欠]', '[鄙视]', '[委屈]', '[快哭了]', '[阴险]', '[亲亲]', '[吓]', '[可怜]', '[菜刀]', '[西瓜]', '[啤酒]', '[篮球]', '[乒乓]', '[咖啡]', '[饭]', '[猪头]', '[玫瑰]', '[凋谢]', '[示爱]', '[爱心]', '[心碎]', '[蛋糕]', '[闪电]', '[炸弹]', '[刀]', '[足球]', '[瓢虫]', '[便便]', '[月亮]', '[太阳]', '[礼物]', '[拥抱]', '[强]', '[弱]', '[握手]', '[胜利]', '[抱拳]', '[勾引]', '[拳头]', '[差劲]', '[爱你]', '[NO]', '[OK]', '[爱情]', '[飞吻]', '[跳跳]', '[发抖]', '[怄火]', '[转圈]', '[磕头]', '[回头]', '[跳绳]', '[挥手]', '[激动]', '[街舞]', '[献吻]', '[左太极]', '[右太极]'],
      showEmoji: false,
      contentShow: this.content,
      contentShowEmoji: '',
      emoijs: qqfaceArr,
      url: qqface,//'https://mars-ly-oss.malldongli.com/qqface.png',//'https://cdn-9gvbsn1n5046b67b-1301839800.tcloudbaseapp.com/emojis/qqface.png',
      cursorIndex:null,
    }
  },
  watch: {
    contentShow(newVal, oldVal) {
      this.contentShowEmoji = this.$string2emoji(newVal)
      this.$emit('getChildInfo', newVal)
    },
    content(newVal, oldVal) {
      this.contentShow = newVal
    },
    immediate: true
  },
  created() {
    emoji.toEmotion(this.contentShow)
  },
  mounted() {

  },
  methods: {

    //失去焦点
    handleInputBlur(e){
      this.cursorIndex = e.srcElement.selectionStart;
    },

    input(key){
      let index = this.cursorIndex
      let str = this.contentShow
      this.contentShow = str.slice(0, index) + key + str.slice(index);
      this.cursorIndex =  this.cursorIndex + key.length
    },
    deleteEmoji(){
      this.$emit('input', deleteEmoji(this.value))
    },


    handleEmoji() {
      if (this.disabled) return
      this.showEmoji = !this.showEmoji
    },

    addCustomer(){
      this.contentShow += '#客户昵称#'
    },
  }
}
</script>

<style lang="scss">
.cursor {
  cursor: pointer
}

.text-show-box {
  display: block;
  resize: vertical;
  padding: 5px 15px;
  line-height: 1.5;
  box-sizing: border-box;
  width: 100%;
  font-size: inherit;
  color: #606266;
  background-color: #FFF;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
  min-height: 200px;
  word-wrap: break-word;
  word-break: break-all;
  white-space: break-spaces;
}


.qqface-container {
  overflow: overlay;
  .qqface-wrapper {
    cursor: pointer;
    display: inline-block;
    transform: scale(1);
    margin: 5px
  }
}

.qqface-wrapper {
  width: 24px;
  height: 24px;
  margin-bottom: -5px;
  position: relative;
  overflow: hidden;
  .qqface {
    width: 280px;
    position: absolute;
    &.qqface0 {
      clip-path: circle(16px at 12px 12px);
    }
    &.qqface1 {
      left: -36px;
      clip-path: circle(16px at 48px 12px);
    }
    &.qqface2 {
      left: -72px;
      clip-path: circle(16px at 84px 12px);
    }
    &.qqface3 {
      left: -109px;
      clip-path: circle(16px at 120px 12px);
    }
    &.qqface4 {
      left: -145px;
      clip-path: circle(16px at 158px 12px);
    }
    &.qqface5 {
      left: -182px;
      clip-path: circle(16px at 194px 12px);
    }
    &.qqface6 {
      left: -219px;
      clip-path: circle(16px at 230px 12px);
    }
    &.qqface7 {
      left: -256px;
      clip-path: circle(16px at 266px 12px);
    }
    &.qqface8 {
      top: -36px;
      clip-path: circle(16px at 12px 48px);
    }
    &.qqface9 {
      top: -36px;
      left: -36px;
      clip-path: circle(16px at 48px 48px);
    }
    &.qqface10 {
      top: -36px;
      left: -72px;
      clip-path: circle(16px at 84px 48px);
    }
    &.qqface11 {
      top: -36px;
      left: -110px;
      clip-path: circle(16px at 120px 48px);
    }
    &.qqface12 {
      top: -36px;
      left: -146px;
      clip-path: circle(16px at 158px 48px);
    }
    &.qqface13 {
      top: -36px;
      left: -182px;
      clip-path: circle(16px at 194px 48px);
    }
    &.qqface14 {
      top: -36px;
      left: -219px;
      clip-path: circle(16px at 230px 48px);
    }
    &.qqface15 {
      top: -36px;
      left: -256px;
      clip-path: circle(16px at 266px 48px);
    }
    &.qqface17 {
      top: -74px;
      clip-path: circle(16px at 12px 84px);
    }
    &.qqface18 {
      top: -74px;
      left: -36px;
      clip-path: circle(16px at 48px 84px);
    }
    &.qqface19 {
      top: -74px;
      left: -72px;
      clip-path: circle(16px at 84px 84px);
    }
    &.qqface20 {
      top: -74px;
      left: -109px;
      clip-path: circle(16px at 120px 84px);
    }
    &.qqface21 {
      top: -74px;
      left: -145px;
      clip-path: circle(16px at 158px 84px);
    }
    &.qqface22 {
      top: -74px;
      left: -182px;
      clip-path: circle(16px at 194px 84px);
    }
    &.qqface23 {
      top: -74px;
      left: -219px;
      clip-path: circle(16px at 230px 84px);
    }
    &.qqface25 {
      top: -74px;
      left: -256px;
      clip-path: circle(16px at 266px 84px);
    }
    &.qqface26 {
      top: -110px;
      clip-path: circle(16px at 12px 121px);
    }
    &.qqface28 {
      top: -110px;
      left: -36px;
      clip-path: circle(16px at 48px 121px);
    }
    &.qqface29 {
      top: -110px;
      left: -72px;
      clip-path: circle(16px at 84px 121px);
    }
    &.qqface31 {
      top: -110px;
      left: -110px;
      clip-path: circle(16px at 120px 121px);
    }
    &.qqface32 {
      top: -110px;
      left: -146px;
      clip-path: circle(16px at 158px 121px);
    }
    &.qqface33 {
      top: -110px;
      left: -182px;
      clip-path: circle(16px at 194px 121px);
    }
    &.qqface34 {
      top: -110px;
      left: -219px;
      clip-path: circle(16px at 230px 121px);
    }
    &.qqface36 {
      top: -110px;
      left: -256px;
      clip-path: circle(16px at 266px 121px);
    }
    &.qqface37 {
      top: -147px;
      clip-path: circle(16px at 12px 157px);
    }
    &.qqface38 {
      top: -147px;
      left: -36px;
      clip-path: circle(16px at 48px 157px);
    }
    &.qqface39 {
      top: -147px;
      left: -73px;
      clip-path: circle(16px at 85px 160px);
    }
    &.qqface40 {
      top: -147px;
      left: -109px;
      clip-path: circle(16px at 120px 157px);
    }
    &.qqface41 {
      top: -147px;
      left: -145px;
      clip-path: circle(16px at 158px 157px);
    }
    &.qqface42 {
      top: -147px;
      left: -183px;
      clip-path: circle(16px at 194px 157px);
    }
    &.qqface44 {
      top: -147px;
      left: -219px;
      clip-path: circle(16px at 230px 157px);
    }
    &.qqface46 {
      top: -147px;
      left: -256px;
      clip-path: circle(16px at 266px 157px);
    }
    &.qqface48 {
      top: -184px;
      clip-path: circle(16px at 12px 196px);
    }
    &.qqface49 {
      top: -184px;
      left: -36px;
      clip-path: circle(16px at 48px 196px);
    }
    &.qqface50 {
      top: -184px;
      left: -72px;
      clip-path: circle(16px at 84px 196px);
    }
    &.qqface51 {
      top: -184px;
      left: -109px;
      clip-path: circle(16px at 120px 196px);
    }
    &.qqface52 {
      top: -184px;
      left: -145px;
      clip-path: circle(16px at 158px 196px);
    }
    &.qqface54 {
      top: -184px;
      left: -182px;
      clip-path: circle(16px at 194px 196px);
    }
    &.qqface53 {
      top: -184px;
      left: -219px;
      clip-path: circle(16px at 230px 196px);
    }
    &.qqface47 {
      top: -184px;
      left: -256px;
      clip-path: circle(16px at 266px 198px);
    }
    &.qqface35 {
      top: -222px;
      clip-path: circle(16px at 12px 234px);
    }
    &.qqface16 {
      top: -222px;
      left: -36px;
      clip-path: circle(16px at 48px 234px);
    }
    &.qqface45 {
      top: -222px;
      left: -72px;
      clip-path: circle(16px at 84px 234px);
    }
    &.qqface24 {
      top: -222px;
      left: -109px;
      clip-path: circle(16px at 120px 234px);
    }
    &.qqface27 {
      top: -222px;
      left: -145px;
      clip-path: circle(16px at 158px 234px);
    }
    &.qqface30 {
      top: -222px;
      left: -182px;
      clip-path: circle(16px at 194px 234px);
    }
    &.qqface43 {
      top: -222px;
      left: -219px;
      clip-path: circle(16px at 230px 234px);
    }
    &.qqface55 {
      top: -222px;
      left: -256px;
      clip-path: circle(16px at 266px 234px);
    }
    &.qqface56 {
      top: -258px;
      clip-path: circle(16px at 12px 270px);
    }
    &.qqface57 {
      top: -258px;
      left: -36px;
      clip-path: circle(16px at 48px 270px);
    }
    &.qqface58 {
      top: -258px;
      left: -72px;
      clip-path: circle(16px at 84px 270px);
    }
    &.qqface59 {
      top: -258px;
      left: -109px;
      clip-path: circle(16px at 120px 270px);
    }
    &.qqface60 {
      top: -258px;
      left: -145px;
      clip-path: circle(16px at 158px 270px);
    }
    &.qqface61 {
      top: -258px;
      left: -182px;
      clip-path: circle(16px at 194px 270px);
    }
    &.qqface62 {
      top: -258px;
      left: -219px;
      clip-path: circle(16px at 230px 270px);
    }
    &.qqface74 {
      top: -258px;
      left: -256px;
      clip-path: circle(16px at 266px 270px);
    }
    &.qqface63 {
      top: -294px;
      clip-path: circle(16px at 12px 306px);
    }
    &.qqface64 {
      top: -294px;
      left: -36px;
      clip-path: circle(16px at 48px 306px);
    }
    &.qqface65 {
      top: -294px;
      left: -72px;
      clip-path: circle(16px at 84px 306px);
    }
    &.qqface66 {
      top: -294px;
      left: -109px;
      clip-path: circle(16px at 120px 306px);
    }
    &.qqface67 {
      top: -294px;
      left: -145px;
      clip-path: circle(16px at 158px 306px);
    }
    &.qqface68 {
      top: -294px;
      left: -182px;
      clip-path: circle(16px at 194px 306px);
    }
    &.qqface69 {
      top: -294px;
      left: -219px;
      clip-path: circle(16px at 230px 306px);
    }
    &.qqface70 {
      top: -294px;
      left: -256px;
      clip-path: circle(16px at 266px 306px);
    }
    &.qqface71 {
      top: -330px;
      clip-path: circle(16px at 12px 342px);
    }
    &.qqface72 {
      top: -330px;
      left: -36px;
      clip-path: circle(16px at 48px 342px);
    }
    &.qqface73 {
      top: -330px;
      left: -73px;
      clip-path: circle(16px at 84px 342px);
    }
    &.qqface75 {
      top: -330px;
      left: -109px;
      clip-path: circle(16px at 120px 342px);
    }
    &.qqface76 {
      top: -330px;
      left: -145px;
      clip-path: circle(16px at 158px 342px);
    }
    &.qqface77 {
      top: -330px;
      left: -182px;
      clip-path: circle(16px at 194px 342px);
    }
    &.qqface78 {
      top: -330px;
      left: -219px;
      clip-path: circle(16px at 230px 342px);
    }
    &.qqface79 {
      top: -330px;
      left: -256px;
      clip-path: circle(16px at 266px 342px);
    }
    &.qqface80 {
      top: -366px;
      clip-path: circle(16px at 12px 378px);
    }
    &.qqface81 {
      top: -366px;
      left: -36px;
      clip-path: circle(16px at 48px 378px);
    }
    &.qqface82 {
      top: -366px;
      left: -72px;
      clip-path: circle(16px at 84px 378px);
    }
    &.qqface83 {
      top: -366px;
      left: -109px;
      clip-path: circle(16px at 120px 378px);
    }
    &.qqface84 {
      top: -366px;
      left: -145px;
      clip-path: circle(16px at 158px 378px);
    }
    &.qqface85 {
      top: -366px;
      left: -182px;
      clip-path: circle(16px at 194px 378px);
    }
    &.qqface86 {
      top: -366px;
      left: -219px;
      clip-path: circle(16px at 230px 378px);
    }
    &.qqface87 {
      top: -366px;
      left: -256px;
      clip-path: circle(16px at 266px 378px);
    }
    &.qqface88 {
      top: -404px;
      clip-path: circle(16px at 12px 416px);
    }
    &.qqface89 {
      top: -404px;
      left: -36px;
      clip-path: circle(16px at 48px 416px);
    }
    &.qqface90 {
      top: -404px;
      left: -72px;
      clip-path: circle(16px at 84px 416px);
    }
    &.qqface91 {
      top: -404px;
      left: -109px;
      clip-path: circle(16px at 120px 416px);
    }
    &.qqface92 {
      top: -404px;
      left: -145px;
      clip-path: circle(16px at 158px 416px);
    }
    &.qqface93 {
      top: -404px;
      left: -182px;
      clip-path: circle(16px at 194px 416px);
    }
    &.qqface94 {
      top: -404px;
      left: -219px;
      clip-path: circle(16px at 230px 416px);
    }
    &.qqface95 {
      top: -404px;
      left: -256px;
      clip-path: circle(16px at 267px 416px);
    }
    &.qqface96 {
      top: -441px;
      clip-path: circle(16px at 12px 452px);
    }
    &.qqface97 {
      top: -441px;
      left: -36px;
      clip-path: circle(16px at 48px 452px);
    }
    &.qqface98 {
      top: -441px;
      left: -72px;
      clip-path: circle(16px at 84px 452px);
    }
    &.qqface99 {
      top: -441px;
      left: -109px;
      clip-path: circle(16px at 120px 452px);
    }
    &.qqface100 {
      top: -441px;
      left: -145px;
      clip-path: circle(16px at 158px 452px);
    }
    &.qqface101 {
      top: -441px;
      left: -182px;
      clip-path: circle(16px at 194px 452px);
    }
    &.qqface102 {
      top: -441px;
      left: -219px;
      clip-path: circle(16px at 230px 452px);
    }
    &.qqface103 {
      top: -441px;
      left: -256px;
      clip-path: circle(16px at 266px 452px);
    }
    &.qqface104 {
      top: -477px;
      clip-path: circle(16px at 12px 489px);
    }
    &.qqface105 {
      top: -477px;
      left: -36px;
      clip-path: circle(16px at 48px 489px);
    }
    &.qqface106 {
      top: -477px;
      left: -72px;
      clip-path: circle(16px at 84px 489px);
    }
    &.qqface107 {
      top: -477px;
      left: -109px;
      clip-path: circle(16px at 120px 489px);
    }
    &.qqface108 {
      top: -477px;
      left: -145px;
      clip-path: circle(16px at 158px 489px);
    }
  }
  &:after {
    content: "";
  }
}


.picker-button {
  position: absolute;
  right: 20px;
  bottom: 20px;
  background: #fff;
  padding: 10px 20px 4px 20px;
  border-radius: 6px;
}
.emoji-box{
  display: flex;
  align-items: center;
}
.btm{
  width: auto;
  height: 26px;
  line-height: 20px;
  padding: 2px 4px;
  border-radius: 4px;
  margin-left: 10px;
  background-color: #ecf5ff;
  color: #409eff;
  border: 1px solid #d9ecff;
}
</style>
