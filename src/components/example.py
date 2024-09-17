import requests

url = "https://firestore.googleapis.com/v1/projects/nwitter-reloaded-683ef/databases/(default)/documents/messages"
response = requests.get(url)
data = response.json()

# 각 문서에 대해 필요한 데이터 추출
for document in data['documents']:
    username = document['fields']['username']['stringValue']
    message = document['fields']['message']['stringValue']
    chatRoomId = document['fields']['chatRoomId'].get('stringValue', None)

    print("Username:", username)
    print("Message:", message)
    print("Chat Room ID:", chatRoomId)
