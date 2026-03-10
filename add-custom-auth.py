#!/usr/bin/env python3
"""
批量为所有zh-CN目录下的HTML文件添加custom-auth.js脚本引用
"""

import os
import re
from pathlib import Path

def add_custom_auth_script(file_path):
    """在HTML文件的</body>标签前添加custom-auth.js引用"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # 检查是否已经添加过
        if 'custom-auth.js' in content:
            return False

        # 在</body>标签前添加脚本引用
        # 匹配 </body></html> 或 </body> 后面跟换行
        pattern = r'(</body>\s*</html>)'
        replacement = r'<script src="custom-auth.js"></script>\n\1'

        new_content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)

        # 如果没有匹配到，尝试另一种模式
        if new_content == content:
            pattern2 = r'(</body>)'
            replacement2 = r'<script src="custom-auth.js"></script>\n\1'
            new_content = re.sub(pattern2, replacement2, content, flags=re.IGNORECASE)

        # 只有当内容确实改变时才写入
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True
        return False

    except Exception as e:
        print(f"处理文件 {file_path} 时出错: {e}")
        return False

def main():
    """主函数"""
    zh_cn_dir = Path(__file__).parent / 'zh-CN'

    if not zh_cn_dir.exists():
        print("错误：zh-CN目录不存在")
        return

    # 统计
    total_files = 0
    updated_files = 0
    skipped_files = 0

    # 遍历所有HTML文件
    for html_file in zh_cn_dir.rglob('*.html'):
        total_files += 1
        if add_custom_auth_script(html_file):
            updated_files += 1
            print(f"✓ 已更新: {html_file.relative_to(zh_cn_dir)}")
        else:
            skipped_files += 1

    print(f"\n处理完成！")
    print(f"总文件数: {total_files}")
    print(f"已更新: {updated_files}")
    print(f"已跳过: {skipped_files}")

if __name__ == '__main__':
    main()
