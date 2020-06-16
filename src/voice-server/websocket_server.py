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
action_model = Model(vosk_small_model_path)
model = Model(vosk_model_path)
pool = concurrent.futures.ThreadPoolExecutor()
loop = asyncio.get_event_loop()

def process_chunk(rec, message):
    if rec.AcceptWaveform(message):
        result = json.loads(rec.Result())
        return True, result["text"]
    else:
        return False, rec.PartialResult()

def is_wakeword(rec, message):
    if not rec.AcceptWaveform(message):
        rec.PartialResult()
        return False

    result = json.loads(rec.Result())
    return result["text"] == "hey discord"

def has_action(rec, message):
    if not rec.AcceptWaveform(message):
        rec.PartialResult()        
    else:
        actions = ("play", "pause", "previous", "next", "volume up", "volume down", "resume", "loop", "shuffle", "add", "remove", "queue", "cancel")
        result = json.loads(rec.Result())["text"]            

        if result in actions:
            return True, result

    return False, ""

async def recognize(websocket, path):
    wakeword_rec = None
    action_rec = None
    rec = None
    wakeword = "hey discord"
    action_list = "volume up down play pause next previous resume loop shuffle add remove queue cancel"
    sample_rate = 16000.0
    wait_for_wakeword = True
    wait_for_action = False

    while True:
        message = await websocket.recv()

        # Create the wakeword recognizer 
        if not wakeword_rec:
            wakeword_rec = KaldiRecognizer(wakeword_model, sample_rate, wakeword)

        # Create the action recognizer 
        if not action_rec:
            action_rec = KaldiRecognizer(wakeword_model, sample_rate, action_list)

        # Create the general recognizer
        if not rec:
            rec = KaldiRecognizer(model, sample_rate)

        if wait_for_wakeword:
            wakeword_detected = await loop.run_in_executor(pool, is_wakeword, wakeword_rec, message)
            wait_for_wakeword = not wakeword_detected
            wait_for_action = wakeword_detected
            
            if wakeword_detected:
                await websocket.send("wakeword detected")

        elif wait_for_action:
            action_detected, response = await loop.run_in_executor(pool, has_action, action_rec, message)
            wait_for_action = not action_detected
            wait_for_wakeword = response != "play"

            if action_detected:
                await websocket.send(response)

        else:
            phrase_detected, response = await loop.run_in_executor(pool, process_chunk, rec, message)
            wait_for_wakeword = phrase_detected
            
            if phrase_detected:
                await websocket.send(response)

start_server = websockets.serve(
    recognize, vosk_interface, vosk_port)

loop.run_until_complete(start_server)
loop.run_forever()
