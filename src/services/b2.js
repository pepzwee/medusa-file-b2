const fs = require('fs')
const aws = require('aws-sdk')
const { FileService } = require('medusa-interfaces')

class B2Service extends FileService {
  constructor({}, options) {
    super()

    this._bucket = options.bucket
    this._accessKeyId = options.access_key_id
    this._secretAccessKey = options.secret_access_key
    this._region = options.region
    this._endpoint = options.endpoint

    aws.config.credentials = new aws.SharedIniFileCredentials({ profile: 'b2' })
    aws.config.update({
      accessKeyId: this._accessKeyId,
      secretAccessKey: this._secretAccessKey,
      region: this._region
    })

    this._s3 = new aws.S3({
      endpoint: new aws.Endpoint(this._endpoint)
    })
  }

  upload(file) {
    const params = {
      ACL: "public-read",
      Bucket: this._bucket,
      Body: fs.createReadStream(file.path),
      Key: `${file.originalname}`,
    }

    return new Promise((resolve, reject) => {
      this._s3.upload(params, (err, data) => {
        if (err) {
          reject(err)
          return
        }

        resolve({ url: data.Location })
      })
    })
  }

  delete(file) {
    const params = {
      Bucket: this._bucket,
      Key: `${file}`,
    }

    return new Promise((resolve, reject) => {
      this._s3.deleteObject(params, (err, data) => {
        if (err) {
          reject(err)
          return
        }

        resolve(data)
      })
    })
  }
}

module.exports = B2Service