const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { translateWithOptions } = require('./transApi');


// 获取 Node.js 版本号
const [major, minor, patch] = process.versions.node.split('.').map(Number);

// 定义最低版本号
const requiredVersion = { major: 18, minor: 18, patch: 0 };


if (major < requiredVersion.major || (major === requiredVersion.major && minor < requiredVersion.minor) || (major === requiredVersion.major && minor === requiredVersion.minor && patch < requiredVersion.patch)) {
    const message = '\n\n' + '运行终止: Node.js 版本必须大于 18.18.0不然有些api不支持：\n'.repeat(10)
            .split('\n')
            .map(line => ' '.repeat(20) + line + ' '.repeat(20)) // 增加空格以扩大视觉效果
            .join('\n\n') + // 增加行间距
        '\n\n';

    console.log(chalk.bold.red(message));
    process.exit(1); // 终止执行任务
}

console.log('Node.js 版本满足要求，继续执行任务。');


// 配置文件夹路径
const zh_CN_Dir = path.join(__dirname, '../zh_CN');
const zh_TW_Dir = path.join(__dirname, '../zh_TW');
const en_US_Dir = path.join(__dirname, '../en_US');

// 递归翻译并合并对象
const translateAndMerge = async (sourceObj, targetObj, targetLang) => {
    let result = { ...targetObj };

    for (const key in sourceObj) {
        if (typeof sourceObj[key] === 'object') {
            result[key] = await translateAndMerge(sourceObj[key], targetObj[key] || {}, targetLang);
        } else {
            if (!targetObj[key]) {
                const translation = await translateWithOptions(sourceObj[key], { from: 'zh', to: targetLang });
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
