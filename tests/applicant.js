/**
 * Created by martin on 4/24/17.
 */

'use strict'
/* global describe it */

const setEnv = require('../lib/setEnv')
setEnv.setEnvFromFile('testing.json')

const wso2Request = require('../index').request
const expect = require('chai').expect

describe('applicant', function () {
  it('cesapi with invalid url', async function () {
    let requestObject = {
      url: 'https://api.byu.edu/cesapi/applicants/dev/471121066',
      method: 'GET',
      json: true,
      resolveWithFullResponse: true,
      simple: true,
      encoding: 'utf8',
      headers: {
        Accept: 'application/json'
      }
    }

    try {
      const response = await wso2Request(requestObject)
      expect(response.body).to.be.an('object')
      expect(response.statusCode).to.equal(200)
      expect(response.body).to.have.all.keys('basic')
      expect(response.body.basic).to.have.all.keys('metadata')
      expect(response.body.basic.metadata).to.have.all.keys('validation_response')
      expect(response.body.basic.metadata.validation_response).to.have.all.keys('code', 'message')
      expect(response.body.basic.metadata.validation_response.code).to.equal(403)
    } catch (e) {
      expect(e.statusCode).to.equal(404)
    }
  }).timeout(9000)
})
