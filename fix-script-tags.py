import glob

def clean_script_tags():
    html_files = glob.glob('zh-CN/**/*.html', recursive=True)
    count = 0
    for file in html_files:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original_content = content
        
        # 移除多余的 custom-auth.js 引用，只保留一个规范的绝对路径引用
        content = content.replace('<script src="custom-auth.js"></script>', '')
        content = content.replace('<script src="/custom-auth.js"></script>', '')
        content = content.replace('<script src="../custom-auth.js"></script>', '')
        content = content.replace('<script src="../../custom-auth.js"></script>', '')
        # 先移除旧的带 /zh-CN/ 的，待会儿在 </body> 前统一补上
        content = content.replace('<script src="/zh-CN/custom-auth.js"></script>', '') 
        
        # 在 </body> 前统一补上脚本
        # 为了防止被多次替换，我们找到最后一个 </body>，并在其前面加上 script
        if '</body>' in content:
            # 找到最后一个 </body>
            last_body_idx = content.rfind('</body>')
            if last_body_idx != -1:
                content = content[:last_body_idx] + '<script src="/zh-CN/custom-auth.js"></script>\n</body>' + content[last_body_idx+7:]
        
        if content != original_content:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(content)
            count += 1
            
    print(f"清理并重新注入完成！\n总文件数: {len(html_files)}\n已修复: {count}")

if __name__ == '__main__':
    clean_script_tags()
