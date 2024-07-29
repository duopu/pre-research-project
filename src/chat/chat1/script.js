let num = 0;

function insertDiv() {

    num++;

    const list = document.getElementById('list');
    const newDiv = document.createElement('div');
    const newListItem = document.createElement('li');
    const itemCount = list.children.length;

    newListItem.id = `${ num }`;

    // 设置背景颜色
    if (itemCount % 2 === 0) {
        newDiv.classList.add('animated-div', 'odd');
    } else {
        newDiv.classList.add('animated-div', 'even');
    }

    newDiv.innerHTML = num;

    newListItem.appendChild(newDiv);
    list.appendChild(newListItem);

    // 添加点击事件监听器以实现删除动画和功能
    newListItem.addEventListener('click', () => removeDiv(newListItem));

    // 强制浏览器重新渲染以应用初始状态
    requestAnimationFrame(() => {
        newDiv.classList.add('show');
    });
}

const timeCell = 500;

function removeDiv(listItem) {
    const div = listItem.querySelector('.animated-div');

    // let nextId = parseInt(listItem.id) + 1;
    // const nextEle = document.getElementById(nextId)

    // console.log('nummnummnumm', div.innerHTML, listItem, nextId, listItem.id, nextEle);


    // nextEle.classList.add('remove111')

    listItem.classList.add('remove');

    const offsetHeight = listItem.offsetHeight;

    console.log('nummnummnumm', offsetHeight);
    // div.classList.add('remove');

    const onceReduceHeight = offsetHeight / 100;
    const cell = timeCell / 100;
    let num = 0;

    let i1 = setInterval(() => {
        num++;
        // clearTimeout(timer1);
        let hh = (offsetHeight - (onceReduceHeight * num)) + 'px';
        console.log('nummnummnumm', hh);
        listItem.style.height = hh;
    }, cell);

    // 在动画结束后删除元素
    setTimeout(() => {
        listItem.remove();
        clearInterval(i1);
        // nextEle.classList.remove('remove111');
    }, timeCell); // 动画持续时间为1.5秒
}
