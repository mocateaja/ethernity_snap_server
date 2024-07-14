# API Documentation

## Base URL
PARENT API = endpoint/{request_type}/{request}

get = For get some data but still using POST methode
post = For insert some data

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

## Note!

This is still on development and so much change in here because the main app and this README.md is not always show or announce the new feature in here!

## Announcment

Finnaly this REST API has been deployed! 
