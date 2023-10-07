let fullData; // 存储完整的数独数据

// 获取完整数独数据
fetch('sudoku_data_full_40_1.json')
    .then(response => response.json())
    .then(data => {
        fullData = data;
    })
    .catch(error => console.error('Error fetching data:', error));

document.addEventListener('DOMContentLoaded', function () {
    fetch('sudoku_data_40_1.json')
        .then(response => response.json())
        .then(data => {
            const sudokuTable = document.getElementById('sudoku-table');
            // 渲染数独游戏数据到HTML表格
            for (let i = 0; i < data.puzzle.length; i++) {
                const row = document.createElement('tr');
                for (let j = 0; j < data.puzzle[i].length; j++) {
                    const cell = document.createElement('td');
                    if (data.puzzle[i][j] != 0) {
                        cell.textContent = data.puzzle[i][j];
                    } else {
                        cell.className = 'editable-cell';
                        cell.textContent = '';
                    }

                    // 添加右键点击事件监听器
                    cell.addEventListener('contextmenu', function (e) {
                        e.preventDefault(); // 阻止默认的右键菜单
                        // 在此处将sudoku_data_full_30_1.json中对应位置的数字渲染到格子中
                        const number = fullData.puzzle[i][j];
                        if (number != 0) {
                            cell.textContent = number;
                        }
                        // 检查当前格子是否已经高亮
                        const isHighlighted = cell.classList.contains('highlighted');

                        // 移除所有高亮状态
                        const highlightedCells = document.querySelectorAll('.highlighted');
                        highlightedCells.forEach(highlightedCell => highlightedCell.classList.remove('highlighted'));

                        // 如果当前格子不是之前高亮的格子，就高亮它
                        if (!isHighlighted) {
                            cell.classList.add('highlighted');

                        }
                    });

                    row.appendChild(cell);
                }
                sudokuTable.appendChild(row);
            }
        })
        .catch(error => console.error('Error fetching data:', error));
});

// 获取所有数字按钮
const numberButtons = document.querySelectorAll('.number-button');

// 为每个按钮添加点击事件监听器
numberButtons.forEach(button => {
    button.addEventListener('click', function () {
        // 获取按钮的值
        const buttonValue = this.getAttribute('data-value');

        // 获取当前选中的单元格
        const selectedCell = document.querySelector('.selected-cell');

        // 如果有选中的单元格，将按钮的值设置为单元格的文本内容
        if (selectedCell) {
            selectedCell.textContent = buttonValue;
            wrSound.currentTime = 0; // 播放音效
            wrSound.play();

            // 检查同一行和同一列是否有相同数字
            const rowIndex = selectedCell.parentElement.rowIndex;
            const colIndex = selectedCell.cellIndex;
            const table = selectedCell.parentElement.parentElement;

            // 获取当前单元格的值
            const cellValue = selectedCell.textContent;

            // console.log(cellValue)

            // 检查同一行是否有相同数字
            const row = table.rows[rowIndex];
            for (let i = 0; i < row.cells.length; i++) {
                if (i !== colIndex && row.cells[i].textContent === cellValue && cellValue!=='') {
                    // 发现相同数字，高亮单元格并显示错误提示
                    selectedCell.classList.remove('highlighted');
                    selectedCell.classList.add('error-highlight');
                    showError("注意！对应行列该数字只能出现一次哟😁");
                    return; // 停止检查，以免重复高亮
                }else{
                        clearError()
                        selectedCell.classList.remove('error-highlight');
                        selectedCell.classList.add('highlighted');
                }
            }

            // 检查同一列是否有相同数字
            for (let i = 0; i < table.rows.length; i++) {
                if (i !== rowIndex && table.rows[i].cells[colIndex].textContent === cellValue && cellValue!=='') {
                    // 发现相同数字，高亮单元格并显示错误提示
                    // 当出现错误时的高亮
                    selectedCell.classList.remove('highlighted');
                    selectedCell.classList.add('error-highlight');
                    showError("注意！对应行列该数字只能出现一次哟😁");
                    return; // 停止检查，以免重复高亮
                }else{
                        clearError()
                        selectedCell.classList.remove('error-highlight');
                        selectedCell.classList.add('highlighted');
                }
            }
        }
    });
});

// 清除错误样式和错误提示
function clearError() {
    const cellsWithErrors = document.querySelectorAll('.error');
    cellsWithErrors.forEach(cell => cell.classList.remove('error'));
    hideError();
}

// 显示错误提示
function showError(errorMessage) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = errorMessage;
    errorElement.style.display = 'block';
}

// 隐藏错误提示
function hideError() {
    const errorElement = document.getElementById('error-message');
    errorElement.style.display = 'none';
}


// 添加一个点击事件监听器，以便在单击带有特殊标记的单元格时进行编辑
const sudokuTable = document.getElementById('sudoku-table');
sudokuTable.addEventListener('click', function (event) {
    // 检查当前点击的单元格是否有特殊标记
    if (event.target.tagName === 'TD' && event.target.classList.contains('editable-cell')) {
        const selectedCell = document.querySelector('.selected-cell');

        // 移除之前的选中状态
        if (selectedCell) {
            selectedCell.classList.remove('selected-cell');
        }

        // 添加选中状态到当前点击的单元格
        event.target.classList.add('selected-cell');
    }
});

// 获取计时显示元素和暂停按钮
const timerElement = document.getElementById('timer');
const pauseButton = document.getElementById('pauseButton');
const resumeButton = document.getElementById('resumeButton');
//设置窗口
const settingsButton = document.getElementById('settingsButton');
const settingsModal = document.getElementById('settingsModal');
const closeSettingsButton = document.getElementById('closeSettings');

let startTime; // 用于存储计时开始时间的变量
let timerInterval; // 用于存储计时器的变量
let isTimerPaused = false; // 用于存储计时器的暂停状态

// 更新计时显示
function updateTimer() {
  const currentTime = new Date().getTime();
  const elapsedTime = new Date(currentTime - startTime);
  const hours = String(elapsedTime.getUTCHours()).padStart(2, '0');
  const minutes = String(elapsedTime.getUTCMinutes()).padStart(2, '0');
  const seconds = String(elapsedTime.getUTCSeconds()).padStart(2, '0');
  timerElement.textContent = `${hours}:${minutes}:${seconds}`;
}

let elapsedTime = 0; // 用于存储已经过去的时间的变量

function startTimer() {
    if (!isTimerPaused) {
      startTime = new Date().getTime() - elapsedTime; // 加回已经过去的时间
      timerInterval = setInterval(updateTimer, 1000); // 每秒更新一次计时显示
      isTimerPaused = false; // 标记计时器已启动
    }
  }
  


// 暂停计时
function pauseTimer() {
    clearInterval(timerInterval); // 停止计时器
    elapsedTime = new Date().getTime() - startTime - 1; // 计算已经过去的时间
    isTimerPaused = true; // 标记计时器已暂停
}
  

// 给暂停按钮添加点击事件监听器
pauseButton.addEventListener('click', function () {
  pauseTimer();
  modal.style.display = 'block'; // 显示模态框
  settingsButton.disabled = true;
});

// 给继续按钮添加点击事件监听器
resumeButton.addEventListener('click', function () {
  modal.style.display = 'none'; // 隐藏模态框
  isTimerPaused = false; // 设置计时器继续状态
  startTimer(); // 继续计时器
  settingsButton.disabled = false;
});

// 页面加载时开始计时
document.addEventListener('DOMContentLoaded', startTimer);

// 获取所有具有 id="write" 的按钮
const wrButtons = document.querySelectorAll('#write');

// 获取音频元素
const wrSound = document.getElementById('wrSound');

// 遍历按钮并为每个按钮添加点击事件监听器
wrButtons.forEach(button => {
    button.addEventListener('click', function () {
        // 在这里添加播放音效的代码
        wrSound.play(); // 调用播放音效的函数
    });
});

// 获取按钮元素
const eraseButton = document.getElementById('erase');

// 获取音频元素
const eraseSound = document.getElementById('eraseSound');

// 为按钮添加点击事件监听器
eraseButton.addEventListener('click', function () {
    // 播放音效
    eraseSound.play();
});


const volumeSlider = document.getElementById('volumeSlider');
volumeSlider.addEventListener('input', function () {
    const volume = parseFloat(volumeSlider.value);
    wrSound.volume = volume;
    eraseSound.volume = volume;
});



settingsButton.addEventListener('click', function () {
    settingsModal.style.display = 'block';
    pauseTimer();
    // 点击设置按钮后禁用暂停按钮
    pauseButton.disabled = true;
});


closeSettingsButton.addEventListener('click', function () {
    settingsModal.style.display = 'none';
    isTimerPaused = false; // 设置计时器继续状态
    startTimer(); // 继续计时器
    // 点击设置按钮后禁用暂停按钮
    pauseButton.disabled = false;
});

// 打开模态框的函数
function openModal() {
    var modal = document.getElementById('sudokuModal');
    modal.style.display = 'block';

    // 读取JSON文件并生成表格
    fetch('sudoku_data_solved_40_1.json')
        .then(response => response.json())
        .then(data => {
            if (data.solution && Array.isArray(data.solution) && data.solution.length === 9) {
                var tableHtml = '<table>';
                for (var i = 0; i < data.solution.length; i++) {
                    tableHtml += '<tr>';
                    for (var j = 0; j < data.solution[i].length; j++) {
                        tableHtml += '<td>' + data.solution[i][j] + '</td>';
                    }
                    tableHtml += '</tr>';
                }
                tableHtml += '</table>';
                console.log(tableHtml);
                // 将表格添加到模态框中
                var sudokuTable = document.getElementById('sudokuTable');
                sudokuTable.innerHTML = tableHtml;
            } else {
                console.error('Invalid data format: Missing or invalid "solution" property.');
            }
        })
        .catch(error => {
            console.error('Error loading Sudoku data: ' + error);
        });
}

// 当用户点击模态框之外的区域时关闭模态框
window.onclick = function (event) {
    var modal = document.getElementById('sudokuModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// 监听按钮点击事件
var showAnswerBtn = document.getElementById('searchanswerButton');
showAnswerBtn.addEventListener('click', openModal);