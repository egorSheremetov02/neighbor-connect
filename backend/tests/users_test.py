def check_user_response_validity_by_initial_create_request(response, request):
    for k, v in response.json().items():
        if k in request.keys():
            assert v == request[k]
        elif k == "member_since":
            assert v is not None
        elif k == "interests":
            assert v == []
        elif k == 'is_active':
            assert v == True
        else:
            assert v is None

def create_user(client, create_request):
    return client.post("/auth/register", json=create_request)

def login_user(client, username, password):
    return client.post("/auth/login", data={'username': username, 'password': password})

def create_and_login_user(client, create_request):
    create_response = create_user(client, create_request)
    assert create_response.status_code == 200
    return login_user(client, create_request['login'], create_request['password'])

def test_create_user(client):
    create_request = {
      "fullName": "Alexey Shevtsov",
      "email": "constructor@university.de",
      "login": "yaitsa",
      "password": "jollygolf239",
      "permanent_address": "British Virgin Islands"
    }

    assert create_user(client, create_request).status_code == 200

def test_get_user(client):
    create_request = {
      "fullName": "Who Am I",
      "email": "whyam@idoing.this",
      "login": "killmekillme",
      "password": "nooooooooooooooooooooooooo",
      "permanent_address": "Constructor University"
    }
    assert create_user(client, create_request).status_code == 200

    response = client.get("/users/users/killmekillme")
    assert response.status_code == 200
    check_user_response_validity_by_initial_create_request(response, create_request)

def test_same_email_users(client):
    create_first_guy = {
      "fullName": "Chunga",
      "email": "same@email.com",
      "login": "chunga1957",
      "password": "chungachunga",
      "permanent_address": "Somewhere in Indian ocean"
    }

    create_second_guy = {
      "fullName": "Changa",
      "email": "same@email.com",
      "login": "changa1963",
      "password": "changachanga",
      "permanent_address": "Somewhere in Indian ocean"
    }

    assert create_user(client, create_first_guy).status_code == 200
    assert create_user(client, create_second_guy).status_code == 409

def test_same_login_users(client):
    create_first_guy = {
      "fullName": "Biba",
      "email": "biba@constructor.university",
      "login": "dva_dolbo999",
      "password": "bibabiba",
      "permanent_address": "Bremen, Germany"
    }
    create_second_guy = {
      "fullName": "Boba",
      "email": "boba@constructor.university",
      "login": "dva_dolbo999",
      "password": "bobaboba",
      "permanent_address": "Bremen, Germany"
    }

    assert create_user(client, create_first_guy).status_code == 200
    assert create_user(client, create_second_guy).status_code == 409

def test_login(client):
    create_request = {
      "fullName": "Emperor",
      "email": "small@d.energy",
      "login": "admin",
      "password": "i_am_the_king",
      "permanent_address": "Lives with his mom probably"
    }
    response = create_and_login_user(client, create_request)
    assert response.status_code == 200
    assert list(response.json().keys()) == ['access_token', 'token_type']
    assert response.json()['token_type'] == 'bearer'

def test_my_profile(client):
    create_request = {
      "fullName": "Ligma",
      "email": "hihanki@hahanki",
      "login": "who_is_ligma",
      "password": "ahhahahahahah",
      "permanent_address": "LIGMA *censored*"
    }

    access_token = create_and_login_user(client, create_request).json()['access_token']

    response = client.get(
        "/users/my_profile",
        headers={
          "Authorization": f"Bearer {access_token}"
        }
    )

    assert response.status_code == 200
    check_user_response_validity_by_initial_create_request(response, create_request)


def test_modify_profile(client):
    create_request = {
      "fullName": "Dominic Toretto",
      "email": "net@nichego.pechalnee",
      "login": "chem_zver",
      "password": "zaperty_v_kletke",
      "permanent_address": "THIS IS BRASIL"
    }
    modify_request = {
      "fullName": "Luke Hobbs",
      "email": "toretto@ti.arestovan",
      "login": "skoro_uvidimsa_toretto",
      "password": "ya_poydu_s_toboy_toretto",
      "permanent_address": "States",
      "current_address": "States",
      "gender": None,
      "phone_number": None,
      "birthday": None,
      "bio_header": "bold",
      "bio_description": "ya lysiy)))",
      "interests": [
        "toretto"
      ]
    }

    access_token = create_and_login_user(client, create_request).json()['access_token']
    headers={"Authorization": f"Bearer {access_token}"}

    response = client.post(
        "/users/modify_profile",
        json=modify_request,
        headers=headers
    )
    assert response.status_code == 200

    response = client.get(
        "/users/my_profile",
        headers=headers
    )
    assert response.status_code == 200

    check_user_response_validity_by_initial_create_request(response, modify_request)

def test_my_profile_without_token(client):
    create_request = {
      "fullName": "I am out",
      "email": "of@jokes.sad_emoji",
      "login": "i_think_i_am_going_to_have_a_doner",
      "password": "and_then_i_will_go_to_sleep",
      "permanent_address": "hrrrrrrrrrr"
    }

    access_token = create_and_login_user(client, create_request).json()['access_token']
    response = client.get(
        "/users/my_profile"
    )

    assert response.status_code == 403

