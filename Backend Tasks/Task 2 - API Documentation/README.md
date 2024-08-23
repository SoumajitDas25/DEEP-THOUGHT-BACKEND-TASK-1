# **TASK 2: Nudge Creation API Documentation**

## **API Structure**

| **Widget** | **Request Type** | **Base URL**        | **API Endpoint**                    | **Payload**                                                                                                  | **Description**                                        |
|------------|------------------|---------------------|-------------------------------------|--------------------------------------------------------------------------------------------------------------|--------------------------------------------------------|
| Nudge      | GET              | `/api/v1/nudge`     | `/nudges?id=:nudge_id`              | -                                                                                                            | Retrieves a nudge by its unique ID.                    |
| Nudge      | GET              | `/api/v1/nudge`     | `/nudges?type=latest&limit=5&page=1`| -                                                                                                            | Retrieves the latest nudges with pagination.           |
| Nudge      | POST             | `/api/v1/nudge`     | `/nudges`                           | `type, title, image_url, scheduled_date, timing, description, invitation_text, icon_url`                      | Creates a new nudge and returns its ID.                |
| Nudge      | PUT              | `/api/v1/nudge`     | `/nudges/:id`                       | Same as POST payload                                                                                         | Updates an existing nudge by its unique ID.            |
| Nudge      | DELETE           | `/api/v1/nudge`     | `/nudges/:id`                       | -                                                                                                            | Deletes a nudge based on its unique ID.                |

---

## **Object Data Model of a Nudge**

```json
{
  "type": "string",              // Type of nudge (e.g., event, article)
  "id": "integer",               // Unique ID of the nudge
  "title": "string",             // Title of the nudge (60 characters max)
  "image_url": "string",         // URL of the image
  "scheduled_date": "string",    // Date and time (format: dd/mm/yyyy)
  "timing": "string",            // Timing (format: hh:mm-hh:mm)
  "description": "string",       // Description of the nudge
  "invitation_text": "string",   // One-line invitation text
  "icon_url": "string",          // URL of the icon
  "status": "string"             // Status of the nudge (e.g., active, inactive)
}
```
## **CRUD Functionalities Documentation**

### 1. Create a Nudge
- **Request Type**: POST
- **Endpoint**: `/api/v1/nudge/nudges`
- **Payload**:
  ```json
  {
    "type": "event",               // or "article"
    "title": "Sample Title",        // Up to 60 characters
    "image_url": "https://example.com/image.jpg",
    "scheduled_date": "2024-08-25", // Format: dd/mm/yyyy
    "timing": "14:00-16:00",        // Format: hh:mm-hh:mm
    "description": "This is a sample nudge.",
    "invitation_text": "Check out this upcoming workshop!",
    "icon_url": "https://example.com/icon.png"
  }
  ```
- **Description**: Creates a new nudge with the provided details and returns the unique ID of the created nudge.
- **Response**:
  - Success: `201 Created`
    ```json
    {
    "id": "12345"
    }
    ```
  - Error: `400 Bad Request`
    ```json
    {
    "error": "Invalid input data"
    }
    ```

### 2. Retrieve a Nudge
- **Request Type**: GET
- **Endpoint**: `/api/v1/nudge/nudges?id=:nudge_id`
- **Payload**: None
- **Description**: Retrieves the details of a specific nudge based on its unique ID.
- **Response**:
  - Success: `200 OK`
    ```json
    {
      "id": "12345",
      "type": "event",
      "title": "Sample Title",
      "image_url": "https://example.com/image.jpg",
      "scheduled_date": "2024-08-25",
      "timing": "14:00-16:00",
      "description": "This is a sample nudge.",
      "invitation_text": "Check out this upcoming workshop!",
      "icon_url": "https://example.com/icon.png",
      "status": "active"
    }
    ```
  - Error: `404 Not Found`
    ```json
    {
    "error": "Nudge not found"
    }
    ```

### 3. Update a Nudge
- **Request Type**: PUT
- **Endpoint**: `/api/v1/nudge/nudges/:id`
- **Payload**:
  ```json
  {
    "type": "event",               // or "article"
    "title": "Updated Title",       // Up to 60 characters
    "image_url": "https://example.com/image.jpg",
    "scheduled_date": "2024-08-26", // Format: dd/mm/yyyy
    "timing": "15:00-17:00",        // Format: hh:mm-hh:mm
    "description": "This is an updated nudge.",
    "invitation_text": "Join us for the upcoming workshop!",
    "icon_url": "https://example.com/icon.png"
  }
  ```
- **Description**: Updates the details of an existing nudge based on its unique ID.
- **Response**:
  - Success: `200 OK`
    ```json
    {
      "message": "Nudge updated successfully"
    }
    ```
  - Error: `400 Bad Request`
    ```json
    {
    "error": "Invalid input data"
    }
    ```
  - Error: `404 Not Found`
    ```json
    {
      "error": "Nudge not found"
    }
    ```

### 4. Delete a Nudge
- **Request Type**: DELETE
- **Endpoint**: `/api/v1/nudge/nudges/:id`
- **Payload**: None
- **Description**: Deletes an existing nudge based on its unique ID.
- **Response**:
  - Success: `204 No Content`
    ```json
    {
      "message": "Nudge deleted successfully"
    }
    ```
  - Error: `404 Not Found`
    ```json
    {
    "error": "Nudge not found"
    }
    ```