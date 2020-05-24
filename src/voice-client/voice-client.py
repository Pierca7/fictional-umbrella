import argparse
import os
import struct
import sys

import numpy as np
import pyaudio
import soundfile
import pvporcupine
import io

def main():
  keywordsPath = os.getcwd() + "\\src\\voice-client\\wakewords\\"

  sys.stdout.flush()

  porcupine = pvporcupine.create(keyword_file_paths=[keywordsPath + "bumblebee_windows.ppn"], keywords=["bumblebee"])

  while True:
    audio = sys.stdin.buffer.read(1024)                
    audio = struct.unpack_from("h" * porcupine.frame_length, audio)
    result = porcupine.process(audio)

    if result:
      sys.stdout.write("Keyword detected")
      sys.stdout.flush()


# Add Porcupine's library paths into path
sys.path.append(os.path.join(os.path.dirname(pvporcupine.__file__), '../../binding/python'))
sys.path.append(os.path.join(os.path.dirname(pvporcupine.__file__), '../../resources/util/python'))

# Start the execution
main()
