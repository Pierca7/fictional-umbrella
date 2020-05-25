# Voice client

## Prerequisites

1. Install Python 3.8.
2. Install all dependencies by running `pip3 install -r requirements.txt` within the voice client folder.
3. If you are iin Windows, make sure you have the Porcupine's Windows requirements at the library path. If they are missing, run `python3 ./voice-client.py` and add them in the expected folders. You can find the files at [Porcupine's GitHub](https://github.com/Picovoice/Porcupine).
4. Download the [model for the speech recognition library](https://alphacephei.com/kaldi/models/vosk-model-small-en-us-0.3.zip), unzip it and paste the content within a `model` folder at the root of the project. 

**NOTE: If you have issues installing PyAudio, please follow the steps specified at this [Stack Overflow post](https://stackoverflow.com/questions/52283840/i-cant-install-pyaudio-on-windows-how-to-solve-error-microsoft-visual-c-14)**
