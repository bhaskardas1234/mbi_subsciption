from settings import *
from model import *
maximum_number_of_device_allowed=5
def add_user(data):
     try:
        print("this is the starting of add user function")
        print(data)
        name = data["name"]
        email=data["email"]
        phone_number=data["phoneNumber"]
        token=data["token"]
        fingerprint = data['fingerprint']
        dob = data["dob"]
        new_session_id = str(uuid.uuid4())#create new session id
        new_session = {
            "session_id": new_session_id,
            "network_info": fingerprint["network"],
            "device_info": fingerprint["deviceInfo"]
        }
        sessions = [new_session]#
        active_sessions = [new_session]
        
        newUser=User(name=name,email=email,phone_number=phone_number, dob=dob,token=token,sessions=sessions,active_sessions=active_sessions)
        db.session.add(newUser)
        db.session.commit()
        response = make_response(jsonify({
            "success": "user registered successfully",
            "user": {
                "id": newUser.id,
                "name": newUser.name,
                "email": newUser.email,
                "phone_number": newUser.phone_number,
                "dob": newUser.dob
            }
        }), 200)

        # Set cookies
        expires = datetime.now() + timedelta(days=365)
        response.set_cookie('user_id', str(newUser.id),  secure=True, samesite='Lax', expires=expires)
        response.set_cookie('session_id', new_session_id,  secure=True, samesite='Lax', expires=expires)

        return response
   
     except Exception as e:
        print(e)
        return jsonify({"sucess":"user are not register"})



def save_payment(data, status):
    payment = Payment(
        order_id=data['razorpay_order_id'],
        payment_id=data['razorpay_payment_id'],
        status=status,
    )
    db.session.add(payment)
    db.session.commit()

#new change code
def save_payment_details(data):
    payment_info=payment_details(
                                 phone_number=data['phone_number'],
                                 email=data['email'],
                                 subscription_details=data['subscription_details'],
                                 order_id=data['order_id'],
                                 payment_id=data['payment_id'],
                                 payemnt_status=data["payment_status"],
                                 final_amount=data['final_amount'],
                                 discount=data['discount'],
                                 cupon_code=data['cupon_code'],
                                 )
    print(payment_info)
    db.session.add(payment_info)
    db.session.commit()
    print("payment details stored sucessfully")

def get_user_by_id(uid):
    try:
        user = User.query.filter_by(id=uid).first()
        if user:
            print(user)
            user_info=user.get_user_info()
            print("userinfo",user_info)
            return user_info
        return jsonify({"sucess":"user doesnot match"}),400
    except Exception as e:
        return jsonify({"error":"internal server error"}),500

        



def find_user_in_db(data, type):
    try:
        id = data["id"]
        print(id)
        print(type)
        existing_user = None
        if type == "phone":
            existing_user = User.query.filter_by(phone_number=id).first()
        elif type == "email":
            existing_user = User.query.filter_by(email=id).first()
        if existing_user:
            user_info = existing_user.get_user_info()
            user_info["is_eligible_to_login"] = False if len(existing_user.active_sessions) >= maximum_number_of_device_allowed else True
            return jsonify({
                "message": "user already exists",
                "user_info": user_info
                }), 200
        return jsonify({"message": "user does not exists"}), 404
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500


        
def save_user_session(data):
    try:
        user_id = data["id"]
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({"error": f"User with id: {user_id} not found"}), 404
        user_sessions, user_active_sessions = user.sessions, user.active_sessions
        new_session_id = str(uuid.uuid4())
        new_session_entry = {
            "session_id": new_session_id,
            "network_info": data["network_info"],
            "device_info": data["device_info"],
            "timestamp": str(datetime.now())
        }
        print(new_session_entry)
        user_sessions.append(new_session_entry)
        user_active_sessions.append(new_session_entry)
        # user.sessions, user.active_sessions = user_sessions, active_sessions
        stmt = (update(User).where(User.id == user_id).values(sessions = user_sessions,active_sessions=user_active_sessions))
        print(type(user_sessions))
        print(user_sessions)
        db.session.execute(stmt)
        db.session.commit()

        response = make_response(jsonify({
            "success": "user registered successfully",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "phone_number": user.phone_number,
                "dob": user.dob
            }
        }), 200)

        # Set cookies
        expires = datetime.now() + timedelta(days=365)
        response.set_cookie('user_id', str(user.id), httponly=True, secure=True, samesite='Lax', expires=expires)
        response.set_cookie('session_id', new_session_id, httponly=True, secure=True, samesite='Lax', expires=expires)

        return response, 200
        # return jsonify({"message" : "user session updated successfully"}), 200
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500

def remove_user_session(user_id, session_id):
    try:
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({"error": f"user with user id {user_id} not found"}), 404
        user_active_sessions = user.active_sessions
        print(user_active_sessions)
        updated_active_sessions, removed_session = find_and_remove_session_by_id(user_active_sessions, session_id)
        if removed_session == None:
            return jsonify({"error": f"session for user with id : {user_id} and session id: {session_id} not found"}), 404
        stmt = update(User).where(User.id == user_id).values(active_sessions=updated_active_sessions)
        db.session.execute(stmt)
        db.session.commit()
        return jsonify({
            "message": "successfully logged out",
            "session": removed_session
        }), 200

    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500

def eligible_to_login_in_this_device(data):
    try:
        user_id = data["id"]
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500

def find_and_remove_session_by_id(sessions, session_id):
    for i, session in enumerate(sessions):
        if session["session_id"] == session_id:
            removed_session = sessions.pop(i)
            return sessions, removed_session
    return sessions, None


def save_user_subscription_details(data):
    try:
        user_id=data['user_id']
        start_day=data['start_day']
        end_day=data['end_day']
        content_details=data['content_details']
        s_id=data['s_id']
        user_hash=data['user_hash']
        
        user_subcription_details=USER_SUBSCRIPTION(user_id=user_id,
                                                start_day=start_day,
                                                end_day=end_day,
                                                s_id=s_id,
                                                content_detatils=content_details,
                                                user_hash=user_hash)
        db.session.add(user_subcription_details)
        db.session.commit()
        print("user_subscription_details stored sucessfully")
        return jsonify({"error":"user_suscription_details not stored succesfully"}),200
    except Exception as e:
        print(e)
        return jsonify({"error":"user_subscription_details not stored succesfully"}),500



        
        



        


    
    
