import urllib.request
import urllib.error
try:
    res = urllib.request.urlopen('http://127.0.0.1:8000/staff')
    print("SUCCESS", res.getcode(), res.geturl())
except urllib.error.HTTPError as e:
    print("ERROR", e.code, e.read().decode())
