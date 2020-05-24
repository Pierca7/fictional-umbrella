import argparse
import os
import struct
import sys
from datetime import datetime
from threading import Thread

import numpy as np
import pyaudio
import soundfile
import pvporcupine

def main():
  keywordsPath = os.getcwd() + "\\src\\voice-client\\wakewords\\"

  porcupine = pvporcupine.create(keyword_file_paths=[keywordsPath + "bumblebee_windows.ppn"], keywords=["bumblebee"])

  while True:
    line = sys.stdin.readline()
    print("From Python")

# Add Porcupine's library paths into path
sys.path.append(os.path.join(os.path.dirname(pvporcupine.__file__), '../../binding/python'))
sys.path.append(os.path.join(os.path.dirname(pvporcupine.__file__), '../../resources/util/python'))

# Start the execution
main()

