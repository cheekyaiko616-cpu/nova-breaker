# 分割したソースを、動作確認用の1つのHTMLにまとめる
import re, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
html = (root / 'index.html').read_text(encoding='utf-8')
html = re.sub(r'<link rel="stylesheet" href="([^"]+)">',
              lambda m: '<style>\n' + (root / m.group(1)).read_text(encoding='utf-8') + '</style>', html)
scripts = re.findall(r'<script src="([^"]+)"></script>', html)
js = '\n'.join(f'// ---- {s} ----\n' + (root / s).read_text(encoding='utf-8') for s in scripts)
html = re.sub(r'(<script src="[^"]+"></script>\n?)+', lambda m: '<script>\n' + js + '\n</script>\n', html, count=1)
out = root / 'dist' / 'nova_breaker.html'
out.write_text(html, encoding='utf-8')
print('built', out, len(html), 'bytes')
