'use-strict'

import { observable } from "mobx"

var data = observable({
    userId: '',
    userName: '',
    userMail: '',
    userPhoto: '',
    userPhone: ''
})

module.exports = data;