// render_sudoku.js

// 获取返回按钮元素
const backButton = document.getElementById('backButton');

// 添加点击事件处理程序
backButton.addEventListener('click', function () {
    // 获取要跳转到的页面URL
    const targetUrl = backButton.getAttribute('data-target');

    // 跳转到指定页面
    window.location.href = targetUrl;
});

// 加载包含数独游戏数据的 JSON 文件
fetch("all_sudoku_data_30.json")
  .then((response) => response.json())
  .then((data) => {
    // 渲染每个数独游戏
    data.forEach((gameData, index) => {
      const containerId = `sudoku-container-${index + 1}`;
      const sudokuContainer = document.getElementById(containerId);
      
      if (sudokuContainer) {
        // 渲染数独游戏
        renderSudoku(gameData.puzzle, sudokuContainer);
      }
    });
  })
  .catch((error) => {
    console.error("Error loading sudoku data:", error);
  });

// 渲染数独游戏的函数
function renderSudoku(sudokuData, container) {
  // 创建表格元素
  const table = document.createElement("table");
  table.className = "sudoku-table"; // 添加一个CSS类名以便样式化

  // 遍历数独游戏数据并渲染每个格子
  for (let i = 0; i < 9; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < 9; j++) {
      const cell = document.createElement("td");
      cell.textContent = sudokuData[i][j] !== 0 ? sudokuData[i][j] : "";
      row.appendChild(cell);
    }
    table.appendChild(row);
  }

  // 将表格添加到数独容器中
  container.appendChild(table);
}
