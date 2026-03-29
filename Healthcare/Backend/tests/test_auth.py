import pytest

@pytest.mark.asyncio
async def test_register_and_login(client):
    # Register
    res = await client.post("/auth/register", json={
        "name": "TestUser",
        "email": "test@mail.com",
        "password": "123456",
        "role": "patient"
    })
    assert res.status_code == 200

    # Login
    res = await client.post("/auth/login", json={
        "email": "test@mail.com",
        "password": "123456"
    })
    assert res.status_code == 200

    data = res.json()
    assert "access_token" in data