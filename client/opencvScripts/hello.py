# -*- coding: utf-8 -*-

import sys

if __name__ == "__main__":
  if len(sys.argv) > 1:
    name = bytes.fromhex(sys.argv[1]).decode("utf8")
    print(f"Hello from Python to {name}!")
  else:
    print("Hello from Python!")
