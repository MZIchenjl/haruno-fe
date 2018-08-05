<template>
  <div id="status">
    <h1 class="title typo">晴乃运行状态</h1>
    <div id="status-line">
      <span class="status">
        <span>成功次数：</span>
        <span class="value text-success">{{ success }}</span>
      </span>
      <span class="status">
        <span>失败次数：</span>
        <span class="value text-fails">{{ fails }}</span>
      </span>
      <span class="status">
        <span>共运行：</span>
        <span class="value text-info">{{ totrun }}</span>
      </span>
    </div>
    <transition-group tag="ul" id="log-list" name="log-enter">
      <log-list-item v-for="log in _logs" :key="log.time" v-bind="log" />
    </transition-group>
  </div>
</template>

<script>
import LogListItem from './components/log-list-item'
import moment from 'moment'

export default {
  components: {
    LogListItem
  },
  data () {
    return {
      success: 0,
      now: Date.now(),
      fails: 0,
      start: 1531449841287,
      logs: []
    }
  },
  computed: {
    totrun () {
      const duration = moment.duration(
        moment(this.now).diff(moment(this.start))
      )
      let ret = ''
      const years = duration.years()
      const months = duration.months()
      const days = duration.days()
      const hours = duration.hours()
      const minutes = duration.minutes()
      const seconds = duration.seconds()
      if (years) {
        ret += years + '年'
      }
      if (months) {
        ret += months + '月'
      }
      if (days) {
        ret += days + '日'
      }
      if (hours) {
        ret += hours + '时'
      }
      if (minutes) {
        ret += minutes + '分'
      }
      if (seconds) {
        ret += seconds + '秒'
      }
      return ret
    },
    _logs () {
      return this.logs.slice(0, 50)
    }
  },
  mounted () {
    const status = ['info', 'error', 'success']
    const ws = new WebSocket('ws://demos.kaazing.com/echo')
    setInterval(() => {
      this.now = Date.now()
    }, 1000)
    ws.addEventListener('open', () => {
      this.logs.unshift({
        time: Date.now(),
        type: 'success',
        text: '远程日志服务连接成功！'
      })
      setInterval(() => {
        ws.send(Math.random())
      }, 2000)
    })
    ws.addEventListener('error', err => {
      this.logs.unshift({
        time: Date.now(),
        type: 'error',
        text: err.message
      })
    })
    ws.addEventListener('message', event => {
      const st = status[Math.floor(Math.random() * 3)]
      switch (st) {
        case status[1]:
          this.fails++
          break
        case status[2]:
          this.success++
          break
        default:
          break
      }
      this.logs.unshift({
        time: Date.now(),
        type: st,
        text: event.data
      })
    })
  }
}

</script>

<style lang="less">
@import "./typo.css";
@import "./components/log-list-item/index.less";
@import "./app.less";
</style>
