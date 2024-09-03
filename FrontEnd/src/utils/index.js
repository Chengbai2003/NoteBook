import { baseUrl } from 'config'
const MODE = import.meta.env.MODE // 环境变量

export const typeMap = {
  1: {
    icon: 'catering'
  },
  2: {
    icon: 'skin'
  },
  3: {
    icon: 'gongjiao'
  },
  4: {
    icon: 'commodity'
  },
  5: {
    icon: 'shop-car'
  },
  6: {
    icon: 'education'
  },
  7: {
    icon: 'medical'
  },
  8: {
    icon: 'journey'
  },
  9: {
    icon: 'renqing'
  },
  10: {
    icon: 'other'
  },
  11: {
    icon: 'wage'
  },
  12: {
    icon: 'bonus'
  },
  13: {
    icon: 'zhuanzhang'
  },
  14: {
    icon: 'financial'
  },
  15: {
    icon: 'tuikuan'
  },
  16: {
    icon: 'more'
  }
}

export const REFRESH_STATE = {
  normal: 0, // 普通
  pull: 1, // 下拉刷新（未满足刷新条件）
  drop: 2, // 释放立即刷新（满足刷新条件）
  loading: 3, // 加载中
  success: 4, // 加载成功
  failure: 5, // 加载失败
};

export const LOAD_STATE = {
  normal: 0, // 普通
  abort: 1, // 中止
  loading: 2, // 加载中
  success: 3, // 加载成功
  failure: 4, // 加载失败
  complete: 5, // 加载完成（无新数据）
};

export const imgUrlTrans = (url) => {
  if (url && url.startsWith('http')) {
    return url
  } else {
    url = `${MODE == 'development' ? 'http://api.chennick.wang' : baseUrl}${url}`
    return url
  }
}

