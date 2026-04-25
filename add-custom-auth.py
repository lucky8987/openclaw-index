import os
import glob

def inject_script():
    # 查找 zh-CN 目录下所有的 html 文件
    html_files = glob.glob('zh-CN/**/*.html', recursive=True)
    
    script_tag = '<script src="/zh-CN/custom-auth.js"></script>'
    
    count = 0
    for file_path in html_files:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        if script_tag not in content:
            # 在 </body> 标签前插入
            if '</body>' in content:
                content = content.replace('</body>', f'{script_tag}\n</body>')
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                count += 1
                
    print(f"处理完成！\n总文件数: {len(html_files)}\n已更新: {count}\n已跳过: {len(html_files) - count}")

if __name__ == '__main__':
    inject_script()
