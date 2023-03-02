import { Button } from 'antd';
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import { IntlProvider, FormattedMessage } from 'react-intl'

import './styles/index.css'
import './styles/common.styl'

import {LOCALES,messages, glangToLocale} from './locale'

const Home = lazy(() => import(/* webpackChunkName: 'home' */'./pages/Home'))
const Detail = lazy(() => import(/* webpackChunkName: 'detail' */'./pages/Detail'))

export default function App() {
  const locale = glangToLocale(window.lang || 'cn')
  window.cf_trans = (key, obj) => {
    return <FormattedMessage id={key} values={obj} />
  }
  const t = window.cf_transStr = key => {
    return messages[locale][key]
  }

  const changeStyle = type => {
    document.getElementById('root').className = type
  }
  return (
    <IntlProvider locale={locale} key={locale} defaultLocale={LOCALES.ENGLISH} messages={messages[locale]}>
      <div className='p16'>
        <Button className='mr4' type="primary" onClick={() => changeStyle('')}>{t('during')}</Button>
        <Button className='mr4' type="primary" onClick={() => changeStyle('night')}>{t('night')}</Button>
        <Button className='mr4' type="primary" onClick={() => window.lang = 'en'}>{t('en')}</Button>
        <Button className='mr4 mb16' type="primary" onClick={() => window.lang = 'cn'}>{t('cn')}</Button>
        <ul className='p0'>
          <li><Link to='/home'>{t('home')}</Link></li>
          <li><Link to='/detail'>{t('detail')}</Link></li>
        </ul>
        <h1 className='home mt16'>{t('app')}</h1>
        <Suspense fallback={<div />}>
          <Routes>
            <Route path='/home' element={<Home />} />
              <Route path='/detail' element={<Detail />} />
              <Route path='/' element={<Home />} />
          </Routes>
        </Suspense>
      </div>
    </IntlProvider>
  )
}