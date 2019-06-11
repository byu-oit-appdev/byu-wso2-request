'use strict'
/* global describe it */

const setEnv = require('../lib/setEnv')
setEnv.setEnvFromFile('testing.json')

const clientKey = process.env.WSO2_CLIENT_KEY || 'client-id'
const clientSecret = process.env.WSO2_CLIENT_SECRET || 'client-secret'
// const wellKnownUrl = process.env.WSO2_WELLKNOWN_URL || 'well-known-url'

const wso2Request = require('../index')
const byuOauth = require('byu-wabs-oauth')
const expect = require('chai').expect
const request = require('request-promise')
const sleep = function (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe('wso2requestRetryExpired', async function () {
  const oauth = await byuOauth(clientKey, clientSecret)
  it('expired', async function () {
    let attempts = 0
    const maxAttemps = 2
    let response = {}
    let wso2OauthToken = null

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

    while (attempts < maxAttemps) {
      attempts += 1
      if (!wso2OauthToken) {
        wso2OauthToken = await oauth.getClientGrantToken()
      }
      if (!requestObject.hasOwnProperty('headers')) {
        requestObject.headers = {}
      }

      // let sleepmins = 1
      console.log(Date(), 'sleeping for:', wso2OauthToken.expiresIn + 2)
      // wso2OauthToken.accessToken = "be430f015f8256c47d427e5a28ff4b0";
      await sleep(wso2OauthToken.expiresIn + 2)
      requestObject.headers.Authorization = wso2Request.oauthHttpHeaderValue(wso2OauthToken)
      console.log(Date(), 'Making attempt', attempts)
      try {
        response = await request(requestObject)
      } catch (e) {
        console.log(e)
        response = e.response
      }
      console.log('response.statusCode:', response.statusCode)
      expect(response.statusCode).to.equal(401)

      if (response.statusCode === 401) {
        console.log('Detected unauthorized request.  Revoking token')
        // yield byuOauth.revokeTokens(wso2OauthToken.accessToken);
        wso2OauthToken = null
      } else {
        break
      }
    }
    expect(attempts).to.equal(2)
  }).timeout(1000000)
})
