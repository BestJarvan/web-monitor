export const formatDate = (time) => {
  let str = new Date(time)
  return str.toLocaleDateString().replace(/\//g, '-') + ' ' + str.toTimeString().substr(0, 8)
}
