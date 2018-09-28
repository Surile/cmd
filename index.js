#!/usr/bin/env node

const program = require('commander')
const findApiName = require('./file')

program
  .version('0.1.0')
  .description('生成 api 接口')
  .arguments('<request> <name>')
  .action((request, name) => {
    findApiName(name, request)
  })
  .parse(process.argv)
