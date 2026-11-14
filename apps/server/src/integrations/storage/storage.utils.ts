import { Readable } from 'node:stream';

export function streamToBuffer(readableStream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    // `Readable#on` is shadowed by an ambient `declare module 'stream'` coming
    // from @fastify/busboy's typings; go through the Node event-emitter view so
    // the standard 'data'/'end'/'error' events type-check again.
    const stream = readableStream as unknown as NodeJS.ReadableStream;
    stream.on('data', (chunk: Uint8Array) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}
