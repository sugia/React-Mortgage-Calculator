import React from 'react'

import {
    getCookie,
} from './utils'

import dayjs from 'dayjs'

export const initialState = {
    homeValue: getCookie('homeValue') || 1000000,
    downPayment: getCookie('downPayment') || 200000,
    loanAmount: getCookie('loanAmount') || 800000,
    loanTermInYears: getCookie('loanTermInYears') || 30,
    interestRateRawNumber: getCookie('interestRateRawNumber') || 7,
    startMonth: dayjs(getCookie('startMonth'), 'YYYY-MM') || dayjs(new Date()),
    propertyTax: getCookie('propertyTax') || 10000,
    homeInsurance: getCookie('homeInsurance') || 1000,
    monthlyHOAPayment: getCookie('monthlyHOAPayment') || 200,
    PMIRateRawNumber: getCookie('PMIRateRawNumber') || 0,
}

const initialContext = {
    state: initialState,
    dispatch: () => null,
}

export const Context = React.createContext(initialContext)
