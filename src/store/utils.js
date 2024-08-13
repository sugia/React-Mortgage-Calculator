import Cookies from 'universal-cookie'

import {
    useState,
    useEffect,
} from 'react'


const cookies = new Cookies()

export const setCookies = (dict) => {
    for (const key in dict) {
        cookies.set(key, dict[key], { path: '/'})
    }
}

export const getCookie = (key) => {
    return cookies.get(key, { path: '/' })
}

export const removeCookie = (key) => {
    cookies.remove(key, { path: '/' })
}
