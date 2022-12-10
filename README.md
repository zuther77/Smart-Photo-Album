# Smart-Photo-Album
Cloud Application for Smart Photo Album

### The project is no longer hosted due to free tier limits on AWS

### To host this project on your own account
- Add frontend folder content to S3 bucket. Enable static web-hosting and point it to index.html
- Use lambda functions and add event triggers on S3 if needed
- Setup AWS Lex to recognize the search query and custom lables.
- Usinng the API yaml file, setup the API gateway. You would have modify the yaml. Change ARN where ever necessary.
- Check CORS is enabled of your API gateway
- Create an elastic search index using AWS OpenSearch. 
- Add necessary envirnoment variables for the lambda functions

### Description
Implement a photo album web application, that can be searched using natural language through both text and voice. We will be using Lex, ElasticSearch, and Rekognition to create an intelligent search layer to query your photos for people, objects, actions, landmarks and more.

Example Interaction for this Smart Photo Album is 
1. Visit your photo Album Application using the S3 hosted URL.
2. Search photos using Natural Language via voice and text.
3. See relevant results(ex.If you searched for a cat,you should be able to see photos with cats in them) based on what you searched.
4. Upload new photos(with or without custom labels) and see the mappear in the search results.

### Architecture Diagram

![alt text](https://github.com/abhishek66642/Smart-Photo-Album/blob/main/images/ArchitectureDiagram.png)
