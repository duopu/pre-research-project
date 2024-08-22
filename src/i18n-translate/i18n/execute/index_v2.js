const fs = require('fs');
const path = require('path');
// const translate = require('@vitalets/google-translate-api');
const { translateWithOptions } = require('./translate');

// 配置文件夹路径
const zh_CN_Dir = '../zh_CN';
const zh_TW_Dir = '../zh_TW';
const en_US_Dir = '../en_US';

// 递归翻译并合并对象
const translateAndMerge = async (sourceObj, targetObj, targetLang) => {
    let result = { ...targetObj };

    for (const key in sourceObj) {
        if (typeof sourceObj[key] === 'object') {
            result[key] = await translateAndMerge(sourceObj[key], targetObj[key] || {}, targetLang);
        } else {
            if (!targetObj[key]) {
                const translation = await translateWithOptions(sourceObj[key], { from: 'zh', to: targetLang });
                // result[key] = translation.text;
                result[key] = translation;
            } else {
                result[key] = targetObj[key];
            }
        }
    }

    return result;
};

// 处理翻译文件
const processFile = async (fileName) => {
    const zh_CN_FilePath = path.join(zh_CN_Dir, fileName);
    const zh_TW_FilePath = path.join(zh_TW_Dir, fileName);
    const en_US_FilePath = path.join(en_US_Dir, fileName);

    if (!fs.existsSync(zh_CN_FilePath)) {
        console.error(`File ${ zh_CN_FilePath } not found!`);
        return;
    }

    const zh_CN_Data = JSON.parse(fs.readFileSync(zh_CN_FilePath, 'utf8'));

    let zh_TW_Data = fs.existsSync(zh_TW_FilePath) ? JSON.parse(fs.readFileSync(zh_TW_FilePath, 'utf8')) : {};
    let en_US_Data = fs.existsSync(en_US_FilePath) ? JSON.parse(fs.readFileSync(en_US_FilePath, 'utf8')) : {};

    const zh_TW_Translation = await translateAndMerge(zh_CN_Data, zh_TW_Data, 'cht');
    const en_US_Translation = await translateAndMerge(zh_CN_Data, en_US_Data, 'en');

    // 写入文件
    fs.writeFileSync(zh_TW_FilePath, JSON.stringify(zh_TW_Translation, null, 4), 'utf8');
    fs.writeFileSync(en_US_FilePath, JSON.stringify(en_US_Translation, null, 4), 'utf8');

    console.log(`Translated and updated: ${ fileName }`);
};

// 遍历文件夹中的文件并进行处理
fs.readdir(zh_CN_Dir, (err, files) => {
    if (err) {
        console.error(err);
        return;
    }
    files.forEach(file => {
        processFile(file);
    });
});
