
document.addEventListener('DOMContentLoaded', function () {
    const colorInput = document.getElementById('editorFreeTextColor');
    console.log(colorInput.value)
    colorInput.value = '#FF0000';  // 这是红色的默认值，你可以根据需要更改
    // 为input元素添加一个input事件

    colorInput.addEventListener('input', function () {
        console.log('Color changed to:', colorInput.value);
        // 你可以在这里添加其他的逻辑
    });
    console.log(colorInput.value)

    // 创建并派发input事件
    let event = new Event('input', {
        'bubbles': true,
        'cancelable': true
    });
    colorInput.dispatchEvent(event);
});
