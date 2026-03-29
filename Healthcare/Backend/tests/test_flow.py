import pytest


async def test_full_flow(client):

    patient = await client.post("/auth/register", json={
        "name": "P1",
        "email": "p1@mail.com",
        "password": "123456",
        "role": "patient"
    })

    doctor = await client.post("/auth/register", json={
        "name": "D1",
        "email": "d1@mail.com",
        "password": "123456",
        "role": "doctor"
    })

    admin = await client.post("/auth/register", json={
        "name": "A1",
        "email": "a1@mail.com",
        "password": "123456",
        "role": "admin"
    })

    patient_id = patient.json()["id"]
    doctor_user_id = doctor.json()["id"]

    res = await client.post("/auth/login", json={
        "email": "a1@mail.com",
        "password": "123456"
    })
    admin_token = res.json()["access_token"]

    await client.put(
        f"/admin/doctors/{doctor_user_id}/approve",
        headers={"Authorization": f"Bearer {admin_token}"}
    )

    res = await client.post("/auth/login", json={
        "email": "d1@mail.com",
        "password": "123456"
    })
    doctor_token = res.json()["access_token"]

    res = await client.post(
        "/doctors",
        json={
            "specialization": "Cardiology",
            "experience": 5,
            "availability": ["Mon"]
        },
        headers={"Authorization": f"Bearer {doctor_token}"}
    )

    doctor_id = res.json()["id"]

    res = await client.post("/auth/login", json={
        "email": "p1@mail.com",
        "password": "123456"
    })
    patient_token = res.json()["access_token"]

    res = await client.post(
        "/appointments",
        json={
            "doctor_id": doctor_id,
            "appointment_time": "2026-03-30T10:00:00"
        },
        headers={"Authorization": f"Bearer {patient_token}"}
    )

    appointment_id = res.json()["id"]

    await client.put(
        f"/appointments/{appointment_id}?status=completed",
        headers={"Authorization": f"Bearer {doctor_token}"}
    )

    await client.post(
        "/prescriptions",
        json={
            "appointment_id": appointment_id,
            "notes": "Rest",
            "medicines": [{
                "name": "Paracetamol",
                "dosage": "500mg",
                "days": 5
            }]
        },
        headers={"Authorization": f"Bearer {doctor_token}"}
    )

    res = await client.get(
        f"/prescriptions/appointment/{appointment_id}",
        headers={"Authorization": f"Bearer {patient_token}"}
    )

    assert res.status_code == 200