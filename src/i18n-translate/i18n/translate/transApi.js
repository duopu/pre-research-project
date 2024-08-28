const fetch = require('node-fetch');

/*

const getTranslation = async (query, options = {}) => {
    let body = {
        "query": query,
        "from": "zh",
        "to": "en",
        "reference": "",
        "corpusIds": [],
        "qcSettings": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
        "needPhonetic": false,
        "domain": "common",
        "milliTimestamp": new Date().getTime(),
        ...options
    }
    return new Promise((resolve, reject) => {
        fetch("https://fanyi.baidu.com/ait/text/translate", {
            "headers": {
                "accept": "text/event-stream",
                "accept-language": "zh-CN,zh;q=0.9",
                "acs-token": "1724752808309_1724808076086_zGMZ4SYUI5pWeh3nINlzJQrKr3fX6Z6pCpl7mNpMZrSv/SarlBFyvXmoDE9WkC7+MpqFzCGO0MzR3flLOchkMyofaVnpXHhel7CgO4XlgZFZyQzoBIDPJsZWGW1ZqUUAT6uk3VWkpDxvio/8d4rqH+p1mE6sNdIvwvqqLfJq5l/fg4mVHStJ9ccntRT6MKpf/70wFiS2FgiisFOcpd5jeu79mZGuhP2SE7Bj+/L/InI3Jb4aJgP+VGCNAsTQ/WfrZy6gCcWHdzp3HVid1oUfDNqblIA927A1Fq33MYXdWqs86r8WcPZbRbJyUYlJlIykZyvBzmamdWd1bA7iejzKsaVYBPflmlZ49wdQuzG7BYOjNjdINr4ccdckoRVqgQUmIDlaJS5eH/dw2ElTREBuPMfvfsqlmzYIu/tLf7exkZy6Nz4FGPSLYyT2PNZRNBQNCriP4to0rgyRC/zBDgDIHq6eZvrOu/fuyABn2FM3JyU9oOaBumJyKqCMtNMISpFk",
                "cache-control": "no-cache",
                "content-type": "application/json",
                "pragma": "no-cache",
                "sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Google Chrome\";v=\"128\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "cookie": "Hm_lvt_64ecd82404c51e03dc91cb9e8c025574=1710920574,1710991542,1711100107,1711334068; PSTM=1712457117; BIDUPSID=C91FFDDB1520CB3840E00AC1FBA794D5; BAIDUID=983EFE1248E1B90FBACC63766AF9F9F3:SL=0:NR=10:FG=1; newlogin=1; MCITY=-315%3A; BAIDUID_BFESS=983EFE1248E1B90FBACC63766AF9F9F3:SL=0:NR=10:FG=1; ZFY=jmK4JrMQQIz0F7s7:AblxPKzI1t:A6BXzNRj1huTzqW68:C; __bid_n=1916e4f320802882b31e16; H_WISE_SIDS=60359_60623_60664; H_WISE_SIDS_BFESS=60359_60623_60664; BDUSS=3N5MHVFUmZsU1BxNVl5Q3JUZFhqNHExaU1MY3ZndHRsNmppN1MyaFpqY2k0dTltSVFBQUFBJCQAAAAAAAAAAAEAAADH-JUkwLTM9dPjwLTWu8-6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACJVyGYiVchmQ; BDUSS_BFESS=3N5MHVFUmZsU1BxNVl5Q3JUZFhqNHExaU1MY3ZndHRsNmppN1MyaFpqY2k0dTltSVFBQUFBJCQAAAAAAAAAAAEAAADH-JUkwLTM9dPjwLTWu8-6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACJVyGYiVchmQ; BDRCVFR[V3EOV_cRy1C]=mk3SLVN4HKm; H_PS_PSSID=60359_60623_60664_60678; RT=\"z=1&dm=baidu.com&si=87f5e98c-362e-4013-af7b-e79182a9c139&ss=m0c9ilxo&sl=5&tt=3zq&bcn=https%3A%2F%2Ffclog.baidu.com%2Flog%2Fweirwood%3Ftype%3Dperf&ld=uyz\"",
                "Referer": "https://fanyi.baidu.com/mtpe-individual/multimodal?query=%E5%AD%98%E6%A1%A3&lang=zh2cht",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": JSON.stringify(body),
            "method": "POST"
        }).then(response => {
            return response;
        }).then(async data => {
            let result = await getEventStream(data);
            resolve(result);
        }).catch(error => {
            console.error('翻译api报错 error===', error);
            resolve(query);
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
                            if (value && value.event && value.event === 'Translating') {
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

// zhCnToZhTw('请您输入问题，shift+回车换行，回车发送').then(async (res) => console.log('ret===================', res));

*/

const zhCnToEnUs = (word) => getTranslation(word, { from: 'zh', to: 'en' });

const zhCnToZhTw = (word) => getTranslation(word, { from: 'zh', to: 'cht' });

const enUsToZhCn = (word) => getTranslation(word, { from: 'en', to: 'zh' });

const translateWithOptions = (word, options) => getTranslation(word, { ...options });

module.exports = {
    zhCnToEnUs,
    zhCnToZhTw,
    enUsToZhCn,
    translateWithOptions,
};

async function getTranslation(query, options) {
    let body = {
        query: query,
        from: 'zh',
        to: 'en',
        reference: '',
        corpusIds: [],
        qcSettings: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
        needPhonetic: false,
        domain: 'common',
        milliTimestamp: new Date().getTime(),
        ...options,
    };

    const response = await fetch('https://fanyi.baidu.com/ait/text/translate', {
        headers: {
            accept: 'text/event-stream',
            'accept-language': 'zh-CN,zh;q=0.9',
            'acs-token':
                '1724752808309_1724808076086_zGMZ4SYUI5pWeh3nINlzJQrKr3fX6Z6pCpl7mNpMZrSv/SarlBFyvXmoDE9WkC7+MpqFzCGO0MzR3flLOchkMyofaVnpXHhel7CgO4XlgZFZyQzoBIDPJsZWGW1ZqUUAT6uk3VWkpDxvio/8d4rqH+p1mE6sNdIvwvqqLfJq5l/fg4mVHStJ9ccntRT6MKpf/70wFiS2FgiisFOcpd5jeu79mZGuhP2SE7Bj+/L/InI3Jb4aJgP+VGCNAsTQ/WfrZy6gCcWHdzp3HVid1oUfDNqblIA927A1Fq33MYXdWqs86r8WcPZbRbJyUYlJlIykZyvBzmamdWd1bA7iejzKsaVYBPflmlZ49wdQuzG7BYOjNjdINr4ccdckoRVqgQUmIDlaJS5eH/dw2ElTREBuPMfvfsqlmzYIu/tLf7exkZy6Nz4FGPSLYyT2PNZRNBQNCriP4to0rgyRC/zBDgDIHq6eZvrOu/fuyABn2FM3JyU9oOaBumJyKqCMtNMISpFk',
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            pragma: 'no-cache',
            'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            cookie:
                'Hm_lvt_64ecd82404c51e03dc91cb9e8c025574=1710920574,1710991542,1711100107,1711334068; PSTM=1712457117; BIDUPSID=C91FFDDB1520CB3840E00AC1FBA794D5; BAIDUID=983EFE1248E1B90FBACC63766AF9F9F3:SL=0:NR=10:FG=1; newlogin=1; MCITY=-315%3A; BAIDUID_BFESS=983EFE1248E1B90FBACC63766AF9F9F3:SL=0:NR=10:FG=1; ZFY=jmK4JrMQQIz0F7s7:AblxPKzI1t:A6BXzNRj1huTzqW68:C; __bid_n=1916e4f320802882b31e16; H_WISE_SIDS=60359_60623_60664; H_WISE_SIDS_BFESS=60359_60623_60664; BDUSS=3N5MHVFUmZsU1BxNVl5Q3JUZFhqNHExaU1MY3ZndHRsNmppN1MyaFpqY2k0dTltSVFBQUFBJCQAAAAAAAAAAAEAAADH-JUkwLTM9dPjwLTWu8-6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACJVyGYiVchmQ; BDUSS_BFESS=3N5MHVFUmZsU1BxNVl5Q3JUZFhqNHExaU1MY3ZndHRsNmppN1MyaFpqY2k0dTltSVFBQUFBJCQAAAAAAAAAAAEAAADH-JUkwLTM9dPjwLTWu8-6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACJVyGYiVchmQ; BDRCVFR[V3EOV_cRy1C]=mk3SLVN4HKm; H_PS_PSSID=60359_60623_60664_60678; RT="z=1&dm=baidu.com&si=87f5e98c-362e-4013-af7b-e79182a9c139&ss=m0c9ilxo&sl=5&tt=3zq&bcn=https%3A%2F%2Ffclog.baidu.com%2Flog%2Fweirwood%3Ftype%3Dperf&ld=uyz"',
            Referer: 'https://fanyi.baidu.com/mtpe-individual/multimodal?query=%E5%AD%98%E6%A1%A3&lang=zh2cht',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
        body: JSON.stringify(body),
        method: 'POST',
    });

    return new Promise((resolve) => {
        if (!response.ok) {
            // throw new Error(`HTTP error! status: ${response.status}`);
            console.error(`HTTP error! status: ${response.status}`);
            resolve(query);
        }

        // 处理流式数据
        response.body.on('data', (chunk) => {
            let dataBuffer = chunk.toString();

            if (dataBuffer.includes('\n\n')) {
                const events = dataBuffer.split('\n\n');
                dataBuffer = events.pop();
                for (const event of events) {
                    const lines = event.split('\n');
                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const jsonData = line.replace(/^data: /, '');
                                const parsedEvent = JSON.parse(jsonData);
                                const value = parsedEvent.data;
                                if (value && value.event && value.event === 'Translating') {
                                    resolve(value.list[0].dst);
                                }
                            } catch (error) {
                                resolve(query);
                            }
                        }
                    }
                }
            }
        });

        // response.body.on('end', () => {console.log('Stream ended.')});

        response.body.on('error', (err) => {
            console.error('Error in stream:', err);
            resolve(query);
        });
    });
}

/*

getTranslation('存档', {
    "from": "zh",
    "to": "cht"
}).then(res => {
    console.log('res====', res);
}).catch((err) => console.error('err====', err));
*/
