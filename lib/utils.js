const path = require("path");

module.exports = function concatenateArrayBuffers(buffers) {
  let totalByteLength = 0;
  buffers.forEach(buffer => {
    totalByteLength += buffer.byteLength;
  });

  const temp = new Uint8Array(totalByteLength);
  let offset = 0;
  buffers.forEach(buffer => {
    temp.set(new Uint8Array(buffer), offset);
    offset += buffer.byteLength;
  });
  return temp.buffer;
};
