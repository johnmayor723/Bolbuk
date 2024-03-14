// graphql/resolvers.js

const { createWriteStream } = require('fs');
const { resolve } = require('path');

const resolvers = {
  Mutation: {
    uploadImage: async (_, { file }) => {
      const { createReadStream, filename } = await file;
      const stream = createReadStream();
      const path = resolve(__dirname, `../uploads/${filename}`);
      await new Promise((resolve, reject) =>
        stream.pipe(createWriteStream(path))
          .on('finish', resolve)
          .on('error', reject)
      );

      // Store the file path in the database or perform any other necessary operations
      return path;
    },
  },
};

module.exports = resolvers;
