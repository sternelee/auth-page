const baseURL = 'https://api.leeapps.cn/daily';
const redirectUri = 'https://static.leeapps.cn/index.html'

export interface CodeChallenge {
  challenge: string,
  verifier: string,
}


// 创建 code_challenge
const generateChallenge = async (): Promise<CodeChallenge> => {
  const array = new Uint32Array(32);
  window.crypto.getRandomValues(array);
  const verifier = Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');

  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hashed = await window.crypto.subtle.digest('SHA-256', data);
  const challenge = btoa(String.fromCharCode(...new Uint8Array(hashed)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  return {verifier, challenge};
}

// 获取授权接口
const getAuthorizationUrl = (provider: string, redirectUri: string, codeChallenge: string): string => {
  return `${baseURL}/v1/auth/authorize?provider=${provider}&redirect_uri=${encodeURI(redirectUri)}&code_challenge=${codeChallenge}`;
}

// 跳转授权页面
const goAuth = async () => {
  const codeChallenge = await generateChallenge()
  const url = getAuthorizationUrl('github', redirectUri, codeChallenge.challenge)
  window.location.href = url
}