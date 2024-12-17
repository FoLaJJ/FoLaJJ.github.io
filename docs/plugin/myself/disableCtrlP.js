// 禁用 Ctrl+P 快捷键
document.addEventListener('keydown', function(event) {
    // 检查是否按下Ctrl键和P键
    if (event.ctrlKey){
        if (event.key === 'p'){
            // 阻止默认行为
            event.preventDefault();
            // alert('Ctrl+P 被禁用');
        }
    }
});
