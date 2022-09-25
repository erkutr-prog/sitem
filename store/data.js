'use-strict'

import { observable } from "mobx"

var data = observable({
    userId: '',
    userName: '',
    userMail: ''
})

module.exports = data;