const VerifyEmailCode = async (code: string) => {
  const response = await fetch(`/api/auth/verify/email-token?code=${code}`);
  if (!response.ok) {
    throw new Error();
  }
  return { success: true };
};

export default VerifyEmailCode;
