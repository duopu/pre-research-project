const express = require('express');
const cors = require('cors'); // 引入 cors 模块
const app = express();
const port = 3000;

app.use(cors()); // 使用 cors 中间件

const arr = [
	`id:88415a7f-d111-449d-9ee3-212b668ebdc6
	event:answer
	data:{"action":"answer","message":"我","sessionId":"5fb3de43-6751-43a2-b867-92aa24d42399","status":"running"}
	`,

	`id:5f886c35-4c4f-4d7e-a0c0-d8113c673a1b
	event:answer
	data:{"action":"answer","message":"是一个","sessionId":"5fb3de43-6751-43a2-b867-92aa24d42399","status":"running"}
	`,
	`
	id:d3a9f119-6eaa-404e-b053-95ddacf14422
	event:answer
	data:{"action":"answer","message":"专业的","sessionId":"5fb3de43-6751-43a2-b867-92aa24d42399","status":"done"}

	`,

	`
	id:5144016b-8016-4587-a14c-16230628bcf4
	event:answer
	data:{"action":"answer","message":"电话","sessionId":"5fb3de43-6751-43a2-b867-92aa24d42399","status":"running"}
	`,
	`
	id:663ea524-6794-4341-8d40-e9d751594f65
	event:answer
	data:{"action":"answer","message":"号码","sessionId":"5fb3de43-6751-43a2-b867-92aa24d42399","status":"running"}


	`,
	`
	id:e2f470bd-dcac-4675-9d01-6717d313df32
	event:answer
	data:{"action":"answer","message":"信息","sessionId":"5fb3de43-6751-43a2-b867-92aa24d42399","status":"running"}
	`,
	`
	id:c44017b2-8104-44da-ad86-e5f70aa00fb1
	event:answer
	data:{"action":"answer","message":"查询","sessionId":"5fb3de43-6751-43a2-b867-92aa24d42399","status":"running"}


	`,

	`
	id:04094e35-a2cb-4c06-88df-410d6ac4597b
	event:answer
	data:{"action":"answer","message":"","sessionId":"5fb3de43-6751-43a2-b867-92aa24d42399","status":"done"}
	`
];

let num = 0;

app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const intervalId = setInterval(() => {

        // const message = `data: 当前时间： ${new Date().toLocaleTimeString()}\n\n`;
		const message = arr[num];

		num++;

        res.write(message);
		if (message.indexOf('done') > 0) {
			num = 0;
			res.end();
		}
    }, 2000);

    req.on('close', () => {
        clearInterval(intervalId);
        res.end();
    });


    setTimeout(() => {
        res.write('data: 服务器已关闭\n\n');
        res.end();
    }, 10000000);
});

app.listen(port, () => {
    console.log(`SSE服务正在 http://localhost:${port} 上运行`);
});
