<template>
  <li class="log" :class="type">
    <div>
      <span>[{{ $time$ }}]</span>
      <span>类型：{{ $type$ }}</span>
    </div>
    <pre class="log-text">{{ text }}</pre>
  </li>
</template>

<script>
import formatTime from './formatTime'
const TYPES = {
  success: '成功',
  info: '信息',
  error: '错误'
}

export default {
  name: 'LogListItem',
  props: {
    time: Number,
    type: String,
    text: String
  },
  computed: {
    $time$ () {
      return formatTime(this.time)
    },
    $type$ () {
      return TYPES[this.type]
    }
  }
}

</script>
