import requests
import json
from datetime import datetime
import pytz
import time


current_time_millis = int(round(time.time() * 1000))

current_time_utc = datetime.now(pytz.utc).isoformat()
# Firestore에 문서 추가
def add_document_to_firestore(document_data):

    url = "https://firestore.googleapis.com/v1/projects/nwitter-reloaded-683ef/databases/(default)/documents/messages"

    response = requests.post(url, json=document_data)
    return response.json()

document_data = {
    'fields': {
        'message': {'stringValue': '파이썬에서 보내는 메시지22'},
        'createdAt': {'integerValue': current_time_millis},
        'username': {'stringValue': 'MBTI'},
        'userId': {'stringValue': '1'},
        'time': {'timestampValue': current_time_utc},
        'type': {'stringValue': "text"},
        'chatRoomId': {'nullValue': None}
    }
}
response = add_document_to_firestore( document_data)
print(response)