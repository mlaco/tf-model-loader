const concatenateArrayBuffers = require(`${__dirname}/lib/utils`)
const fs = require('fs')
const path = require('path')
const Buffer = require('buffer').Buffer

module.exports = async function(source) {
  const modelConfig = JSON.parse(source)
  const modelTopology = modelConfig['modelTopology']
  const weightsManifest = modelConfig['weightsManifest']

  // We do not allow both modelTopology and weightsManifest to be missing.
  if (modelTopology == null && weightsManifest == null) {
    throw new Error(
      `The JSON from HTTP path ${this.path} contains neither model ` +
        `topology or manifest for weights.`
    )
  }

  const shardPaths = []
  weightsManifest.forEach(weightsGroup => {
    weightsGroup.paths.forEach(path => {
      shardPaths.push('../model/' + path)
    })
  })

  const weightSpecs = []
  for (const entry of weightsManifest) {
    weightSpecs.push(...entry.weights)
  }

  const arrayBuffers = []
  shardPaths.forEach(filepath => {
    const leafname = path.basename(filepath)
    const data = fs.readFileSync(`./model/${leafname}`)
    arrayBuffers.push(data)
  })
  const weightDataBuffer = concatenateArrayBuffers(arrayBuffers)
  const weightDataString64 = Buffer.from(weightDataBuffer).toString('base64')

  return JSON.stringify(`
    var modelLoader = {
      load: function() {
        const weightData = "${weightDataString64}"

        const preBuf = new ArrayBuffer(weightData.length*2)
        const buf = new Uint16Array(preBuf)
        for (var i=0, strLen=weightData.length; i < strLen; i++) {
          buf[i] = weightData.charCodeAt(i);
        }

        const weightDataBuffer = buf.buffer.slice(
          buf.byteOffset,
          buf.byteOffset + buf.byteLength
        );

        return {
          modelTopology: ${JSON.stringify(modelTopology)},
          weightSpecs: ${JSON.stringify(weightSpecs)},
          weightData: weightDataBuffer
        }
      }
    }
  `)
}
