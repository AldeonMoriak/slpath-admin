import moment from 'moment-jalaali'

const toJalaaliConverter = (date: string) => {
  return moment(date, 'YYYY-M-D HH:mm:ss').format('jYYYY/jM/jD') as unknown
}

export default toJalaaliConverter
