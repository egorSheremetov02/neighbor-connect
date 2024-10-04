from datetime import datetime


def test_create_incident(client):
    create_request = {
        "title": "Test Incident",
        "description": "Test Description",
        "created_at": datetime.now().isoformat(),  # ISO format for datetime
        "location": "Test Location",
        "image_id": None
    }

    headers = {
        "Authorization": "Bearer valid_jwt_token"
    }

    response = client.post(
        "/incidents/",
        json=create_request,
        headers=headers
    )

    assert response.status_code == 403
