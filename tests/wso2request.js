'use strict'
/* global describe it */

const setEnv = require('../lib/setEnv')
setEnv.setEnvFromFile('testing.json')

const wso2Request = require('../index').request
const expect = require('chai').expect
const Promise = require('bluebird')

const co = Promise.coroutine

describe('wso2request', function () {
  it('can get api', co(function * () {
    let requestObject = {
      url: 'https://api.byu.edu/curriculum/v1.0/academicProgram/32977',
      method: 'GET',
      json: true,
      resolveWithFullResponse: true,
      simple: true,
      encoding: 'utf8',
      headers: {
        Accept: 'application/json'
      }
    }

    const response = yield wso2Request(requestObject)
    expect(response.body).to.be.an('object')
    expect(response.statusCode).to.equal(200)
    expect(response.body.value.identifying.programId.value).to.equal('32977')
  }))

  it('can get api with callback', co(function * () {
    let requestObject = {
      url: 'https://api.byu.edu/curriculum/v1.0/academicProgram/32977',
      method: 'GET',
      json: true,
      resolveWithFullResponse: true,
      simple: true,
      encoding: 'utf8',
      headers: {
        Accept: 'application/json'
      }
    }

    wso2Request(requestObject, function (err, response) {
      if (err) throw err
      expect(response.body).to.be.an('object')
      expect(response.statusCode).to.equal(200)
      expect(response.body.value.identifying.programId.value).to.equal('32977')
    })
  }))

  it('can get api with original jwt', co(function * () {
    let requestObject = {
      url: 'https://api.byu.edu/curriculum/v1.0/academicProgram/32977',
      method: 'GET',
      json: true,
      resolveWithFullResponse: true,
      simple: true,
      encoding: 'utf8',
      headers: {
        Accept: 'application/json'
      }
    }

    wso2Request(requestObject, process.env.ORIGINAL_JWT, function (err, response) {
      if (err) throw err
      expect(response.body).to.be.an('object')
      expect(response.statusCode).to.equal(200)
      expect(response.body.value.identifying.programId.value).to.equal('32977')
    })
  }))
})
