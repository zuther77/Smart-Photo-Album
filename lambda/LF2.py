import json
import boto3
import requests
import os

lex = boto3.client('lexv2-runtime')

def cleanData(query):
    word_list = query.split(" ")
    w_list=[]
    for word in word_list:
        if (word=="and" or word=="or" or word==","):
            continue
        w_list.append(word)
    return w_list

def get_labels(query):
    response = lex.recognize_text(
        botAliasId=os.environ['BOT_ALIAS_ID'],
        botId = os.environ['BOT_ID'],
        sessionId = os.environ['SESSION_ID'],
        localeId = 'en_US',
        text=query
    )
    
    interpretedValue = response["interpretations"][0]["intent"]["slots"]["ObjectName"]["value"]["interpretedValue"]
    labels = cleanData(interpretedValue)

    return labels


def get_photo_path(keys):
    region = 'us-east-1'
    service = 'es'
    host = os.environ['ELASTIC_SOURCE']
    index = 'photos'
    url = host + '/' + index + '/_search'
    query = {
        "size": 100,
        "query": {
            "multi_match": {
                "query": keys,
            }
        }
    }
    
    headers = {"Content-Type": "application/json"}
    r = requests.get(url, auth=(os.environ["ELASTIC_USER"], os.environ["ELASTIC_PASS"]),
                     headers=headers, data=json.dumps(query))
    response = r.json()
    
    image_list = []
    photos_list = response['hits']['hits']
    if (photos_list!=[]):
        for photo in photos_list:
            image_list.append(photo['_source']['objectKey'])
    
    return image_list
    
def lambda_handler(event, context):
    # TODO implement
    
    query = event["queryStringParameters"]['q']
    label_list = get_labels(query)
    print (label_list)
    
    image_array = []
    for label in label_list:
        image_array.extend(get_photo_path(label))
    
    return {
        'statusCode': 200,
        'headers':{
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*',
            'Content-Type': 'application/json'
        },
        'body': json.dumps({"keys":image_array})
    }