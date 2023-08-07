const fs = require("fs")
const tempPath = 'public/temp/repairFileImages/'

const uploadImg = async (req, res) => {
    let { name } = req.params
    try {
        fs.writeFile( tempPath + name, req.body, 'binary', (error) => {
            if (error) {
                console.log(error);
              throw error;
            }
          });
        res.sendStatus(200);
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const deleteImg = (req, res) => {
    let { name } = req.params
    try {
        fs.unlink(tempPath + name, (err) => {
            if (err) throw err;
          });
        res.sendStatus(200);
      } catch (error) {
        console.error('there was an error:', error.message);
        res.status(400).json({error: error.message})
      }
}

const moveImg = (req, res) => {
    const { photoFile, id } = req.body
    if(photoFile){
      try {
        var dir = `public/repairFileImages/dos_${id}`;
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        fs.rename(tempPath + photoFile, `public/repairFileImages/dos_${id}/${photoFile}`, (err) => {
            if (err) throw err;
          });
        res.sendStatus(200);
      } catch (error) {
        res.status(400).json({error: error.message})
      }
    } 
}

const getImg = (req, res) => {
    const { photoFile, id } = req.body
    const imgFilePath = `public/repairFileImages/dos_${id}/${photoFile}`
    res.sendFile( imgFilePath, { root: './' })
}

const getBlogImg = (req, res) => {
  const { photoFile } = req.body
  const imgFilePath = `public/blogImages/${photoFile}`
  res.sendFile( imgFilePath, { root: './' })
}

module.exports = {
    uploadImg,
    deleteImg,
    moveImg,
    getImg,
    getBlogImg
}