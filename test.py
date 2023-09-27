import unittest
from .suduko import create_sudoku_data
class TestSudoku(unittest.TestCase):
    def test_create_sudoku_data(self):
        # 调用 create_sudoku_data 函数并断言返回的数据符合预期
        data = create_sudoku_data(1, 30)
        self.assertIsInstance(data, dict)
        self.assertIn("puzzle", data)

if __name__ == '__main__':
    unittest.main()