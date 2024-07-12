import React, { useEffect, useState } from "react";

import "./Login.css";
import { useNavigate } from "react-router-dom";

import googleIcon from "../asset/google.png";
import facebookIcon from "../asset/facebook.png";
import whatsappIcon from "../asset/whatsapp.png";
import mathrubhumiIcon from "../asset/mathrubhumi-logo.png";
import emailIcon from "../asset/email.png";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ClipLoader } from 'react-spinners';

const Login = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState();
  const [loginMode, setLoginMode] = useState();
  const [otpLessSigin, setOtpLessSigin] = useState(false);
  const [otplessLoaded, setOtplessLoaded] = useState(false);
  const [loginInfo, setLoginInfo] = useState(null);
  const [nativeEmail, setNativeEmail] = useState(false);
  const [nativePhone, setNativePhone] = useState(false);
  const [userPhone, setUserPhone] = useState(null);
  const [countryCode, setCountryCode] = useState("");
  const [userEmail, setUserEmail] = useState(null);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if OTPless is loaded

    const checkOTPlessLoaded = setInterval(() => {
      if (window.OTPless) {
        clearInterval(checkOTPlessLoaded);
        setOtplessLoaded(true);

        const callback = (userinfo) => {
          const emailMap = userinfo.identities.find(
            (item) => item.identityType === "EMAIL"
          );

          const mobileMap = userinfo.identities.find(
            (item) => item.identityType === "MOBILE"
          )?.identityValue;

          const token = userinfo.token;

          const email = emailMap?.identityValue;

          const mobile = mobileMap?.identityValue;

          const name = emailMap?.name || mobileMap?.name;
          console.log(token);

          setLoginInfo(userinfo);
          localStorage.setItem("userInfo", JSON.stringify(userinfo));
          console.log(userinfo);
          navigate("/register");
        };
        setOtpLessSigin(new window.OTPless(callback));
      }
    }, 100);

    return () => clearInterval(checkOTPlessLoaded);
  }, []);

  function changeLoginMode(mode) {
    localStorage.setItem("loginMode", mode);
  }
  const oAuthHandler = async (providerName) => {
    setLoginMode(providerName);
    changeLoginMode(providerName);
    await otpLessSigin.initiate({
      channel: "OAUTH",
      channelType: providerName,
    });
  };
  const phoneAuth = async (phoneNumber) => {
    console.log(phoneNumber);
    otpLessSigin.initiate({
      channel: "PHONE",
      phone: phoneNumber,
      countryCode: "",
    });
  };
  const emailAuth = async (email) => {
    await otpLessSigin.initiate({ channel: "EMAIL", email: email });
  };

  const handelEmailClick = () => {
    setNativeEmail(!nativeEmail);
    changeLoginMode("EMAIL");
  };

  const verifyOTP = async (otp) => {
    setIsLoading(true)
    otpLessSigin.verify({
      channel: "PHONE",
      phone: userPhone,
      otp: otp,
      countryCode: "",
    });
  };

  const handelNativePhoneAuth = () => {
    changeLoginMode("SMS")
    console.log("stat");
    if(userPhone == null) {
      alert("phone can not be empty");
    }
    else {
      setNativePhone(true);
    phoneAuth(userPhone);
    }
  }

  return (
    <>
      <div className="login-form">
        <div className="register">
          <img src={mathrubhumiIcon} alt="" />
        </div>

        <div className="registerToLogin">
          <p>Register to login</p>
        </div>

        <div className="mobileNumber">
          <p>Enter mobile number</p>
        </div>

        {!nativeEmail ? (
          <>
            <div className="inp">
              <PhoneInput
                country={"in"}
                placeholder="Enter phone number"
                onChange={(phone, data) => {setUserPhone(phone); setCountryCode(data.dialCode)}}
              />
            </div>
            {nativePhone && (
              <input
                type="text"
                placeholder="Enter the OTP"
                onChange={(event) => setOtp(event.target.value)}
                className="native-phone-input"
              />
            )}
            {!nativePhone ? (
              <div className="continue" onClick={handelNativePhoneAuth}>
                <button>Continue</button>
              </div>
            ) : (
              <div className="continue" onClick={() => verifyOTP(otp)}>
                {!isLoading ? <button>Verify & Continue</button>: <button><ClipLoader size={10} /></button>}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="inp">
              <input
                type="email"
                onChange={(event) => setUserEmail(event.target.value)}
                className="native-phone-input"
                placeholder="Enter your email"
              />
            </div>
            <div className="continue">
              <button onClick={() => emailAuth(userEmail)}>Continue</button>
              {
                nativeEmail && <button onClick={() => {setNativeEmail(false); changeLoginMode("SMS")}} style={{marginLeft:"1rem"}}>Cancel</button>
              }
            </div>
          </>
        )}

        <div className="or">
          <hr />
          <p>or</p>
          <hr />
        </div>

        <div className="whatsapp" onClick={() => oAuthHandler("WHATSAPP")}>
          <button>
            <img className="whatsappIcon" src={whatsappIcon} /> Whatsapp
          </button>
        </div>

        <div className="viaText">
          <p>You can also login via</p>
        </div>

        <div className="otherLoginOptions">
          <div className="email-google-facebook">
            <div className="email" onClick={() => handelEmailClick()}>
              <img className="otherLoginIcon" src={emailIcon} />
            </div>
            <div className="google" onClick={() => oAuthHandler("GMAIL")}>
              <img className="otherLoginIcon" src={googleIcon} />
            </div>
            <div className="facebook" onClick={() => oAuthHandler("FACEBOOK")}>
              <img className="otherLoginIcon" src={facebookIcon} />
            </div>
          </div>
        </div>

        <div className="terms">
          <p>
            By signing up, you agree to the <a href="">terms and conditions.</a>
          </p>
        </div>

        <div className="guest">
          <p>Continue as a guest</p>
        </div>
      </div>
    </>
  );
};

export default Login;

// position: relative;
//     font-size: 14px;
//     letter-spacing: .01rem;
//     margin-top: 0 !important;
//     margin-bottom: 0 !important;
//     padding-left: 48px;
//     margin-left: 0;
//     background: #FFFFFF;
//     border: 1px solid #CACACA;
//     border-radius: 5px;
//     line-height: 25px;
//     height: 35px;
//     width: 300px;
//     outline: none;