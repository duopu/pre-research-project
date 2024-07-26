function insertDiv() {
    const list = document.getElementById('list');
    const newDiv = document.createElement('div');
    const newListItem = document.createElement('li');
    const itemCount = list.children.length;

    // 设置背景颜色和初始变换方向
    if (itemCount % 2 === 0) {
        newDiv.classList.add('animated-div', 'even');
    } else {
        newDiv.classList.add('animated-div', 'odd');
    }

    newListItem.appendChild(newDiv);
    list.appendChild(newListItem);

    // 添加点击事件监听器以实现删除动画和功能
    newListItem.addEventListener('click', () => removeDiv(newListItem, itemCount % 2 === 0));

    // 强制浏览器重新渲染以应用初始状态
    requestAnimationFrame(() => {
        newDiv.classList.add('show');
    });
}

function removeDiv(listItem, isEven) {
    const div = listItem.querySelector('.animated-div');
    if (isEven) {
        div.classList.add('remove');
    } else {
        div.classList.add('remove');
    }

    // 在动画结束后删除元素
    setTimeout(() => {
        listItem.remove();
    }, 1500); // 动画持续时间为1.5秒
}
