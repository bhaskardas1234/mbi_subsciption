import './Registration.css';
import mathrubhumiIcon from '../asset/mathrubhumi-logo.png'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import './Registration.css';



const Registration = () => {

    const navigate = useNavigate();
    const dateRef = useRef();

    const [userInfo, setUserInfo] = useState(null);
    const [loginMode, setLoginMode] = useState("");
    const [userDetails, setUserDetails] = useState({
        "name": "",
        "email": "",
        "phone": "",
        "dob": ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [phoneInputReadOnly, setPhoneInputReadOnly] = useState(false);
    const [emailInputReadOnly, setEmailInputReadOnly] = useState(false);
    const [error, setError] = useState(null);

    const handelChange = (e) => {
        const { name, value } = e.target;
        setUserDetails((data) => ({
          ...data,
          [name]: value,
        }));
      };

    useEffect(()=> {
        if(localStorage.getItem("userInfo")) {
            setUserInfo(JSON.parse(localStorage.getItem("userInfo")));
        }
        if(localStorage.getItem("loginMode")) {
            setLoginMode(localStorage.getItem("loginMode"));
        }
        console.log(userInfo);
    }, []);

    useEffect(()=> {
        if(userInfo) {
            formatUserDetails();
        }
    }, [userInfo, loginMode])

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    const formatUserDetails = () => {
        // console.log(userInfo);
        let body = {};
        if(loginMode === "GMAIL") {
            body = {
                name: userInfo.identities[0].name,
                email: userInfo.identities[0].identityValue,
                phone: "",
                dob: ""
            }
            setEmailInputReadOnly(true);
        } else if(loginMode === "WHATSAPP") {
            body = {
                name: userInfo.identities[0].name,
                email: "",
                phone: userInfo.identities[0].identityValue,
                dob: ""
            }
            setPhoneInputReadOnly(true);
        }else if(loginMode === "FACEBOOK") {
            let flag = false
            if(isValidEmail(userInfo.identities[0].identityValue)) flag = true;
            body = {
                name: userInfo.identities[0].name,
                email: flag ? userInfo.identities[0].identityValue: "",
                phone: !flag ? userInfo.identities[0].identityValue: "",
                dob: ""
            }
            if(flag) {setEmailInputReadOnly(true)}
            else setPhoneInputReadOnly(true);
        } else if(loginMode === "EMAIL") {
            body = {
                name: userInfo.identities[0].name,
                email: userInfo.identities[0].identityValue,
                phone:"",
                dob: ""
            }
            setEmailInputReadOnly(true);
        } else if(loginMode === "SMS") {
            body = {
                name: "",
                email: "",
                phone: userInfo.identities[0].identityValue,
                dob: ""
            }
            setPhoneInputReadOnly(true);
        }
        console.log(userDetails);
        setUserDetails((data) => ({
            ...data,
            ...body
        }));
    } 

    const finalAuth = async(e) => {
        e.preventDefault()
        console.log('final-auth');
        setIsLoading(true);
        console.log(userDetails);
        const data = {
            "phoneNumber": userDetails.phone,
            "email": userDetails.email,
            "name": userDetails.name,
            "dob": userDetails.dob,
            "status": "SUCCESS",
            "asid":userInfo.sessionInfo.sessionId,
            "token": userInfo.token,
            "identity": userInfo.identities[0],
            "fingerprint": {
                "network": userInfo.network,
                "deviceInfo": userInfo.deviceInfo,
                "userId": userInfo.userId
            }
        }

        const data1 = {
           "phoneNumber": userDetails.phone,
            "email": userDetails.email,
            "name": userDetails.name,
        
            "session": {
                "network": userInfo.network,
                "deviceInfo": userInfo.deviceInfo,
                
            },
            "active_session": {
                "network": userInfo.network,
                "deviceInfo": userInfo.deviceInfo,
                
            },

            // "asid":loginInfo.sessionInfo.sessionId,
            "token": userInfo.token,
            // "identity": loginInfo.identities[0],
            // "fingerprint": {
            //     "network": loginInfo.network,
            //     "deviceInfo": loginInfo.deviceInfo,
            //     "userId": loginInfo.userId
            // }
        }

        try {
            const response = await fetch("http://localhost:5000/add_user", {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });
    
            setIsLoading(false);
    
            if (response.status === 200) {
                console.log(response)
                console.log(response.user)
                navigate('/subscription');
            } else {
                const errorData = await response.json();
                setError(errorData.error);
                setTimeout(() => {
                    setError(null);
                }, 3000);
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Error:', error);
            setError('An unexpected error occurred.');
            setTimeout(() => {
                setError(null);
            }, 3000);
        }
    }

    return (
        <>  
            <form className="registration-form" onSubmit={(event)=> finalAuth(event)}>

                <div className="register">
                    <img src={mathrubhumiIcon} alt="" />
                </div>

                <div className="registering">
                    <p>Thank you for registering with us</p>
                </div>

                <div className="tellUs">
                    <p>Tell us more about you</p>
                </div>

                <div className="inputBoxes">
                    <div className="name">
                        <select name="" id="">
                            <option value="Mr" >Mr</option>
                            <option value="Ms">Ms</option>
                            <option value="Mrs">Mrs</option>
                        </select>
                        <input type="text" value={userDetails.name} name='name' onChange={handelChange} placeholder='Enter your name' required/>
                    </div>

                    <div className="number">
                        <input type="text" value={userDetails.phone} name='phone' onChange={handelChange} placeholder='Enter your phone number (optional)' readOnly={phoneInputReadOnly}required />
                    </div>

                    <div className="dob">
                        <input ref={dateRef} type="text" placeholder="Date Of Birth" name='dob' onFocus={() => (dateRef.current.type = "date")}
        onBlur={() => (dateRef.current.type = "text")} onChange={handelChange} required />
                    </div>

                    <div className="addEmail">
                        <input type="text" placeholder="Enter your email id (optional)" value={userDetails.email} name='email' onChange={handelChange} readOnly={emailInputReadOnly} required />
                    </div>
                </div>

                <div className="proceedButton" >
                     {!isLoading ?<button type='submit'>Proceed</button> : <button><ClipLoader size={10} /></button>}
                </div>
            </form>
            {error && <div className='alert'><div className='alert-inner'>{error}</div></div>}
        </>
    )
}

export default Registration