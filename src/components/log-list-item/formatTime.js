const zeroFill = (num, cnt = 2) => {
  return num.toString().padStart(cnt, '0')
}

export default timestamp => {
  const now = new Date(timestamp)
  return `${zeroFill(now.getHours())}:${zeroFill(now.getMinutes())}:${zeroFill(now.getSeconds())}`
}
