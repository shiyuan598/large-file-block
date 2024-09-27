const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// 设置静态资源目录  
// 假设你的静态文件都放在项目的public文件夹下  
app.use(express.static(path.join(__dirname, 'public'))); 

// 提供下载大文件服务的接口
app.get('/download/:filename', (req, res) => {
  const { filename } = req.params;
  // const filePath = path.join(__dirname, 'files', filename); // 假设文件在 ./files 目录下
  const filePath = path.join("C:\\Users\\wangshiyuan\\Downloads\\files", filename)

  // 检查文件是否存在
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }

  const fileSize = fs.statSync(filePath).size;
  const range = req.headers.range;

  // 处理 Range 请求
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunkSize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'application/octet-stream',
    });

    file.pipe(res);
  } else {
    // 如果没有 Range 请求，直接返回整个文件
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': 'application/octet-stream',
    });
    fs.createReadStream(filePath).pipe(res);
  }
});


app.get('/hello', (req, res) => {
  res.send('hello');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
