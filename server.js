import express from 'express'
//const express = require('express')
import dotenv from 'dotenv' 
import aws from 'aws-sdk'
import crypto from 'crypto'
import { promisify } from "util"

dotenv.config()
const AWSregion = "us-east-1" 
const name = "store-images-to-s3" //bucket name
const key1 = process.env.AWS_ACCESS_KEY_ID // access Key Id
const key2 = process.env.AWS_SECRET_ACCESS_KEY// secret Access Key
const randomBytes = promisify(crypto.randomBytes)

const URL = new aws.S3({
  AWSregion,
  key1,
  key2,
  signatureVersion: 'v4'
})

  
// to generate secure url 
export async function generate_url() {
  const rawBytes = await randomBytes(16)
  const imageName = rawBytes.toString('hex')

  const params = ({
    Bucket: name,
    Key: imageName,
    Expires: 60 // expiration of URL
  })
  
  const uploadURL = await URL.getSignedUrlPromise('putObject', params)
  return uploadURL 
}


// set up express server
const myApp = express()

myApp.get('/s3Url', async (req, res) => {
    //console.log("check if it workin")
    const url = await generate_url()
    res.send({url})
 
})
myApp.use(express.static('frontend'))

myApp.listen(8080, () => console.log("listening on port 8080"))
