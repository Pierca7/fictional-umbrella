import argparse
import os
import struct
import sys

import numpy as np
import pyaudio
import soundfile
import pvporcupine
import io
from vosk import Model, KaldiRecognizer


def main():
  keywordsPath = os.getcwd() + "\\src\\voice-client\\wakewords\\"

  sys.stdout.flush()

  porcupine = pvporcupine.create(keyword_file_paths=[keywordsPath + "bumblebee_windows.ppn"], keywords=["bumblebee"])

  while True:
    audio = sys.stdin.buffer.read(1024)                
    unpackedAudio = struct.unpack_from("h" * porcupine.frame_length, audio)
    result = porcupine.process(unpackedAudio)

    if result:
      sys.stdout.write("Keyword detected")
      model = Model("model")
      rec = KaldiRecognizer(model, 16000)

      while True:
          audio = sys.stdin.buffer.read(4000)                
          if len(audio) == 0:
            break
          if rec.AcceptWaveform(audio):
              print(rec.Result())
          else:
              rec.PartialResult()
          sys.stdout.flush()





# Add Porcupine's library paths into path
sys.path.append(os.path.join(os.path.dirname(pvporcupine.__file__), '../../binding/python'))
sys.path.append(os.path.join(os.path.dirname(pvporcupine.__file__), '../../resources/util/python'))

# Start the execution
main()
