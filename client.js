const grpc = require('@grpc/grpc-js')
const { loadProto, grpcPort } = require('./lib/load-proto.js')

function main() {
  const method = process.argv[2]
  const proto = loadProto()
  const host = '127.0.0.1:' + grpcPort;
  console.log(`client for ${host}`)
  const client = new proto.GrpcTester(host, grpc.credentials.createInsecure());

  switch(method) {
    case 'UnaryMethod':
      client.UnaryMethod({num:100},function(err, response) {
        console.log(err)
        console.log(response)
      })
      break;
    case 'camelCaseMethod':
      client.camelCaseMethod({num:101},function(err, response) {
        console.log(err)
        console.log(response)
      })
      break;
    case 'ClientStreamMethod':
      const stream = client.ClientStreamMethod(function(err, response) {
        console.log(err)
        console.log(response)
      })
      stream.write({num:102})
      stream.end()
      break;
    case 'ServerStreamMethod':
      const result = []
      const readStream = client.ServerStreamMethod({num:103},function(err, response) {
        console.log(err)
        console.log(response)
      })
      readStream.on('data', (data) => {
        result.push(data);
      });
      readStream.on('error', (err) => {
          console.log(err);
      });
      readStream.on('end', () => {
          console.log(result);
      });

      break;
    case 'BidiStream':
      const resultBidi = [];
      const bidiStream = client.BidiStreamMethod();
      bidiStream.on('data', (data) => {
        resultBidi.push(data);
      });
      [{num:105}, {num:106}].forEach(element => {
          bidiStream.write(element);
      });
      bidiStream.on('error', (err) => {
          console.log(err)
      });
      bidiStream.on('end', () => {
          console.log(resultBidi);
      });
      bidiStream.end();
      break;
    default:
      console.log('USAGE ./client.js method-name')
      process.exit(1)
  }
}
main()
