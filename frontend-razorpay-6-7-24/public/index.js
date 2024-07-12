// const callback = (userinfo) => {
//   const emailMap = userinfo.identities.find(
//     (item) => item.identityType === "EMAIL"
//   );

//   const mobileMap = userinfo.identities.find(
//     (item) => item.identityType === "MOBILE"
//   )?.identityValue;

//   const token = userinfo.token;

//   const email = emailMap?.identityValue;

//   const mobile = mobileMap?.identityValue;

//   const name = emailMap?.name || mobileMap?.name;

//   console.log(userinfo);

//   // Save userinfo to window object
//   window.userDetails = userinfo

//   // Implement your custom logic here.
// };

// // Initialize OTPLESS SDK with the defined callback.
// const OTPlessSignin = new OTPless(callback);
// window.OTPlessSignin = OTPlessSignin;