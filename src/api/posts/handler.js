const fs = require('fs')
const path = require('path')

class PostsImageHandler {
  async postPostImageHandler(request, h) {
    const { image } = request.payload

    const { filename } = image.hapi
    const directory = path.resolve('uploads')
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory)
    }

    const location = `${directory}/${filename}`
    const fileStream = fs.createWriteStream(location)

    try {
      const result = await new Promise((resolve, reject) => {
        fileStream.on('erorr', (error) => reject(error))

        image.pipe(fileStream)

        image.on('end', () => resolve(filename))
      })

      return h.response({
        message: `Gambar ${result} berhasil diproses`,
      })
    } catch (err) {
      return h.response({
        message: 'Gambar gagal diproses',
      })
    }
  }
}

module.exports = PostsImageHandler
