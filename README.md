# API Documentation

## Base URL
PARENT API = endpoint/{request_type}/{request}

<<<<<<< HEAD
get = For get some data but still using POST methode
post = For insert some data

=======
>>>>>>> ba398a37f27805739ed558a1664058564f1f8e07
All requests to the API must be encrypted. Client should encrypt the data before sending it to the API.

## Example Encryption Process
Before encryption:
{
    offset: 0,
    limit: 2
}

After encryption (sent to API):
{
    content: "encrypted_data"
}

## Endpoints

### GET Requests

1. Get All Images (with pagination)
   - URL: endpoint/get/images
   - Body: { offset: number, limit: number }

2. Search Image
   - URL: endpoint/get/search
   - Body: { key: string }

3. Get All Tags
   - URL: endpoint/get/tags

### POST Requests

1. Create User
   - URL: endpoint/post/user
   - Body: { user_name: string, password: string, created_at: string }

2. Create Image
   - URL: endpoint/post/image
   - Body: { image_id: string (10), title: string, description: string | "", sender_id: string, tag_id: array, created_at: string }

## Example Request

Encrypted data: 
VTJGc2RHVmtYMTlPTW5YRzR0L3VqNUs5OXN4NC9jdjYvS0dBb1RrZWNIazFYM1BTUFRhV1BPaVRxRFJTb2U2OG9DMDA3T01CZW1UUFNKamhOZDh4dE02a0xKdVJoQUd3aWl0VjhMejJKaVk9

JSON sent to API:
{
    content: "VTJGc2RHVmtYMTlPTW5YRzR0L3VqNUs5OXN4NC9jdjYvS0dBb1RrZWNIazFYM1BTUFRhV1BPaVRxRFJTb2U2OG9DMDA3T01CZW1UUFNKamhOZDh4dE02a0xKdVJoQUd3aWl0VjhMejJKaVk9"
}

Note:
- All request bodies should be encrypted before sending to the API.
- The API expects the encrypted data in the 'content' field of the request body.
- Follow the specified data types and length restrictions for fields like user_name and image_id.
