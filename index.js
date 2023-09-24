document.addEventListener('DOMContentLoaded', function () {
    const settingsButton = document.getElementById('settingsButton');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsButton = document.getElementById('closeSettings');
    // 在页面加载时设置初始隐藏
    settingsModal.style.display = 'none';
    
    settingsButton.addEventListener('click', function () {
        settingsModal.style.display = 'block';
    });

    closeSettingsButton.addEventListener('click', function () {
        settingsModal.style.display = 'none';
    });
});
