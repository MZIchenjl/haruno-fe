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
      <a :href="`/logs/-/type=plain?date=${date}`">[日志]</a>
    </div>
    <transition-group v-if="slicedLogs.length" tag="ul" id="log-list" name="log-enter">
      <log-list-item v-for="log in slicedLogs" :key="log.time" v-bind="log" />
    </transition-group>
    <div v-else>连接中，请稍等...</div>
  </div>
</template>

<script>
import LogListItem from './components/log-list-item'
import moment from 'moment'
import Axios from 'axios'

export default {
  components: {
    LogListItem
  },
  data () {
    const now = Date.now()
    return {
      success: 0,
      now: now,
      fails: 0,
      start: now,
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
    date () {
      return moment(this.now).format('YYYY-MM-DD')
    },
    slicedLogs () {
      return this.logs.slice(0, 50)
    }
  },
  methods: {
    getStatus (callback) {
      Axios.get('/status')
        .then(res => res.data)
        .then(res => {
          this.success = res.success
          this.start = res.start
          this.fails = res.fails
          console.log('Haruno Status')
          console.log(`go: ${res.go}, version: ${res.version}`)
          callback && callback()
        })
        .catch(err => console.log(err))
    },
    setupWsHandlers () {
      const status = ['info', 'error', 'success']
      const ws = new WebSocket(`ws://${location.host}/logs/-/type=websocket`)
      ws.addEventListener('error', err => {
        this.logs.unshift({
          time: Date.now(),
          type: 'error',
          text: err.message
        })
      })
      ws.addEventListener('message', event => {
        const res = JSON.parse(event.data)
        switch (res.type) {
          case 1:
            this.fails++
            break
          case 2:
            this.success++
            break
          default:
            break
        }
        res.type = status[res.type]
        res.time = res.time * 1000
        this.logs.unshift(res)
      })
    }
  },
  mounted () {
    this.getStatus(() => {
      this.setupWsHandlers()
    })
    setInterval(() => {
      this.now = Date.now()
    }, 1000)
  }
}

</script>

<style lang="less">
@import "./typo.css";
@import "./components/log-list-item/index.less";
@import "./app.less";
</style>
