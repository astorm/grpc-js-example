# GRPC Sample Client/Server

This repo contains a simple example of a GRPC client and server, implemented using Node.js's `@grpc/grpc-js` package.  Code based on the OpenTelemetry GRPC tests.

To run

    # terminal window 1 -- starts server on port 7777    
    % node index.js 
    
    # terminal window 2
    
    % node client.js BidiStream
    
## About GRPC

GRPC is a system for creating web services.  It uses HTTP2 as a transport layer.  It uses [proto buffers](https://developers.google.com/protocol-buffers) as its data format.  The advantage of a GRPC service is more strict defined types allow for more efficient data sending over the wire AND that (unlike HTTP1.1/rest services), GRPC supports streaming endpoint (read streams, write streams, and bidirectional streams).

To define a GRPC service you use a `.proto` file.  The following

    service GrpcTester {
      rpc UnaryMethod (TestRequest) returns (TestReply) {}
      rpc camelCaseMethod (TestRequest) returns (TestReply) {}
      rpc ClientStreamMethod (stream TestRequest) returns (TestReply) {}
      rpc ServerStreamMethod (TestRequest) returns (stream TestReply) {}
      rpc BidiStreamMethod (stream TestRequest) returns (stream TestReply) {}
    }

defines a GRPC service named `GrpcTester`.  This service has _five_ methods, named `UnaryMethod`, `camelCaseMethod`, `ClientStreamMethod`, `ServerStreamMethod`, and `BidiStreamMethod`.  Each method accepts a `TestRequest` object and returns a `TestReply` object.  Arguments or return types prefaced with the word `stream` indicate that the method is either a read, write, or bidirectional streaming method.  

The types section of the file defines the object types used in these methods.

```
message TestRequest {
  int32 num = 1;
}

message TestReply {
  int32 num = 1;
}
```

See [protobuff language guide for more information](https://developers.google.com/protocol-buffers/docs/proto3) for more information on these object.

**Note**: Most GRPC implementations rely heavily on the use of generated _client_ code.  You define your service via a `.proto` file, point a code generator at it, and client code comes out the other end.  

The `@grpc/grpc-js` library is different in that the library itself handles this generation dynamically, giving the client end-user the experience of just being able to call methods on an instantiated service object. See `client.js` for more information. 