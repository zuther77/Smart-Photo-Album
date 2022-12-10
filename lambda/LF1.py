import json
import boto3
import requests
import os

def lambda_handler(event, context):
    # TODO implement
    s3client = boto3.client('s3')
    rekclient=boto3.client('rekognition')
    
    bucket_name = 'b2bucketphotos'
    image_name = event['Records'][0]['s3']['object']['key']
    head_object = s3client.head_object(Bucket=bucket_name,Key=image_name)
    
    lf1response = {
        "objectKey":image_name,
        "bucket":bucket_name,
        "createdTimestamp":head_object['LastModified'].strftime("%Y%m%d-%H%M%S"),
        "labels":[]
    }
    
    customLabels = head_object['ResponseMetadata']['HTTPHeaders'].get('x-amz-meta-customLabels')
    if (customLabels!=None):
        lf1response["labels"].append(customLabels)
    
    rekresponse = rekclient.detect_labels(Image={'S3Object':{'Bucket':bucket_name,'Name':image_name}})
    labelNames = []
    for label in rekresponse['Labels']:
        lf1response['labels'].append(label['Name'])

    region = 'us-east-1'
    service = 'es'
    host = os.environ['ELASTIC_SOURCE']
    index = 'photos'
    type = '_doc'
    url = host + '/' + index + '/' + type + '/' + lf1response['objectKey']

    headers = { "Content-Type": "application/json" }
    r = requests.post(url, auth= (os.environ["ELASTIC_USER"],os.environ["ELASTIC_PASS"]), json=lf1response,headers=headers)
    
    return lf1response
