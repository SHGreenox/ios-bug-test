import Fastify from 'fastify';
import fs from 'fs'
import path from 'path';
import cors from '@fastify/cors'

const fastify = Fastify({
  logger: true
})

fastify.register(cors, {
  origin: "*",
  methods: "*"
})

fastify.get('/', (_, reply) => {
  const filePath = path.join('src', 'test.pdf');

  if (!fs.existsSync(filePath)) {
    return reply.status(404).send({ error: 'File not found' });
  }

  const readStream = fs.createReadStream(filePath);
  const stats = fs.statSync(filePath);

  readStream.on('error', (err) => {
    console.error('Error reading file:', err);
    reply.status(500).send({ error: 'Internal server error while reading file' });
  });

  readStream.on('open', () => {
    console.log("---------------------------------------------")
    console.log('File stream opened successfully');
  });

  readStream.on('data', (chunk) => {
    console.log("---------------------------------------------")
    console.log('Data chunk received:', chunk.length);
  });

  readStream.on('end', () => {
    console.log("---------------------------------------------")
    console.log('Stream finished');
  });


  reply
    .header('Content-Type', 'application/pdf')
    .header('Content-Disposition', 'attachment; filename="test.pdf"')
    .header('Content-Length', stats.size)
    .send(readStream);
});

fastify.listen({ host: '::', port: Number(process.env.PORT) || 3001 }, function (err, address) {
  console.log("---------------------------------------------")
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
});