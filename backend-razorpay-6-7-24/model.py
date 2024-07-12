from settings import *


class User(db.Model):
    __tablename__="MBI_USER_INFO"
    id=db.Column(db.Integer,primary_key=True,autoincrement = True)
    name=db.Column(db.TEXT)
    email=db.Column(db.TEXT)
    phone_number=db.Column(db.TEXT)
    dob=db.Column(db.TEXT)
    token=db.Column(db.TEXT)
    sessions=db.Column(db.JSON)
    active_sessions=db.Column(db.JSON)
    last_login=db.Column(db.DateTime, default=datetime.now)
    def __init__(self,name,email,phone_number, dob,token,sessions,active_sessions):
        self.name=name
        self.email=email
        self.phone_number=phone_number
        self.dob = dob
        self.token=token
        self.sessions=sessions
        self.active_sessions=active_sessions
    
    def get_user_info(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone_number,
            "dob": self.dob,
            "timestamp": datetime.now()
        }

class Payment(db.Model):
    __tablename__="payment"
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.String(50), unique=True, nullable=False)
    payment_id = db.Column(db.String(50), nullable=True)
    status = db.Column(db.String(20), nullable=False)

    def __init__(self, order_id, payment_id, status):
        self.order_id = order_id
        self.payment_id = payment_id
        self.status = status

#payment_details storing model final       
class payment_details(db.Model):
    __tablename__="payment_details"
    id=db.Column(db.Integer,primary_key=True)
    phone_number=db.Column(db.String(50),nullable=False)#phonenumber
    email=db.Column(db.String(50),nullable=False)
    subscription_details=db.Column(db.Integer,nullable=False)#subscption details amount right now
    start_day=db.Column(db.DateTime, default=datetime.now)
    order_id=db.Column(db.String,nullable=False)
    payment_id=db.Column(db.String,nullable=False)
    payment_status=db.Column(db.String,nullable=False)
    final_amount=db.Column(db.String,nullable=False)
    discount=db.Column(db.Numeric(precision=10, scale=2),nullable=False,default=0.0)
    cupon_code=db.Column(db.String,nullable=True)
    def __init__(self,phone_number,email,subscription_details,order_id,payment_id,payemnt_status,final_amount,discount,cupon_code):
        
        self.phone_number=phone_number
        self.email=email
        self.subscription_details=subscription_details
        self.order_id=order_id
        self.payment_id=payment_id
        self.payment_status=payemnt_status
        self.final_amount=final_amount
        self.discount=discount
        self.cupon_code=cupon_code
    def get_payment_info(self):
        return{
            "id":self.id,
            "phone_number":self.phone_number,
            "email":self.email,
            "subscription_details":self.subscription_details,
            "order_id":self.order_id,
            "payment_id":self.payment_id,
            "payment_status":self.payment_status,
            "final_amount":self.final_amount,
            "discount":self.discount,
            "cupon_code":self.cupon_code
        }
class USER_SUBSCRIPTION(db.Model):
    __tablename__="user_subscription"
    id=db.Column(db.Integer,primary_key=True)
    user_id=db.Column(db.Integer)
    start_day=db.Column(db.Integer)
    end_day=db.Column(db.Integer)
    s_id=db.Column(db.Integer)
    content_details = db.Column(JSONB)
    user_hash=db.Column(db.TEXT)
    
    def __init__(self,user_id,start_day,end_day,s_id,content_detatils,user_hash):
        self.user_id=user_id
        self.start_day=start_day
        self.end_day=end_day
        self.s_id=s_id
        self.content_details=content_detatils
        self.user_hash=user_hash
        
    def user_subscription_info(self):
        return {
            "id":self.id,
            "user_id":self.user_id,
            "start_day":self.start_day,
            "end_day":self.end_day,
            "s_id":self.s_id,
            "content_details":self.content_details,
            "hash":self.user_hash
            
        }

class SUBSCRIPTION(db.Model):

    __tablename__="subscription"
    id=db.Column(db.Integer,primary_key=True)
    duration=db.Column(db.String)
    price=db.Column(db.Integer)
    subscription_type=db.Column(db.Integer)
    def __init__(self,duration,price,subscription_type):
        self.duration=duration
        self.price=price
        self.subscription_type=subscription_type
    
    def subscription_info(self):
        return{
            "id":self.id,
            "duration":self.duration,
            "price": self.price,
            "subscription_type":self.subscription_type
             }



    


        



