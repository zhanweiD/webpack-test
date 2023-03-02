import React from 'react'
import {Button} from 'antd'

export default function Detail() {
  const t = window.cf_trans

  return <div>
    <h1>{t('detail')}</h1>
    <Button type='primary'>{t('btn', {number: 2})}</Button>
  </div>
}