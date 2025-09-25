import { updateEmdV4BlockStatus, updateEmdV4BlockScore, updateEmdV4BlockTime } from '@/apis/emdV4/index.ts'

export const updateBlockStatust = (id, status, cb) => {
  updateEmdV4BlockStatus(id, status).then(res => {
    if (res.state == 200) {
      if (typeof cb == 'function') {
        cb()
      }
    }
  })
}

export const updateBlockScore = (id, score, cb) => {
  updateEmdV4BlockScore(id, score).then(res=> {
    if (res.state == 200) {
      if (typeof cb == 'function') {
        cb()
      }
    }
  })
}

export const updateBlockTime = (data, cb) => {
  updateEmdV4BlockTime(data).then(res => {
    if(res.state == 200) {
      if (typeof cb == 'function') {
        cb(res.data)
      }
    }
  })
}