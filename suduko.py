import http.server  # 导入http.server模块
import json
import random
import webbrowser
from multiprocessing import Pool
import time
import threading
from queue import Queue



# 自定义处理程序类，继承自http.server.SimpleHTTPRequestHandler
class MyRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # 添加 "x-content-type-options" 头部到响应中
        self.send_header('x-content-type-options', 'nosniff')
        super().end_headers()


def generate_sudoku():
    # 生成一个空的数独游戏板
    board = [[0] * 9 for _ in range(9)]

    # 随机填充第一行
    nums = random.sample(range(1, 10), 9)
    for i in range(9):
        board[0][i] = nums[i]

    # 生成完整的数独解
    solve_sudoku(board)

    return board


def is_valid(board, row, col, num):
    # 检查行是否合法
    if num in board[row]:
        return False

    # 检查列是否合法
    if num in [board[i][col] for i in range(9)]:
        return False

    # 检查 3x3 方格是否合法
    start_row, start_col = 3 * (row // 3), 3 * (col // 3)
    for i in range(start_row, start_row + 3):
        for j in range(start_col, start_col + 3):
            if board[i][j] == num:
                return False

    return True


def solve_sudoku(board):
    for row in range(9):
        for col in range(9):
            if board[row][col] == 0:
                for num in range(1, 10):
                    if is_valid(board, row, col, num):
                        board[row][col] = num
                        if solve_sudoku(board):
                            return True
                        board[row][col] = 0
                return False
    return True


def create_sudoku_data(index, difficulty):
    sudoku_board = generate_sudoku()

    # 保存完整的数独数据到 JSON 文件（例如，sudoku_data_full_30.json）
    with open(f"sudoku_data_full_{difficulty}_{index}.json", "w") as f:
        json.dump({"puzzle": sudoku_board}, f)

    # 根据难度参数确定挖去的空格数量
    if difficulty == 30:
        num_to_remove = 30
    elif difficulty == 40:
        num_to_remove = 40
    elif difficulty == 50:
        num_to_remove = 50
    removed_positions = []  # 用于存储挖空的位置，后续可用于显示答案
    for _ in range(num_to_remove):
        row, col = random.randint(0, 8), random.randint(0, 8)
        while sudoku_board[row][col] == 0 or (row, col) in removed_positions:
            row, col = random.randint(0, 8), random.randint(0, 8)
        removed_positions.append((row, col))
        sudoku_board[row][col] = 0

    return {"puzzle": sudoku_board, "removed_positions": removed_positions}


def write_sudoku_data_to_json(difficulty):
    all_sudoku_data = []

    # 使用多进程并行生成9个数独游戏数据
    with Pool(processes=9) as pool:
        sudoku_data = pool.starmap(create_sudoku_data, [(i, difficulty) for i in range(1, 10)])

    # 生成不同的 JSON 文件名并保存数据到对应的文件
    for i, data in enumerate(sudoku_data):
        filename = f"sudoku_data_{difficulty}_{i + 1}.json"
        with open(filename, "w") as f:
            json.dump(data, f)

    # 将每个数独游戏数据添加到列表中
    for i, data in enumerate(sudoku_data):
        all_sudoku_data.append(data)

    filename = f"all_sudoku_data_{difficulty}.json"
    # 将整个列表写入一个 JSON 文件
    with open(filename, "w") as f:
        json.dump(all_sudoku_data, f)

    # def open_index_html():
    # 打开同一目录下的index.html文件

def solve_sudoku_1(board):
    empty_cell = find_empty_cell(board)

    if not empty_cell:
        return True

    row, col = empty_cell

    for num in range(1, 10):
        if is_valid_move(board, row, col, num):
            board[row][col] = num

            if solve_sudoku_1(board):
                return True

            board[row][col] = 0

    return False

def find_empty_cell(board):
    for row in range(9):
        for col in range(9):
            if board[row][col] == 0:
                return row, col
    return None

def is_valid_move(board, row, col, num):
    return (
        num not in board[row] and
        num not in [board[i][col] for i in range(9)] and
        num not in [board[i][j] for i in range(row - row % 3, row - row % 3 + 3) for j in range(col - col % 3, col - col % 3 + 3)]
    )


def solution(index, difficulty):
    # 读取数独数据
    with open(f"sudoku_data_{difficulty}_{index}.json", "r") as f:
        data = json.load(f)
        sudoku_board = data["puzzle"]
    solve_sudoku_1(sudoku_board)
    

    # 保存解答后的数独数据到 JSON 文件
    with open(f"sudoku_data_solved_{difficulty}_{index}.json", "w") as f:
        json.dump({"solution": sudoku_board}, f)
#    webbrowser.open("file://" + os.path.abspath("index.html"))

def multithreading():
    # 创建队列
    q = Queue()
    # 线程列表
    threads = []
    difficulties = [30,40,50]
    for difficulty in difficulties:
        for i in range(1,10):
            t = threading.Thread(target=solution, args=(i, difficulty))
            t.start()
            threads.append(t)

    # 对所有线程进行阻塞
    for thread in threads:
        thread.join()
    results = []

if __name__ == "__main__":
    # 调用不同难度的数独游戏生成函数
    write_sudoku_data_to_json(30)  # 生成简单难度的数据
    write_sudoku_data_to_json(40)  # 生成中等难度的数据
    write_sudoku_data_to_json(50)  # 生成困难难度的数据

    multithreading()

    # 启动本地服务器，监听端口
    server_address = ('', 8000)  # 可以根据需要选择任何可用的端口
    httpd = http.server.HTTPServer(server_address, MyRequestHandler)

    # 打开默认浏览器并访问服务器地址
    webbrowser.open("http://localhost:8000/index.html")

    try:
        # 启动服务器，Ctrl+C 停止服务器
        print("本地服务器已启动，按 Ctrl+C 停止服务器")
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n服务器已停止")
