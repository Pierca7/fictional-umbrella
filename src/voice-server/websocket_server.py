#!/usr/bin/env python3

import json
import os
import sys
import asyncio
import pathlib
import websockets
import concurrent.futures
import logging

from vosk import Model, KaldiRecognizer

vosk_interface = os.environ.get('VOSK_SERVER_INTERFACE', '0.0.0.0')
vosk_port = int(os.environ.get('VOSK_SERVER_PORT', 2700))
vosk_model_path = os.environ.get('VOSK_MODEL_PATH', 'model')
vosk_small_model_path = os.environ.get('VOSK_SMALL_MODEL_PATH', 'model')

# Set the path to the general model
if len(sys.argv) > 1:
   vosk_model_path = sys.argv[1]

# Set the path to the wakeword model
if len(sys.argv) > 2:
   vosk_small_model_path = sys.argv[2]

wakeword_model = Model(vosk_small_model_path)
model = Model(vosk_model_path)
pool = concurrent.futures.ThreadPoolExecutor()
loop = asyncio.get_event_loop()
wait_for_wakeword = True

def process_chunk(rec, message):
    if rec.AcceptWaveform(message):
        return rec.Result(), True
    else:
        return rec.PartialResult(), False

def process_wakeword_chunk(rec, message):
    if rec.AcceptWaveform(message):
        return rec.Result(), True
    else:
        return rec.PartialResult(), False

async def recognize(websocket, path):
    wakeword_rec = None
    rec = None
    word_list = None
    sample_rate = 16000.0

    while True:
        message = await websocket.recv()

        # Create the wakeword recognizer 
        if not wakeword_rec:
            wakeword_rec = KaldiRecognizer(wakeword_model, sample_rate, "volume up down play pause next previous jump")

        # Create the recognizer
        if not rec:
            rec = KaldiRecognizer(model, sample_rate)

        if wait_for_wakeword:
            response, wakeword_detected = await loop.run_in_executor(pool, process_wakeword_chunk, wakeword_rec, message)
            wait_for_wakeword = not wakeword_detected
        else:
            response, phrase_detected = await loop.run_in_executor(pool, process_chunk, rec, message)
            wait_for_wakeword = phrase_detected
            
        await websocket.send(response)

start_server = websockets.serve(
    recognize, vosk_interface, vosk_port)

loop.run_until_complete(start_server)
loop.run_forever()
