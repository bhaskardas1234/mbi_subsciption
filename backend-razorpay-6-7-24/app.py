from settings import *
from module import *
from http import client
from requests import Session
from settings import *
from  module import *
import razorpay
client = razorpay.Client(auth=(os.getenv('RAZORPAY_KEY_ID'), os.getenv('RAZORPAY_KEY_SECRET')))

@app.route("/add_user", methods=["post"])
def add_user_info():
    userData = request.json
    print("user data to be stored----------------------------------------",userData)
    return add_user(userData)


@app.route("/find-user", methods=["POST"])
def find_user_in_db_route():
    data = request.get_json()
    type = request.args.get("type")
    response, status_code = find_user_in_db(data, type)
    return response, status_code


@app.route("/save-user-session", methods=["POST"])
def save_user_session_route():
    data = request.get_json()
    response, status_code = save_user_session(data)
    return response, status_code


@app.route("/remove-user-session", methods=["POST"])
def remove_user_session_route():
    user_id, session_id = request.cookies.get("user_id"), request.cookies.get(
        "session_id"
    )
    print(f"{user_id} :: {session_id}")
    response, status_code = remove_user_session(user_id, session_id)
    return response, status_code

    
 #razorpay
    
@app.route('/create_order', methods=['POST'])
def create_order():
    data=request.json
    print("check------------------------------------------------->",data)

    try:
        course_amount = int(request.json['courseAmount'])  # Convert INR to paisa
        print("thisssssssss",course_amount)
        order = client.order.create({
            'amount': course_amount*100,
            'currency': 'INR',
            'payment_capture': 1  # Auto capture payment when order is created
        })
        print("order created",order)
        return jsonify({'order_id': order['id']}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/verify_payment', methods=['POST'])
def verify_payment():
    data = request.json
    print(data)
    razorpay_payment_id = data['razorpay_payment_id']
    razorpay_order_id = data['razorpay_order_id']
    razorpay_signature = data['razorpay_signature']
    uid=data['uid']
    money=data['money']
    print("requested data------------------------------------")
    print(data)
    payment_info=get_user_by_id(uid)
    print("user data for whom data will be stored")
    print("payment_info",payment_info)
    print(type(payment_info))
    print(tuple(payment_info))
    payment_details={
        
        "phone_number":payment_info['phone'],
        "email":payment_info['email'],
        "subscription_details":0,
        "order_id":razorpay_order_id,
        "payment_id":razorpay_payment_id,
        "payment_status":"success",
        "final_amount":money,
        "discount":0.0,
        "cupon_code":"max",

    }
    
    try:
        # Verify payment signature
        client.utility.verify_payment_signature({
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_order_id': razorpay_order_id,
            'razorpay_signature': razorpay_signature
        })
        print("sucess paylode to be stroed on database--------------------------------------------->")
        print(payment_details)
        # If signature verification passes, mark payment as successful and save in database
        save_payment_details(payment_details)
        #storing the subscription details
       
        
       
        seconds_in_30_days = 30 * 24 * 60 * 60
        data={
            "user_id":uid,
            "start_day":int(time.time()),
            "end_day":int(time.time())+seconds_in_30_days,
            "s_id":1,
            "content_details":{"access":"all"},
            "user_hash":"49#value"
            }
       

        


        save_user_subscription_details(data)

        return jsonify({'status': 'Payment successful'})
    except razorpay.errors.SignatureVerificationError as e:
        # Handle signature verification failure
        print(f"Signature verification failed: {str(e)}")
        return jsonify({'error': 'Payment verification failed'}), 400
    except Exception as e:
        # Handle other unexpected errors
        print(f"Payment verification failed: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/record_payment_failure', methods=['POST'])
def record_payment_failure():
    data = request.json
    print("failure data...........................")
    print(data)
    razorpay_payment_id = data['razorpay_payment_id']
    razorpay_order_id = data['razorpay_order_id']
    uid=data['uid']
    money=data['money']
    payment_info=get_user_by_id(uid)#featch user data as uid
    print(payment_info)
    payment_details={
        
        "phone_number":payment_info['phone'],
        "email":payment_info['email'],
        "subscription_details":money,
        "order_id":razorpay_order_id,
        "payment_id":razorpay_payment_id,
        "payment_status":"failed",
        "final_amount":0.0,
        "discount":0.0,
        "cupon_code":"None",

    } 
    save_payment_details(payment_details)
    return jsonify({'status': 'Payment failed  and stored data sucessfully'})


if __name__=="__main__":
    app.run(debug=True)







    