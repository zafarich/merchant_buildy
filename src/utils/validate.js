import { trimBetween } from 'src/utils/helpers'

export const regExp = {
  password: /^[\w.!@#$%^&*=-|\\/]{6,}$/,
  string: /^[a-zA-Zа-яА-Я]/,
  latin: /^[a-zA-Z]/,
  number: /^[0-9.]*$/,
  email:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  date: /^(0?[1-9]|[12][0-9]|3[01])[\\/\\-\\.](0?[1-9]|1[012])[\\/\\-\\.]\d{4}$/,
}

export default {
  required: (v) => !!trimBetween(v) || "To'ldirish shart",
  phone_number: (v) =>
    trimBetween(v)?.length === 9 || "Telefon raqam 9 ta raqamdan iborat bo'lishi kerak",
  number: (v) => !v || regExp.number.test(Math.abs(trimBetween(v))) || 'Butun son kiriting',
  integer: (v) => !v || Number(v) === parseInt(trimBetween(v)) || 'Butun son kiriting',
  float: (v) => !v || Number(v) === parseFloat(trimBetween(v)) || "O'nlik son kiriting",
  email: (v) => regExp.email.test(v) || "Email manzilni to'g'ri kiriting",
  positive: (v) => Number(trimBetween(v)) >= 0 || 'Musbat son kiriting',
  min_string: (v, n) => trimBetween(v).toString().length >= n || `Kamida ${n} ta belgi kiriting`,
  max_string: (v, n) =>
    trimBetween(v).toString().length <= n || `Ko'pi bilan ${n} ta belgi kiriting`,
  max100: (v) => Number(trimBetween(v)) <= 100 || "Qiymat 100 dan katta bo'lmasligi kerak",
  date: (v) => (v ? regExp.date.test(v) || "Sana noto'g'ri kiritilgan" : true),
  time: (v) => regExp.time.test(v),
  string: (v) => regExp.string.test(v) || 'Matn kiriting',
  fulltime: (v) => regExp.fulltime.test(v),
  timeOrFulltime: (v) => regExp.timeOrFulltime.test(v),
  password: (v) =>
    regExp.password.test(v) ||
    "Parol kamida 8 ta belgidan iborat bo'lishi va kamida 1 ta katta harf, 1 ta son va 1 ta maxsus belgi bo'lishi kerak",
  latin: (v) => regExp.latin.test(v) || 'Faqat lotin harflari kiriting',
  tag: (v) => !regExp.tag.test(v) || "Tag noto'g'ri kiritilgan",
  unique: (data, v, fieldName) => {
    const res = data.filter((el) => el[fieldName] === v)
    return res?.length === 1 || 'Bu qiymat allaqachon mavjud'
  },
}
