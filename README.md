PARENT API = endpoint/{request_type}/{request}

ALL JSON FROM CLIENT:
Client:
Before encryption (encrypted_data)
{
    offset: 0,
    limit: 2
}
After encryption and send to the REST API
{
    content: encrypted_data
}

API Used

GET METHOD
Get All Image & Still with limit
endpoint/get/images
JSON 
{
    offset: number,
    limit: number
}
Example:
Encrypted data: VTJGc2RHVmtYMTlPTW5YRzR0L3VqNUs5OXN4NC9jdjYvS0dBb1RrZWNIazFYM1BTUFRhV1BPaVRxRFJTb2U2OG9DMDA3T01CZW1UUFNKamhOZDh4dE02a0xKdVJoQUd3aWl0VjhMejJKaVk9
JSON:
{
    content: "VTJGc2RHVmtYMTlPTW5YRzR0L3VqNUs5OXN4NC9jdjYvS0dBb1RrZWNIazFYM1BTUFRhV1BPaVRxRFJTb2U2OG9DMDA3T01CZW1UUFNKamhOZDh4dE02a0xKdVJoQUd3aWl0VjhMejJKaVk9"
}

Search Image based key
endpoint/get/search
JSON
{
    key: string,
}

Get all tag
endpoint/get/tags

POST METHOD
Create user
endpoint/post/user
JSON 
{
    user_name: string (8), 
    password: string,
    created_at: string
}

Create image
endpoint/post/image
JSON 
{
    image_id: string (10),
    title: string,
    description: string | "",
    sender_id: string,
    tag_id: array,
    created_at: string
}
