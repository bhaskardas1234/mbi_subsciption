// import React, { useEffect, useState } from 'react';
// import emailIcon from '../asset/gmail.png';
// import whatsappIcon from '../asset/whatsapp.png';
// import googleIcon from '../asset/google.png';
// import facebookIcon from '../asset/facebook.png';
// import closeIcon from '../asset/close.png';
// import successIcon from '../asset/success-2.gif';
// import correctIcon from '../asset/correct.png';
// // import './Signup.css';
// import { SERVER_URI } from '../index.js';
// import Loader from './Loader.jsx';
// import { useNavigate } from 'react-router-dom';

// const Signup = () => {
    
//     const navigate = useNavigate();
//     const [loginStatus, setLoginStatus] = useState('INIT');
//     const [loginInfo, setLoginInfo] = useState(null);
//     const [otplessLoaded, setOtplessLoaded] = useState(false);
//     const [otpLessSigin, setOtpLessSigin] = useState(false);
//     const [loginMode, setLoginMode] = useState(localStorage.getItem('loginMode'));
//     const [userEmail, setUserEmail] = useState(null);
//     const [userPhone, setUserPhone] = useState(null);
//     const [showAuthLoadingMessage, setShowAuthLoadingMessage] = useState(null);
//     const [fullLoginInfo, setFullLoginInfo] = useState(null);
//     const [showLoader, setShowLoader] = useState(true);
//     const [userDob, setUserDob] = useState("");
//     const [userName, setUserName] = useState("");
//     const [success, setSuccess] = useState(true);

//     useEffect(() => {
//         if(localStorage.getItem('loginMode') == null) {
//             localStorage.setItem("loginMode", "phone");
//         }else {
//             setLoginMode(localStorage.getItem('loginMode'));
//         }
//         return(()=> {
//             localStorage.removeItem("loginMode");
//         })
//     }, [])

//     useEffect(() => {
//         // Check if OTPless is loaded
        
//         const checkOTPlessLoaded = setInterval(() => {
//             if (window.OTPless) {
//                 clearInterval(checkOTPlessLoaded);
//                 setOtplessLoaded(true);

//                 const callback = (userinfo) => {
//                     const emailMap = userinfo.identities.find(
//                       (item) => item.identityType === "EMAIL"
//                     );

//                     const mobileMap = userinfo.identities.find(
//                       (item) => item.identityType === "MOBILE"
//                     )?.identityValue;

//                     const token = userinfo.token;

//                     const email = emailMap?.identityValue;

//                     const mobile = mobileMap?.identityValue;

//                     const name = emailMap?.name || mobileMap?.name;

//                     setLoginInfo(userinfo);
//                 };
//                 setOtpLessSigin(new window.OTPless(callback));
//             }
//         }, 100);

//         return () => clearInterval(checkOTPlessLoaded);
//     }, []);

//     function changeLoginMode(mode) {
//         localStorage.setItem('loginMode', mode);
//     }
//     const oAuthHandler = async (providerName) => {
//         if(providerName === "WHATSAPP") setLoginMode("phone");
//         else setLoginMode("email");
//         changeLoginMode(loginMode)
//         await otpLessSigin.initiate({ channel: "OAUTH", channelType: providerName });

//     };
//     const phoneAuth = async(phoneNumber) => {
//         otpLessSigin.initiate({
//           channel: "PHONE",
//           phone: phoneNumber,
//           countryCode: "+91",
//         });
//         changeLoginMode("phone")
//         setLoginMode("phone")
//         setLoginStatus("LOADING");
//         setShowAuthLoadingMessage(`Click on the link send to +91-${phoneNumber}`);
//     };
//     const emailAuth = (email) => {
//         console.log(email);
//         changeLoginMode("email");
//         setLoginMode("email")
//         setLoginStatus("LOADING");
//         setShowAuthLoadingMessage(`Click on the link send to ${email}`);
//         otpLessSigin.initiate({ channel: "EMAIL", email: email });
//       };      

//     useEffect(() => {
//         if (loginInfo) {
//             console.log(loginInfo);
//             setLoginStatus("PARTIAL_SUCCESS");
//             if(loginInfo.identities[0].identityType === "EMAIL")setShowAuthLoadingMessage("Email verified successfully");
//             else if(loginInfo.identities[0].identityType === "MOBILE")setShowAuthLoadingMessage("Mobile verified successfully");
//             setTimeout(() => {
//                 setShowLoader(false);
//                 // setLoginStatus("SUCCESS");
//             }, 2000);
//             navigate('/')
//         }
//     }, [loginInfo]);

//     const finalAuth = async() => {
//         // if(loginMode == "email") {

//         // }else if (loginMode === "phone") {

//         // }
//         const data = {
//             "phoneNumber": userPhone,
//             // "email": userEmail,
//             "name": userName,
//             "status": "SUCCESS",
//             "asid":loginInfo.sessionInfo.sessionId,
//             "token": loginInfo.token,
//             "identity": loginInfo.identities[0],
//             "fingerprint": {
//                 "network": loginInfo.network,
//                 "deviceInfo": loginInfo.deviceInfo,
//                 "userId": loginInfo.userId
//             }
//         }

//         const response = await fetch("http://localhost:5000/addUser", {
//             method: "POST",
//             mode: "cors",
//             cache: "no-cache", 
//             credentials: "same-origin",
//             headers: {
//             "Content-Type": "application/json",
//             },
//             body: JSON.stringify(data)
//         });
//         if(response.status === 200) {
//             setSuccess(true);
//             // setTimeout(() => {
//             //     setSuccess(false);
//             //     navigate('/home');
//             // }, 3000);
//         }
//     }

//     return (
//         <>
//             <div className="signup-ct">
//                 <div className='form-container'>
//                     <form className='form-ct'>
//                         {
//                             loginStatus === "INIT" ?
//                             <>
//                             <div className="form-head">Sign Up</div>
//                             <div className='form-inner'>
//                             {
//                                 loginMode === "phone" ? 
//                                 <div className="label-ct">
//                                     <input type="text" placeholder='Enter your phone number' onChange={(event)=> setUserPhone(event.target.value)} />
//                                     <button type="button" onClick={() => phoneAuth(userPhone)}>Continue</button>
//                                 </div>
//                                 :
//                                 <div className="label-ct">
//                                     <input type="email" placeholder='Enter your email' onChange={(event)=> setUserEmail(event.target.value)}  required/>
//                                     <button type="button" onClick={() => emailAuth(userEmail)}>Continue</button>
//                                 </div>
//                             }
                            
//                             <div className="icon-ct">
//                                 <div className="icon-div"  onClick={() => setLoginMode('email')}><img src={emailIcon} alt='whatsapp-image' /></div>
//                                 <div className="icon-div" onClick={() => oAuthHandler("WHATSAPP")}><img src={whatsappIcon} alt='whatsapp-image' /></div>
//                                 <div className="icon-div" onClick={() => oAuthHandler("GMAIL")} ><img src={googleIcon} alt='google-image' /></div>
//                                 <div className="icon-div" onClick={() => oAuthHandler("FACEBOOK")}><img src={facebookIcon} alt='facebook-image' /></div>
//                             </div>
//                             <div className="utility-text">
//                                 <p className="text">Already have an account? <a href="/login">Login</a></p>
//                                 Our Privacy policy <a href="/privacy-policy">here</a>
//                             </div>
//                         </div> 
//                         </>
//                             :
//                             <>
//                             {
//                                 loginStatus === "LOADING" ?
//                                 <>  <div className='loading-ct'>
//                                         <div><Loader /></div>
                                        
//                                         <div className='loading-message'>{showAuthLoadingMessage}</div>
//                                     </div>
                                    
//                                 </>
//                                 :
//                                 <>
//                                 {
//                                     loginStatus === "PARTIAL_SUCCESS" ?
//                                     <>
//                                         {
//                                             showLoader ? 
//                                             <>
//                                             <div className='loading-ct'>
//                                                 <Loader />
//                                                 <div className='loading-message'>{showAuthLoadingMessage}</div>
//                                             </div>
//                                             </>
//                                             :
//                                             <>
//                                                 <div className="form-head">Sign Up</div>
//                                                 <div className='form-inner'>
//                                                     <div className="label-ct">
//                                                         {loginMode === "phone" ?<input type="text" placeholder='Enter your name' value={loginInfo.identities[0].name}  onChange={(event)=> setUserName(event.target.value)}/> : <input type="text" placeholder='Enter your name' onChange={(event)=> setUserName(event.target.value)}/>}
//                                                     </div>
//                                                     <div className="label-ct">
//                                                         {loginMode === "phone" ?<input type="text" placeholder='Enter your phone number' value={loginInfo.identities[0].identityValue}  readOnly onChange={(event)=> setUserPhone(event.target.value)}/> : <input type="text" placeholder='Enter your phone number' onChange={(event)=> setUserPhone(event.target.value)}/>}
//                                                     </div>
//                                                     <div className="label-ct">
//                                                         <input type="date" placeholder='Enter your DOB' onChange={(event)=> setUserDob(event.target.value)}/>
//                                                     </div>
//                                                     <div className="label-ct">
//                                                         {loginMode === "email" ?<input type="email" placeholder='Enter your email' value={loginInfo.identities[0].identityValue} readOnly /> : <input type="email" placeholder='Enter your email' onChange={(event)=> setUserEmail(event.target.value)} />}
                                                        
//                                                     </div>
//                                                     <button type="button" onClick={() => finalAuth()}>Proceed</button>
//                                                     {/* <div className="utility-text">
//                                                         <p className="text">Already have an account? <a href="/login">Login</a></p>
//                                                         Our Privacy policy <a href="/privacy-policy">here</a>
//                                                     </div> */}
//                                                 </div> 
//                                             </>
//                                         }
//                                     </>
//                                     :
//                                     <>
//                                     <div>Full Success</div>
//                                     </>
//                                 }
//                                 </>
//                             } 
//                             </>

//                         }
//                     </form>
//                 </div>:

//                 {/* {
//                     loginInfo && 
//                     <div className='form-container'>
//                     <form className='form-ct'>
//                         <Loader />
//                     </form>
//                 </div>
//                 } */}
//             </div>
//         </>
//     );
// };

// export default Signup;
