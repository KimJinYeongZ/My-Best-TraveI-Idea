import React, { createContext, useState, ReactNode } from "react";

interface AccessTokenType {
  accessToken: string | null; // accessToken은 소문자로 시작해야 합니다.
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
}

// 컨텍스트에는 'Context' 접미사를 추가합니다.
export const AccessTokenContext = createContext<AccessTokenType>({
  accessToken: null, // 여기도 소문자로 시작합니다.
  setAccessToken: () => {},
});

export const AccessTokenProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null); // 상태 변수의 이름을 소문자로 시작하게 변경합니다.

  return (
    <AccessTokenContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AccessTokenContext.Provider>
  );
};
