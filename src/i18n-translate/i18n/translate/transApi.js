const getTranslation = async (query, options = {}) => {
    let body = {
        "query": query,
        "from": "zh",
        "to": "en",
        "reference": "",
        "corpusIds": [],
        "qcSettings": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
        "needPhonetic": true,
        "domain": "common",
        "milliTimestamp": new Date().getTime(), ...options
    }

    return new Promise((resolve, reject) => {

        fetch("https://fanyi.baidu.com/ait/text/translate", {
            "headers": {
                "accept": "text/event-stream",
                "accept-language": "zh-CN,zh;q=0.9",
                "acs-token": "1719144009482_1719207105453_ibhQugB9Q4TyBq0+FKk79jiIL64+4j2zQTsDl+hZ5eAVpxx0hQ8SuoowhNGb53tehq1DKCNVYEMLLBAGCOD+LDOPXyO1aSbuTD4WCsi6Xuaf8yFvkNHINe8EQqlCkiPDRg4uuMFMKD4EuCG3d0NLN3ggBM21aJR+nH9E+anXVJhLfDIiXHUjnIMaEqYilHRg8vQ8cBgH6GipTnHT1rRSWF3oRbKTUAf/dN/tzv5NJQL2VLQMHAaVcC9mccJSHjwxr2fM4MCGmxBAd/JSs/yzEEbVejilvmV/rxXEiZtzl7D3NEaSXklQIvRl5WkE3oca+8RACXd+UxtEONwzY0tmUyyi3NIYiqQIkCyuqoxssSv3lGb/OKaVYoafzjzQMzLmBfAbeWTNazArI+TKuBg7GK3rlz5GlVQGPPmjuWY61PwUqi5yYkH/eYNOQW3b4iqLCTxygrzHcOg5sqinv1spNharszL/5lHgRpc8KvEbp7mypAkY37rzd5o06OjNhKZy",
                "cache-control": "no-cache",
                "content-type": "application/json",
                "pragma": "no-cache",
                "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "cookie": "Hm_lvt_64ecd82404c51e03dc91cb9e8c025574=1710920574,1710991542,1711100107,1711334068; PSTM=1712457117; BIDUPSID=C91FFDDB1520CB3840E00AC1FBA794D5; BAIDUID=983EFE1248E1B90FBACC63766AF9F9F3:SL=0:NR=10:FG=1; newlogin=1; BAIDUID_BFESS=983EFE1248E1B90FBACC63766AF9F9F3:SL=0:NR=10:FG=1; H_WISE_SIDS_BFESS=110085_603025_282466_607540_607590_607594_607896_607835_305467_607988_608151_301668_606232_608675_608698_607532_608328; MCITY=-315%3A; BDUSS_BFESS=3Zab2Zhd0hMZ3RpVzNpcGxRMEVSMDV-M1dVbU05UW40S1BENkNQeGNKYlRFNTVtSUFBQUFBJCQAAAAAAAAAAAEAAACcOWSuajE4ODU1MDQ5OTAyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANOGdmbThnZmY; H_WISE_SIDS=60325_60334_60352_60365; H_PS_PSSID=60334_60352_60365; BA_HECTOR=a02g2h2ka10h2l212k2hak048s96v11j7i1321u; ZFY=jyQ7aZVa6L:Ab5aQtuOAP1qohOttmOfJ55w4apIgXoMw:C; RT=\"z=1&dm=baidu.com&si=3f5108b7-9b0f-4604-9fb4-8c2431ebdb22&ss=lxsjgryg&sl=2&tt=54d&bcn=https%3A%2F%2Ffclog.baidu.com%2Flog%2Fweirwood%3Ftype%3Dperf\"; ab_sr=1.0.1_ZWQyNTFiNWFjZjBmOTFjMzdkYjZlMTNhMGEwMjY4NTM4NzE3ZmZmODY3MWRmNTFiZTA2NGMwYjNhYTM0NzJjZDg3NzE5ZGU0ZjJmN2IyNTJkMzc1NWJkY2YxODA3ZTM1ZDhmNTFlOWM0MjFhZGM3ZjcxNjRiMWViZTYxZTI2M2UyNjEzOGVjOGQ3Y2Y4YTc2MzllOGI3MTFhYzBjOWNhMQ==",
                "Referer": "https://fanyi.baidu.com/mtpe-individual/multimodal",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            }, // "body": "{\"query\":\"Hello, world!\",\"from\":\"en\",\"to\":\"zh\",\"reference\":\"\",\"corpusIds\":[],\"qcSettings\":[\"1\",\"2\",\"3\",\"4\",\"5\",\"6\",\"7\",\"8\",\"9\",\"10\",\"11\"],\"needPhonetic\":false,\"domain\":\"common\",\"milliTimestamp\":1719207105475}",
            "body": JSON.stringify(body), "method": "POST"
        }).then(response => {
            return response;
        }).then(async data => {
            let result = await getEventStream(data);
            resolve(result);
        }).catch(error => {
            console.error('error===', error);
        });
    })

};


async function getEventStream(response) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    let dataBuffer = '';
    let done = false;

    while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        dataBuffer += decoder.decode(value || new Uint8Array(), { stream: !done });

        if (dataBuffer.includes('\n\n')) {
            const events = dataBuffer.split('\n\n');
            dataBuffer = events.pop();  // 保留剩余数据以供下一块处理
            for (const event of events) {
                const lines = event.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const jsonData = line.replace(/^data: /, '');
                            const parsedEvent = JSON.parse(jsonData);
                            // 提取特定的值
                            const value = parsedEvent.data;
                            if (value?.event === 'Translating') {
                                return value.list[0].dst;
                            }
                        } catch (error) {
                            console.error('Error parsing JSON:', error);
                        }
                    }
                }
            }
        }
    }
}


const zhCnToEnUs = (word) => getTranslation(word, { "from": "zh", "to": "en" });

const zhCnToZhTw = (word) => getTranslation(word, { "from": "zh", "to": "cht" });

const enUsToZhCn = (word) => getTranslation(word, { "from": "en", "to": "zh" });

const translateWithOptions = (word, options) => getTranslation(word, { ...options });


// (async () => {
//     let ret = await zhCnToZhTw('存档');
//     console.log('ret===================', ret);
// })();

module.exports = {
    zhCnToEnUs,
    zhCnToZhTw,
    enUsToZhCn,
    translateWithOptions,
};
