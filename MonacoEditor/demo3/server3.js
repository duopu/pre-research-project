const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');


const app = express();

app.use(cors());

const PORT = 3000;

// 中间件
app.use(bodyParser.json());

// 保存代码到文件
app.post('/save', (req, res) => {
    const { code, language } = req.body;
    const data = { code, language };
    fs.writeFile('code.json', JSON.stringify(data), (err) => {
        if (err) {
            console.error('Error saving code:', err);
            return res.status(500).json({ message: 'Error saving code' });
        }
        res.json({ message: 'Code saved successfully' });
    });
});

// 从文件加载代码
app.get('/load', (req, res) => {
    fs.readFile('code.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error loading code:', err);
            return res.status(500).json({ message: 'Error loading code' });
        }
        res.json(JSON.parse(data));
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${ PORT }`);
});
