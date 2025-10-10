export const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log('🎲 OTP Generated:', otp);
  return otp;
};

export const verifyOTP = (storedOTP, otpExpiry, inputOTP) => {
  console.log('🔍 Verifying OTP');
  console.log('Stored OTP:', storedOTP);
  console.log('Input OTP:', inputOTP);
  console.log('Expiry:', otpExpiry);
  console.log('Current time:', new Date());

  if (!storedOTP || !otpExpiry) {
    console.log('❌ No OTP or expiry found');
    return false;
  }

  if (new Date() > new Date(otpExpiry)) {
    console.log('❌ OTP expired');
    return false;
  }

  const isValid = storedOTP === inputOTP;
  console.log('✅ OTP valid:', isValid);
  return isValid;
};
