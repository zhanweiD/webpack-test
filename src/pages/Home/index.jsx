import React from 'react'
import {Button} from 'antd'
import './index.styl'

export default function Home() {
  console.log(window)
  const t = window.cf_trans
  return <div>
    <h1 className='home'>{t('home')}</h1>
    <Button type='primary'>{t('btn', {number: 1})}</Button>
  </div>
}